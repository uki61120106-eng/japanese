"use client"

import type { ReactNode } from "react"

import { ELEMENT_THEME } from "@/lib/puzzle/element-theme"
import { expToNextLevel, statsAt } from "@/lib/puzzle/party"
import { requireMonsterSpec } from "@/lib/puzzle/monsters"
import type { OwnedMonster } from "@/lib/puzzle/types"
import { cn } from "@/lib/utils"

type MonsterCardProps = {
  monster: OwnedMonster
  selected?: boolean
  disabled?: boolean
  /** 右上に出す印（リーダー、素材など） */
  badge?: ReactNode
  /** ステータスと次のレベルまでの経験値も出す */
  detailed?: boolean
  onClick?: () => void
}

export function MonsterCard({
  monster,
  selected = false,
  disabled = false,
  badge,
  detailed = false,
  onClick,
}: MonsterCardProps) {
  const spec = requireMonsterSpec(monster.specId)
  const theme = ELEMENT_THEME[spec.element]
  const stats = statsAt(spec, monster.level)
  const maxed = monster.level >= spec.maxLevel
  const need = expToNextLevel(monster.level)

  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className="text-2xl leading-none">{spec.emoji}</span>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="w-full truncate text-sm font-bold">{spec.name}</span>
          <span className="flex items-center gap-1 text-[0.65rem]">
            <span className={cn("rounded-full border px-1.5", theme.chip)}>
              {theme.label}
            </span>
            <span className="text-muted-foreground tabular-nums">
              Lv{monster.level} / {spec.maxLevel}
            </span>
            <span className="text-amber-500">{"★".repeat(spec.rarity)}</span>
          </span>
        </div>
        {badge}
      </div>

      {detailed && (
        <div className="flex w-full flex-col gap-1">
          <div className="text-muted-foreground grid grid-cols-3 gap-1 text-[0.65rem] tabular-nums">
            <span>HP {stats.hp.toLocaleString()}</span>
            <span>攻 {stats.atk.toLocaleString()}</span>
            <span>回 {stats.rcv.toLocaleString()}</span>
          </div>
          <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
            <div
              className={cn("h-full rounded-full", theme.fill)}
              style={{
                width: maxed ? "100%" : `${Math.min(100, (monster.exp / need) * 100)}%`,
              }}
            />
          </div>
          {spec.leaderSkill && (
            <p className="text-muted-foreground text-left text-[0.65rem] leading-snug">
              <span className="font-medium">{spec.leaderSkill.name}</span>：
              {spec.leaderSkill.description}
            </p>
          )}
        </div>
      )}
    </>
  )

  const className = cn(
    "flex w-full flex-col gap-1.5 rounded-2xl border-2 p-2 text-left transition",
    theme.soft,
    selected ? "border-foreground/40 shadow-md" : "border-transparent",
    disabled && "cursor-not-allowed opacity-40",
    onClick && !disabled && "hover:border-foreground/20 active:scale-[0.98]"
  )

  if (!onClick) {
    return <div className={className}>{content}</div>
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  )
}
