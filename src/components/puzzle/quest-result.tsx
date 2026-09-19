"use client"

import { Home, RotateCcw, Sparkles, Trophy } from "lucide-react"

import { MonsterCard } from "@/components/puzzle/monster-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { requireMonsterSpec } from "@/lib/puzzle/monsters"
import type { ClearRewards } from "@/lib/puzzle/save"
import type { Dungeon } from "@/lib/puzzle/types"
import { cn } from "@/lib/utils"

type QuestResultProps = {
  dungeon: Dungeon
  outcome: "win" | "lose"
  turns: number
  /** 勝ったときだけ入る */
  rewards: ClearRewards | null
  onRetry: () => void
  onHome: () => void
}

export function QuestResult({
  dungeon,
  outcome,
  turns,
  rewards,
  onRetry,
  onHome,
}: QuestResultProps) {
  const won = outcome === "win"

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col items-center gap-2 text-center">
        <span
          className={cn(
            "flex size-16 items-center justify-center rounded-full text-3xl",
            won
              ? "bg-linear-to-br from-amber-300 to-yellow-500 text-white"
              : "bg-muted"
          )}
        >
          {won ? <Trophy className="size-8" /> : "💤"}
        </span>
        <h1 className="text-3xl font-black tracking-tight">
          {won ? "クリア！" : "ぜんめつ…"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {dungeon.name}　{turns} ターン
        </p>
      </header>

      {won && rewards && (
        <Card className="gap-4 rounded-3xl border-2 shadow-lg">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">獲得経験値</span>
              <span className="text-lg font-black tabular-nums">
                {rewards.exp.toLocaleString()}
              </span>
            </div>

            {rewards.levelUps.length > 0 && (
              <section className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs tracking-widest">
                  レベルアップ
                </span>
                {rewards.levelUps.map((levelUp) => (
                  <p key={levelUp.uid} className="flex items-center gap-1.5 text-sm">
                    <Sparkles className="size-3.5 text-amber-500" />
                    {requireMonsterSpec(levelUp.specId).name}
                    <span className="text-muted-foreground tabular-nums">
                      Lv{levelUp.before} → Lv{levelUp.after}
                    </span>
                  </p>
                ))}
              </section>
            )}

            <section className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs tracking-widest">
                なかまになった
              </span>
              {rewards.obtained.length === 0 ? (
                <p className="text-muted-foreground text-sm">なし</p>
              ) : (
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {rewards.obtained.map((monster) => (
                    <MonsterCard key={monster.uid} monster={monster} />
                  ))}
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      )}

      {!won && (
        <p className="text-muted-foreground text-center text-sm">
          報酬はありません。パーティを強化してからもう一度挑みましょう。
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button className="h-12 rounded-xl text-base" onClick={onRetry}>
          <RotateCcw className="size-4" />
          もう一度いどむ
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-xl text-base"
          onClick={onHome}
        >
          <Home className="size-4" />
          ホームへもどる
        </Button>
      </div>
    </div>
  )
}
