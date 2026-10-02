"use client"

import type { ReactNode } from "react"

import { SpeakButton } from "@/components/indonesian/speak-button"
import type { Line } from "@/lib/indonesian/scenes"
import type { IndonesianSpeech } from "@/lib/indonesian/use-speech"
import { cn } from "@/lib/utils"

type ChatBubbleProps = {
  line: Line
  /** 吹き出しの上に出す役名 */
  name: string
  side: "left" | "right"
  /** 左側（相手）の吹き出しの配色 */
  partnerClassName: string
  showKana: boolean
  showJa: boolean
  speech: IndonesianSpeech
  speakKey: string
  /** まとめて再生中など、強調したいとき */
  active?: boolean
  footer?: ReactNode
}

export function ChatBubble({
  line,
  name,
  side,
  partnerClassName,
  showKana,
  showJa,
  speech,
  speakKey,
  active = false,
  footer,
}: ChatBubbleProps) {
  const isRight = side === "right"

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-1 duration-300",
        isRight ? "items-end" : "items-start"
      )}
    >
      <span className="text-muted-foreground px-2 text-[0.7rem] font-medium">
        {name}
      </span>
      <div
        className={cn(
          "flex max-w-[90%] items-start gap-1 rounded-3xl border-2 px-4 py-3 shadow-sm transition-shadow",
          isRight
            ? "bg-card flex-row-reverse rounded-tr-md"
            : cn("rounded-tl-md", partnerClassName),
          active && "ring-primary/50 ring-4"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-1",
            isRight && "items-end text-right"
          )}
        >
          <p lang="id" className="text-lg leading-snug font-bold">
            {line.id}
          </p>
          {showKana && (
            <p className="text-muted-foreground text-xs leading-relaxed">
              {line.kana}
            </p>
          )}
          {showJa && <p className="text-sm leading-relaxed">{line.ja}</p>}
          {footer}
        </div>
        <SpeakButton
          text={line.id}
          speech={speech}
          speakKey={speakKey}
          className="-my-1"
        />
      </div>
    </div>
  )
}
