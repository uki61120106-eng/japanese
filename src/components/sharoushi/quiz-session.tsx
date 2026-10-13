"use client"

import { useRef, useState } from "react"
import { ArrowRight, Check, Circle, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Question } from "@/lib/sharoushi/questions"
import { addStudySeconds, recordAnswer } from "@/lib/sharoushi/store"
import { getSubject } from "@/lib/sharoushi/subjects"
import { cn } from "@/lib/utils"

export type SessionItem = {
  question: Question
  kind: "review" | "new"
}

export type SessionResult = {
  question: Question
  correct: boolean
}

/** 放置していた時間を学習時間に数えないよう、1問あたりの上限を設ける */
const MAX_SECONDS_PER_QUESTION = 5 * 60

type QuizSessionProps = {
  title: string
  items: SessionItem[]
  /** セッションを開始した時刻（Date.now()）。学習時間の計測に使う */
  startedAt: number
  onFinish: (results: SessionResult[]) => void
  onQuit: (results: SessionResult[]) => void
}

export function QuizSession({
  title,
  items,
  startedAt,
  onFinish,
  onQuit,
}: QuizSessionProps) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<boolean | null>(null)
  const [results, setResults] = useState<SessionResult[]>([])
  const shownAt = useRef(startedAt)

  const item = items[index]
  const question = item.question
  const isLast = index === items.length - 1
  const isCorrect = picked !== null && picked === question.answer

  function flushTime() {
    const now = Date.now()
    const seconds = Math.round((now - shownAt.current) / 1000)
    addStudySeconds(Math.min(seconds, MAX_SECONDS_PER_QUESTION))
    shownAt.current = now
  }

  function answer(value: boolean) {
    if (picked !== null) return
    const correct = value === question.answer
    setPicked(value)
    setResults([...results, { question, correct }])
    recordAnswer(question.id, correct)
  }

  function next() {
    flushTime()
    if (isLast) {
      onFinish(results)
      return
    }
    setPicked(null)
    setIndex(index + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm tabular-nums">
              {index + 1} / {items.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                flushTime()
                onQuit(results)
              }}
              className="text-muted-foreground h-7 text-xs"
            >
              中断する
            </Button>
          </div>
        </div>
        <Progress
          value={((index + (picked === null ? 0 : 1)) / items.length) * 100}
          className="bg-muted h-2"
          indicatorClassName="bg-teal-500 transition-all duration-300"
        />
      </header>

      <Card className="gap-4 rounded-3xl border-2 shadow-lg">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{getSubject(question.subject).name}</Badge>
            <Badge
              variant="outline"
              className={cn(
                item.kind === "review"
                  ? "border-amber-400 text-amber-700 dark:text-amber-300"
                  : "border-teal-400 text-teal-700 dark:text-teal-300"
              )}
            >
              {item.kind === "review" ? "復習" : "新規"}
            </Badge>
          </div>
          <p className="text-base leading-relaxed">{question.statement}</p>
        </CardContent>
      </Card>

      {picked === null ? (
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="xl"
            onClick={() => answer(true)}
            className="h-16 gap-2 rounded-2xl bg-teal-600 text-lg font-bold text-white shadow-md hover:bg-teal-600/90"
          >
            <Circle className="size-5" />
            正しい
          </Button>
          <Button
            size="xl"
            onClick={() => answer(false)}
            className="h-16 gap-2 rounded-2xl bg-rose-600 text-lg font-bold text-white shadow-md hover:bg-rose-600/90"
          >
            <X className="size-5" />
            誤り
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "flex flex-col gap-2 rounded-2xl border-2 p-4",
              isCorrect
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
                : "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/40"
            )}
            role="status"
          >
            <div className="flex items-center gap-2 font-bold">
              {isCorrect ? (
                <Check className="size-5 text-emerald-600" />
              ) : (
                <X className="size-5 text-rose-600" />
              )}
              {isCorrect ? "正解" : "不正解"}
              <span className="text-muted-foreground text-sm font-medium">
                （この記述は{question.answer ? "正しい" : "誤り"}）
              </span>
            </div>
            <p className="text-sm leading-relaxed">{question.explanation}</p>
            <p className="text-muted-foreground text-xs">根拠: {question.basis}</p>
          </div>
          <Button
            size="xl"
            onClick={next}
            className="w-full gap-2 rounded-2xl bg-teal-600 text-base font-bold text-white hover:bg-teal-600/90"
          >
            {isLast ? "結果を見る" : "次の問題へ"}
            <ArrowRight className="size-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
