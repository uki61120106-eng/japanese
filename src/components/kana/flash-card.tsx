"use client"

import { RotateCcw } from "lucide-react"

import type { Kana } from "@/lib/kana"
import { ROW_THEME } from "@/lib/row-theme"
import { cn } from "@/lib/utils"

type FlashCardProps = {
  kana: Kana
  flipped: boolean
  onFlip: () => void
}

export function FlashCard({ kana, flipped, onFlip }: FlashCardProps) {
  const theme = ROW_THEME[kana.row]

  return (
    <div className="perspective-[1400px] w-full">
      <button
        type="button"
        onClick={onFlip}
        aria-label={flipped ? "カードを表に戻す" : "カードをめくって答えを見る"}
        aria-pressed={flipped}
        className={cn(
          "relative block w-full transform-3d transition-transform duration-500 ease-out",
          "aspect-4/5 max-h-[58vh] min-h-70",
          "focus-visible:ring-ring/60 rounded-3xl outline-none focus-visible:ring-4",
          flipped && "rotate-y-180"
        )}
      >
        {/* 表：大きな文字 */}
        <span
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl",
            "bg-linear-to-br text-white shadow-xl backface-hidden",
            theme.cardFace
          )}
        >
          <span className="text-[clamp(6rem,26vw,11rem)] leading-none font-bold drop-shadow-sm">
            {kana.char}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-white/85">
            <RotateCcw className="size-4" />
            タップして答えを見る
          </span>
        </span>

        {/* 裏：読み方と例単語 */}
        <span
          className={cn(
            "bg-card absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-6 rounded-3xl",
            "px-6 shadow-xl ring-4 backface-hidden",
            theme.ring
          )}
        >
          <span className="flex flex-col items-center gap-1">
            <span className="text-muted-foreground text-xs font-medium tracking-widest">
              よみかた
            </span>
            <span
              className={cn(
                "text-[clamp(3rem,16vw,5.5rem)] leading-none font-bold",
                theme.text
              )}
            >
              {kana.romaji}
            </span>
          </span>

          <span className="bg-border h-px w-24" />

          <span className="flex flex-col items-center gap-1.5 text-center">
            <span className="text-muted-foreground text-xs font-medium tracking-widest">
              れいたんご
            </span>
            <span className="text-3xl font-bold">{kana.word}</span>
            <span className="text-muted-foreground text-base">
              {kana.wordRomaji}
            </span>
            <span className="text-foreground/80 text-sm">
              {kana.wordMeaning}
            </span>
          </span>
        </span>
      </button>
    </div>
  )
}
