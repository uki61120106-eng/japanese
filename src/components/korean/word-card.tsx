"use client"

import { RotateCcw } from "lucide-react"

import { categoryLabel, type Word } from "@/lib/korean"
import { CATEGORY_THEME } from "@/lib/korean-theme"
import { answerText, questionText, type Direction } from "@/lib/korean-study"
import { cn } from "@/lib/utils"

type WordCardProps = {
  word: Word
  direction: Direction
  flipped: boolean
  onFlip: () => void
}

/**
 * 文の長さで文字の大きさを変える。あいさつ文は「안녕히 계세요」のように長く、
 * 単語は「물」のように短いため、同じ指定では収まらない。
 */
function faceTextSize(text: string): string {
  if (text.length <= 4) return "text-[clamp(3.5rem,17vw,6rem)]"
  if (text.length <= 8) return "text-[clamp(2.25rem,11vw,4rem)]"
  if (text.length <= 12) return "text-[clamp(1.5rem,6.5vw,2.25rem)]"
  return "text-[clamp(1.25rem,5.5vw,1.75rem)]"
}

export function WordCard({ word, direction, flipped, onFlip }: WordCardProps) {
  const theme = CATEGORY_THEME[word.category]
  const question = questionText(word, direction)
  const answer = answerText(word, direction)
  // ハングルは M PLUS Rounded 1c に字形が無いので、ハングル用のフォントを当てる
  const questionIsHangul = direction === "ko-ja"

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
        {/* 表：問題（ハングル、または日本語の意味） */}
        <span
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl px-6",
            "bg-linear-to-br text-white shadow-xl backface-hidden",
            theme.cardFace
          )}
        >
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium tracking-widest">
            {categoryLabel(word.category)}
          </span>
          <span
            className={cn(
              "text-center leading-tight font-bold drop-shadow-sm",
              faceTextSize(question),
              questionIsHangul && "font-hangul"
            )}
          >
            {question}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-white/85">
            <RotateCcw className="size-4" />
            タップして答えを見る
          </span>
        </span>

        {/* 裏：答えと、読み・ローマ字・使う場面のメモ */}
        <span
          className={cn(
            "bg-card absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-5 rounded-3xl",
            "px-6 shadow-xl ring-4 backface-hidden",
            theme.ring
          )}
        >
          <span className="flex flex-col items-center gap-1">
            <span className="text-muted-foreground text-xs font-medium tracking-widest">
              {direction === "ko-ja" ? "いみ" : "かんこくご"}
            </span>
            <span
              className={cn(
                "text-center leading-tight font-bold",
                faceTextSize(answer),
                !questionIsHangul && "font-hangul",
                theme.text
              )}
            >
              {answer}
            </span>
          </span>

          <span className="bg-border h-px w-24" />

          <span className="flex flex-col items-center gap-1.5 text-center">
            <span className="text-muted-foreground text-xs font-medium tracking-widest">
              よみかた
            </span>
            <span className="text-2xl font-bold">{word.kana}</span>
            <span className="text-muted-foreground text-sm">{word.romaji}</span>
            {direction === "ko-ja" && (
              <span className="font-hangul text-foreground/80 text-base">
                {word.hangul}
              </span>
            )}
          </span>

          {word.note && (
            <span className="bg-muted/60 text-foreground/80 rounded-2xl px-4 py-2 text-center text-xs leading-relaxed">
              {word.note}
            </span>
          )}
        </span>
      </button>
    </div>
  )
}
