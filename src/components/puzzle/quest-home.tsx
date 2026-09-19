"use client"

import Link from "next/link"
import { Check, ChevronRight, Lock, Sparkles, Users } from "lucide-react"

import { MonsterCard } from "@/components/puzzle/monster-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DUNGEONS, isUnlocked } from "@/lib/puzzle/dungeons"
import { ELEMENT_THEME } from "@/lib/puzzle/element-theme"
import { partyTotals, type PartyMember } from "@/lib/puzzle/party"
import { TIME_LIMIT_CHOICES } from "@/lib/puzzle/save"
import type { Dungeon, SaveData } from "@/lib/puzzle/types"
import { cn } from "@/lib/utils"

type QuestHomeProps = {
  save: SaveData
  members: PartyMember[]
  onStart: (dungeon: Dungeon) => void
  onOpenMonsters: () => void
  onChangeTimeLimit: (seconds: number | null) => void
}

export function QuestHome({
  save,
  members,
  onStart,
  onOpenMonsters,
  onChangeTimeLimit,
}: QuestHomeProps) {
  const totals = partyTotals(members)
  const leader = members[0]

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col items-center gap-2 text-center">
        <Badge className="gap-1.5 bg-linear-to-r from-violet-500 to-sky-500 px-3 py-1 text-[0.7rem] tracking-widest">
          <Sparkles className="size-3" />
          PUZZLE RPG
        </Badge>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          ドロップクエスト
        </h1>
        <p className="text-muted-foreground text-sm">
          ドロップをつないで、竜の頂をめざそう
        </p>
      </header>

      {/* パーティ */}
      <Card className="gap-3 rounded-3xl border-2 shadow-lg">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground text-xs tracking-widest">
              パーティ
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMonsters}
              className="h-8 gap-1 rounded-full"
            >
              <Users className="size-3.5" />
              編成・強化
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {members.map((member, index) => {
              const theme = ELEMENT_THEME[member.spec.element]
              return (
                <div
                  key={member.owned.uid}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl border px-1 py-2",
                    theme.soft
                  )}
                >
                  <span className="text-2xl leading-none">{member.spec.emoji}</span>
                  <span className="text-[0.6rem] leading-tight tabular-nums">
                    Lv{member.owned.level}
                  </span>
                  {index === 0 && (
                    <span className="text-[0.6rem] leading-tight text-amber-500">
                      リーダー
                    </span>
                  )}
                </div>
              )
            })}
            {Array.from({ length: Math.max(0, 4 - members.length) }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border-muted-foreground/20 text-muted-foreground/50 flex flex-col items-center justify-center rounded-xl border border-dashed py-2 text-[0.65rem]"
              >
                空き
              </div>
            ))}
          </div>

          <div className="text-muted-foreground grid grid-cols-3 gap-2 text-center text-xs tabular-nums">
            <span>HP {totals.maxHp.toLocaleString()}</span>
            <span>攻撃 {totals.atk.toLocaleString()}</span>
            <span>回復 {totals.rcv.toLocaleString()}</span>
          </div>

          {leader?.spec.leaderSkill && (
            <p className="bg-muted/60 text-muted-foreground rounded-xl px-3 py-2 text-[0.7rem] leading-snug">
              <span className="text-foreground font-medium">
                {leader.spec.leaderSkill.name}
              </span>
              （{leader.spec.name}）：{leader.spec.leaderSkill.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ダンジョン */}
      <section className="flex flex-col gap-2">
        <Label className="text-muted-foreground text-xs tracking-widest">
          ダンジョン
        </Label>
        {DUNGEONS.map((dungeon) => {
          const unlocked = isUnlocked(dungeon, save.clearedDungeons)
          const cleared = save.clearedDungeons.includes(dungeon.id)
          return (
            <button
              key={dungeon.id}
              type="button"
              disabled={!unlocked || members.length === 0}
              onClick={() => onStart(dungeon)}
              className={cn(
                "bg-card flex items-center gap-3 rounded-2xl border-2 p-3 text-left shadow-sm transition",
                unlocked
                  ? "hover:border-foreground/20 active:scale-[0.99]"
                  : "cursor-not-allowed opacity-50"
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-sm font-bold">
                  {dungeon.name}
                  {cleared && (
                    <Check className="size-3.5 text-emerald-500" aria-label="クリア済み" />
                  )}
                  {!unlocked && (
                    <Lock className="text-muted-foreground size-3.5" aria-label="未解放" />
                  )}
                </span>
                <span className="text-muted-foreground text-[0.7rem] leading-snug">
                  {unlocked
                    ? dungeon.description
                    : `「${DUNGEONS.find((d) => d.id === dungeon.requires)?.name}」をクリアすると挑戦できる`}
                </span>
                <span className="text-muted-foreground text-[0.65rem] tabular-nums">
                  {dungeon.floors.length} 階　経験値 {dungeon.exp.toLocaleString()}
                </span>
              </div>
              <ChevronRight className="text-muted-foreground size-4 shrink-0" />
            </button>
          )
        })}
      </section>

      {/* 設定 */}
      <section className="flex flex-col gap-2">
        <Label className="text-muted-foreground text-xs tracking-widest">
          操作時間
        </Label>
        <div className="grid grid-cols-4 gap-1.5">
          {TIME_LIMIT_CHOICES.map((choice) => {
            const active = save.settings.timeLimitSec === choice
            return (
              <button
                key={String(choice)}
                type="button"
                onClick={() => onChangeTimeLimit(choice)}
                className={cn(
                  "rounded-xl border-2 py-2 text-xs font-medium transition",
                  active
                    ? "border-violet-400 bg-violet-500 text-white"
                    : "bg-card hover:border-foreground/20"
                )}
              >
                {choice === null ? "無制限" : `${choice} 秒`}
              </button>
            )
          })}
        </div>
      </section>

      {/* 手持ち */}
      <section className="flex flex-col gap-2">
        <Label className="text-muted-foreground text-xs tracking-widest">
          なかま（{save.monsters.length} 体）
        </Label>
        <div className="grid grid-cols-2 gap-1.5">
          {save.monsters.slice(0, 4).map((monster) => (
            <MonsterCard key={monster.uid} monster={monster} />
          ))}
        </div>
        {save.monsters.length > 4 && (
          <Button variant="ghost" size="sm" onClick={onOpenMonsters}>
            すべて見る
          </Button>
        )}
      </section>

      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-center text-xs underline underline-offset-4"
      >
        かなフラッシュへもどる
      </Link>
    </div>
  )
}
