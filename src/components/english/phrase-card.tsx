"use client"

import { MessageCircle, RotateCcw } from "lucide-react"

import { getScene, type Phrase } from "@/lib/phrases"
import { SCENE_THEME } from "@/lib/scene-theme"
import { cn } from "@/lib/utils"

type PhraseCardProps = {
  phrase: Phrase
  flipped: boolean
  onFlip: () => void
}

export function PhraseCard({ phrase, flipped, onFlip }: PhraseCardProps) {
  const theme = SCENE_THEME[phrase.scene]
  const scene = getScene(phrase.scene)

  return (
    <div className="perspective-[1400px] w-full">
      <button
        type="button"
        onClick={onFlip}
        aria-label={
          flipped ? "カードを表に戻す" : "カードをめくって英語を見る"
        }
        aria-pressed={flipped}
        className={cn(
          "relative block w-full transform-3d transition-transform duration-500 ease-out",
          "aspect-4/5 max-h-[58vh] min-h-72",
          "focus-visible:ring-ring/60 rounded-3xl outline-none focus-visible:ring-4",
          flipped && "rotate-y-180"
        )}
      >
        {/* 表：日本語。これを見て英語を思い出す */}
        <span
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-3xl px-6",
            "bg-linear-to-br text-white shadow-xl backface-hidden",
            theme.cardFace
          )}
        >
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium tracking-widest">
            {scene.label}
          </span>
          <span className="text-[clamp(1.5rem,7vw,2.25rem)] leading-snug font-bold text-balance drop-shadow-sm">
            {phrase.ja}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-white/85">
            <RotateCcw className="size-4" />
            英語でなんと言う？
          </span>
        </span>

        {/* 裏：英語のフレーズと使い方 */}
        <span
          className={cn(
            "bg-card absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-4 rounded-3xl",
            "overflow-y-auto px-5 py-6 shadow-xl ring-4 backface-hidden",
            theme.ring
          )}
        >
          <span className="flex flex-col items-center gap-2 text-center">
            <span
              className={cn(
                "text-[clamp(1.4rem,6.5vw,2rem)] leading-snug font-bold text-balance",
                theme.text
              )}
            >
              {phrase.en}
            </span>
            <span className="text-muted-foreground text-sm">{phrase.kana}</span>
          </span>

          <span className="bg-border h-px w-24 shrink-0" />

          <span className="text-foreground/80 px-2 text-center text-sm leading-relaxed text-pretty">
            {phrase.note}
          </span>

          {phrase.reply && (
            <span className="bg-muted/70 flex w-full flex-col gap-1 rounded-2xl px-4 py-3 text-left">
              <span className="text-muted-foreground flex items-center gap-1.5 text-[0.7rem] font-medium tracking-widest">
                <MessageCircle className="size-3" />
                あいての へんじ
              </span>
              <span className="text-sm font-bold">{phrase.reply.en}</span>
              <span className="text-muted-foreground text-xs">
                {phrase.reply.ja}
              </span>
            </span>
          )}
        </span>
      </button>
    </div>
  )
}
