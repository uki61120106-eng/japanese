"use client"

import { useState } from "react"
import { ArrowRight, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { categoryLabel, type Word } from "@/lib/korean"
import { CATEGORY_THEME } from "@/lib/korean-theme"
import {
  answerText,
  questionText,
  type Direction,
  type QuizQuestion,
} from "@/lib/korean-study"
import type { Answer } from "@/lib/study"
import { cn } from "@/lib/utils"

type QuizScreenProps = {
  questions: QuizQuestion[]
  direction: Direction
  onFinish: (answers: Record<string, Answer>) => void
  onQuit: () => void
}

export function QuizScreen({
  questions,
  direction,
  onFinish,
  onQuit,
}: QuizScreenProps) {
  const [index, setIndex] = useState(0)
  /** 選んだ選択肢。null のあいだは回答前 */
  const [picked, setPicked] = useState<Word | null>(null)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})

  const current = questions[index]
  const word = current.word
  const theme = CATEGORY_THEME[word.category]
  const correct = picked?.id === word.id

  function pick(choice: Word) {
    if (picked) return
    setPicked(choice)
    setAnswers({
      ...answers,
      [word.id]: choice.id === word.id ? "known" : "unknown",
    })
  }

  function next() {
    if (index === questions.length - 1) {
      onFinish(answers)
      return
    }
    setPicked(null)
    setIndex(index + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm font-medium tabular-nums">
            {index + 1} / {questions.length} 問
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
          value={(index / questions.length) * 100}
          className="bg-muted h-2.5"
          indicatorClassName={cn("transition-all duration-300", theme.fill)}
        />
      </header>

      <Card
        className={cn(
          "items-center gap-3 rounded-3xl border-0 bg-linear-to-br py-10 text-white shadow-xl",
          theme.cardFace
        )}
      >
        <CardContent className="flex flex-col items-center gap-3 px-6">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium tracking-widest">
            {categoryLabel(word.category)}
          </span>
          <span
            className={cn(
              "text-center text-3xl leading-tight font-bold drop-shadow-sm sm:text-4xl",
              direction === "ko-ja" && "font-hangul"
            )}
          >
            {questionText(word, direction)}
          </span>
          <span className="text-sm text-white/85">
            {direction === "ko-ja"
              ? "意味はどれ？"
              : "韓国語ではどれ？"}
          </span>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {current.choices.map((choice) => {
          const isAnswer = choice.id === word.id
          const isPicked = picked?.id === choice.id
          return (
            <Button
              key={choice.id}
              variant="outline"
              onClick={() => pick(choice)}
              disabled={picked !== null && !isAnswer && !isPicked}
              className={cn(
                "h-auto min-h-14 justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base font-bold whitespace-normal",
                // 回答後は正解を緑、選んだ誤答を赤で示す
                picked && isAnswer && "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
                picked && isPicked && !isAnswer && "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
                picked && !isAnswer && !isPicked && "opacity-50"
              )}
            >
              <span className={cn(direction === "ja-ko" && "font-hangul")}>
                {answerText(choice, direction)}
              </span>
              {picked && isAnswer && <Check className="size-5 shrink-0" />}
              {picked && isPicked && !isAnswer && (
                <X className="size-5 shrink-0" />
              )}
            </Button>
          )
        })}
      </div>

      {picked && (
        <div className="flex flex-col gap-3">
          <Card className="gap-2 rounded-2xl border-2 py-4 shadow-sm">
            <CardContent className="flex flex-col items-center gap-1.5 px-4 text-center">
              <span
                className={cn(
                  "text-sm font-bold",
                  correct
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-rose-600 dark:text-rose-300"
                )}
              >
                {correct ? "せいかい！" : "おしい！ もう一度おぼえよう"}
              </span>
              <span className="font-hangul text-2xl font-bold">
                {word.hangul}
              </span>
              <span className="text-base font-medium">{word.kana}</span>
              <span className="text-muted-foreground text-sm">
                {word.romaji} ／ {word.meaning}
              </span>
              {word.note && (
                <span className="bg-muted/60 text-foreground/80 mt-1 rounded-xl px-3 py-2 text-xs leading-relaxed">
                  {word.note}
                </span>
              )}
            </CardContent>
          </Card>

          <Button
            size="xl"
            onClick={next}
            className="gap-2 rounded-2xl bg-linear-to-r from-sky-500 to-violet-500 text-base font-bold shadow-lg hover:from-sky-500/90 hover:to-violet-500/90"
          >
            {index === questions.length - 1 ? "けっかを見る" : "つぎの問題"}
            <ArrowRight className="size-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
