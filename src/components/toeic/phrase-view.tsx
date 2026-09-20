"use client"

import { Eye, Lightbulb } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { phraseCategoryMeta } from "@/lib/toeic/category"
import type { PhraseCard } from "@/lib/toeic/types"
import { cn } from "@/lib/utils"

type PhraseViewProps = {
  card: PhraseCard
  revealed: boolean
  onReveal: () => void
}

/**
 * フレーズカード。
 * 表はフレーズだけを大きく出し、意味・例文は「意味を見る」まで伏せる。
 */
export function PhraseView({ card, revealed, onReveal }: PhraseViewProps) {
  const meta = phraseCategoryMeta(card.category)

  return (
    <Card className="gap-4 rounded-3xl border-2 shadow-sm">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[0.65rem]">
            フレーズ
          </Badge>
          <span className={cn("text-[0.7rem] font-bold", meta.text)}>
            {meta.label}
          </span>
        </div>

        <p className="font-english py-2 text-center text-2xl leading-snug font-bold sm:text-3xl">
          {card.phrase}
        </p>

        {!revealed ? (
          <Button
            variant="outline"
            size="xl"
            onClick={onReveal}
            className="w-full gap-2 rounded-2xl border-2 text-base font-bold"
          >
            <Eye className="size-5" />
            意味を見る
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-center text-lg font-bold">{card.meaning}</p>

            <div className="bg-muted/60 flex flex-col gap-1.5 rounded-2xl px-4 py-3">
              <p className="font-english text-[0.9rem] leading-relaxed">
                {card.example}
              </p>
              <p className="text-muted-foreground text-[0.8rem] leading-relaxed">
                {card.exampleTranslation}
              </p>
            </div>

            {card.note && (
              <p className="text-muted-foreground flex gap-2 text-[0.8rem] leading-relaxed">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
                <span>{card.note}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
