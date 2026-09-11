"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FlashCard } from "@/components/flash-card"
import type { Kana } from "@/lib/kana"
import { ROW_THEME } from "@/lib/row-theme"
import type { Answer } from "@/lib/study"
import { cn } from "@/lib/utils"

type StudyScreenProps = {
  deck: Kana[]
  onFinish: (answers: Record<string, Answer>) => void
  onQuit: () => void
}

export function StudyScreen({ deck, onFinish, onQuit }: StudyScreenProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})

  const current = deck[index]
  const theme = ROW_THEME[current.row]

  function answer(value: Answer) {
    const next = { ...answers, [current.id]: value }
    setAnswers(next)

    if (index === deck.length - 1) {
      onFinish(next)
      return
    }
    setFlipped(false)
    setIndex(index + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm font-medium tabular-nums">
            {index + 1} / {deck.length} まい
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onQuit}
            className="text-muted-foreground h-7 text-xs"
          >
            やめる
          </Button>
        </div>
        <Progress
          value={(index / deck.length) * 100}
          className="bg-muted h-2.5"
          indicatorClassName={cn("transition-all duration-300", theme.fill)}
        />
      </header>

      <FlashCard
        kana={current}
        flipped={flipped}
        onFlip={() => setFlipped(!flipped)}
      />

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="xl"
            variant="outline"
            onClick={() => answer("unknown")}
            className="h-16 gap-2 rounded-2xl border-2 border-slate-300 text-base font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="size-5" />
            わすれてた
          </Button>
          <Button
            size="xl"
            onClick={() => answer("known")}
            className="h-16 gap-2 rounded-2xl bg-emerald-500 text-base font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500/90"
          >
            <Check className="size-5" />
            おぼえてた
          </Button>
        </div>
        <p className="text-muted-foreground text-center text-xs">
          カードをタップすると こたえが見えます
        </p>
      </div>
    </div>
  )
}
