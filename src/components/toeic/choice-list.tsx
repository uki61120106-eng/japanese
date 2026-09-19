"use client"

import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

const LABELS = ["A", "B", "C", "D"]

type ChoiceListProps = {
  choices: readonly string[]
  /** 正解の添字 */
  answer: number
  /** 選んだ添字。未回答なら null */
  selected: number | null
  onSelect: (index: number) => void
}

export function ChoiceList({
  choices,
  answer,
  selected,
  onSelect,
}: ChoiceListProps) {
  const answered = selected !== null

  return (
    <div className="flex flex-col gap-2">
      {choices.map((choice, index) => {
        const isAnswer = index === answer
        const isPicked = index === selected

        return (
          <button
            key={choice}
            type="button"
            disabled={answered}
            onClick={() => onSelect(index)}
            className={cn(
              "focus-visible:ring-ring/60 flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all outline-none focus-visible:ring-4 disabled:cursor-default",
              !answered &&
                "border-border bg-card hover:border-indigo-400 hover:bg-indigo-50 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40",
              answered &&
                isAnswer &&
                "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
              answered &&
                isPicked &&
                !isAnswer &&
                "border-rose-500 bg-rose-50 dark:bg-rose-950/40",
              answered && !isAnswer && !isPicked && "border-border opacity-50"
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                !answered && "border-border text-muted-foreground",
                answered &&
                  isAnswer &&
                  "border-emerald-500 bg-emerald-500 text-white",
                answered &&
                  isPicked &&
                  !isAnswer &&
                  "border-rose-500 bg-rose-500 text-white",
                answered &&
                  !isAnswer &&
                  !isPicked &&
                  "border-border text-muted-foreground"
              )}
            >
              {answered && isAnswer ? (
                <Check className="size-4" />
              ) : answered && isPicked ? (
                <X className="size-4" />
              ) : (
                LABELS[index]
              )}
            </span>
            <span className="font-english text-[0.95rem] leading-snug">
              {choice}
            </span>
          </button>
        )
      })}
    </div>
  )
}
