"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, Swords } from "lucide-react"

import { OrbBoard } from "@/components/puzzle/orb-board"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  advanceEnemies,
  computeTurn,
  damageEnemy,
  firstAliveKey,
  isFloorCleared,
  spawnFloor,
  type EnemyInstance,
  type TurnOutcome,
} from "@/lib/puzzle/battle"
import { createBoard, resolveBoard } from "@/lib/puzzle/board"
import { ELEMENT_THEME } from "@/lib/puzzle/element-theme"
import { partyTotals, type PartyMember } from "@/lib/puzzle/party"
import type { Board, Dungeon } from "@/lib/puzzle/types"
import { cn } from "@/lib/utils"

type BattleScreenProps = {
  dungeon: Dungeon
  members: PartyMember[]
  timeLimitSec: number | null
  onFinish: (outcome: "win" | "lose", turns: number) => void
  onQuit: () => void
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function BattleScreen({
  dungeon,
  members,
  timeLimitSec,
  onFinish,
  onQuit,
}: BattleScreenProps) {
  const maxHp = partyTotals(members).maxHp

  // この画面はホームから遷移してきたときだけ描かれるので、
  // 乱数で盤面を作ってもサーバー描画と食い違わない
  const [board, setBoard] = useState<Board>(() => createBoard())
  const [floorIndex, setFloorIndex] = useState(0)
  const [enemies, setEnemies] = useState<EnemyInstance[]>(() =>
    spawnFloor(dungeon, 0)
  )
  const [targetKey, setTargetKey] = useState<string | null>(null)
  const [hp, setHp] = useState(maxHp)
  const [phase, setPhase] = useState<"input" | "resolving" | "over">("input")
  const [clearing, setClearing] = useState<Set<string>>(new Set())
  const [combo, setCombo] = useState(0)
  const [outcome, setOutcome] = useState<TurnOutcome | null>(null)
  const [message, setMessage] = useState("ドロップを動かして攻撃しよう")
  const [turns, setTurns] = useState(0)

  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const target =
    enemies.find((enemy) => enemy.key === targetKey && enemy.hp > 0) ??
    enemies.find((enemy) => enemy.hp > 0) ??
    null

  async function runTurn(released: Board) {
    if (phase !== "input") return
    setPhase("resolving")
    setOutcome(null)
    setCombo(0)

    const result = resolveBoard(released)

    // 消えていく様子を1連鎖ずつ見せる
    let counted = 0
    for (const step of result.steps) {
      const ids = step.matches.flatMap((match) =>
        match.cells.map((cell) => step.boardBefore[cell.row][cell.col].id)
      )
      setBoard(step.boardBefore)
      setClearing(new Set(ids))
      counted += step.matches.length
      setCombo(counted)
      await sleep(260)
      if (!alive.current) return
      setClearing(new Set())
      setBoard(step.boardAfter)
      await sleep(160)
      if (!alive.current) return
    }
    setBoard(result.board)

    const turnNumber = turns + 1
    setTurns(turnNumber)

    let currentEnemies = enemies
    let currentHp = hp

    if (result.combo > 0) {
      const attacked = computeTurn({
        members,
        matches: result.matches,
        combo: result.combo,
        target: target ?? undefined,
      })
      setOutcome(attacked)

      if (target && attacked.damage > 0) {
        currentEnemies = damageEnemy(currentEnemies, target.key, attacked.damage)
        setEnemies(currentEnemies)
      }
      if (attacked.heal > 0) {
        currentHp = Math.min(maxHp, currentHp + attacked.heal)
        setHp(currentHp)
      }
      setMessage(
        attacked.damage > 0
          ? `${result.combo} コンボ！ ${attacked.damage.toLocaleString()} ダメージ`
          : `${result.combo} コンボ（攻撃できる属性がなかった）`
      )
      await sleep(520)
      if (!alive.current) return
    } else {
      setMessage("何も消えなかった")
      await sleep(260)
      if (!alive.current) return
    }

    // フロアの敵を倒しきったか
    if (isFloorCleared(currentEnemies)) {
      const nextFloor = floorIndex + 1
      if (nextFloor >= dungeon.floors.length) {
        setPhase("over")
        setMessage("ダンジョン制覇！")
        await sleep(600)
        if (!alive.current) return
        onFinish("win", turnNumber)
        return
      }
      setMessage(`${nextFloor + 1} 階へ進んだ`)
      setFloorIndex(nextFloor)
      const spawned = spawnFloor(dungeon, nextFloor)
      setEnemies(spawned)
      setTargetKey(firstAliveKey(spawned))
      await sleep(600)
      if (!alive.current) return
      setPhase("input")
      return
    }

    // 敵のターン
    const enemyTurn = advanceEnemies(currentEnemies)
    setEnemies(enemyTurn.enemies)
    const incoming = enemyTurn.actions.reduce(
      (sum, action) => sum + action.damage,
      0
    )
    if (incoming > 0) {
      currentHp = Math.max(0, currentHp - incoming)
      setHp(currentHp)
      setMessage(
        `${enemyTurn.actions.map((action) => action.name).join("・")}の攻撃！ ` +
          `${incoming.toLocaleString()} ダメージ`
      )
      await sleep(520)
      if (!alive.current) return
    }

    if (currentHp <= 0) {
      setPhase("over")
      setMessage("力尽きた…")
      await sleep(600)
      if (!alive.current) return
      onFinish("lose", turnNumber)
      return
    }

    setPhase("input")
  }

  const hpRatio = maxHp > 0 ? hp / maxHp : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onQuit} className="gap-1 px-2">
          <ChevronLeft className="size-4" />
          やめる
        </Button>
        <div className="text-muted-foreground text-xs">
          {dungeon.name}　{floorIndex + 1} / {dungeon.floors.length} F　
          {turns} ターン
        </div>
      </div>

      {/* 敵 */}
      <div className="flex items-end justify-center gap-2">
        {enemies.map((enemy) => {
          const theme = ELEMENT_THEME[enemy.spec.element]
          const dead = enemy.hp <= 0
          const selected = target?.key === enemy.key
          return (
            <button
              key={enemy.key}
              type="button"
              disabled={dead || phase !== "input"}
              onClick={() => setTargetKey(enemy.key)}
              aria-label={`${enemy.spec.name} を狙う`}
              aria-pressed={selected}
              className={cn(
                "flex min-w-0 max-w-32 flex-1 flex-col items-center gap-1 rounded-2xl border-2 p-2 transition",
                theme.soft,
                selected ? "border-foreground/40 shadow-md" : "border-transparent",
                dead && "scale-90 opacity-25"
              )}
            >
              <span className="text-3xl leading-none">{enemy.spec.emoji}</span>
              <span className="w-full truncate text-[0.65rem] leading-tight font-medium">
                {enemy.spec.name}
              </span>
              <span className="bg-background/70 h-1.5 w-full overflow-hidden rounded-full">
                <span
                  className={cn("block h-full rounded-full transition-all", theme.fill)}
                  style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                />
              </span>
              <span className="flex w-full items-center justify-between text-[0.6rem]">
                <span className={theme.text}>{theme.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  あと {enemy.turnsLeft}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* 状況 */}
      <div className="bg-card flex flex-col gap-2 rounded-2xl border p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <Swords className="size-3.5" />
            HP
          </span>
          <span className="text-xs tabular-nums">
            {hp.toLocaleString()} / {maxHp.toLocaleString()}
          </span>
        </div>
        <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              hpRatio > 0.5
                ? "bg-emerald-500"
                : hpRatio > 0.2
                  ? "bg-amber-500"
                  : "bg-rose-500"
            )}
            style={{ width: `${Math.max(0, hpRatio * 100)}%` }}
          />
        </div>

        <div className="flex min-h-9 items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">{message}</p>
          {combo > 0 && (
            <Badge className="shrink-0 bg-linear-to-r from-fuchsia-500 to-rose-500 tabular-nums">
              {combo} コンボ
            </Badge>
          )}
        </div>

        {outcome && outcome.attacks.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {outcome.attacks.map((attack) => {
              const theme = ELEMENT_THEME[attack.element]
              return (
                <span
                  key={attack.element}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[0.65rem] tabular-nums",
                    theme.chip
                  )}
                >
                  {theme.label} {attack.damage.toLocaleString()}
                  {attack.affinity > 1 && " ↑"}
                  {attack.affinity < 1 && " ↓"}
                </span>
              )
            })}
            {outcome.heal > 0 && (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[0.65rem] tabular-nums",
                  ELEMENT_THEME.heart.chip
                )}
              >
                回復 {outcome.heal.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* パーティ */}
      <div className="flex justify-center gap-1.5">
        {members.map((member, index) => {
          const theme = ELEMENT_THEME[member.spec.element]
          return (
            <div
              key={member.owned.uid}
              className={cn(
                "flex flex-1 flex-col items-center rounded-xl border px-1 py-1.5",
                theme.soft
              )}
            >
              <span className="text-lg leading-none">{member.spec.emoji}</span>
              <span className="text-[0.6rem] leading-tight tabular-nums">
                {index === 0 ? "★" : ""}Lv{member.owned.level}
              </span>
            </div>
          )
        })}
      </div>

      {/* 盤面 */}
      <OrbBoard
        board={board}
        disabled={phase !== "input"}
        clearing={clearing}
        onChange={setBoard}
        onRelease={runTurn}
        timeLimitSec={timeLimitSec}
      />
    </div>
  )
}
