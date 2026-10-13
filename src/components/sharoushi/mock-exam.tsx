"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MOCK_MINUTES_PER_QUESTION, type MockQuestion } from "@/lib/sharoushi/mock"
import { EXAM_GROUPS } from "@/lib/sharoushi/subjects"
import { cn } from "@/lib/utils"

const OPTION_LABELS = ["A", "B", "C", "D", "E"]

type MockExamProps = {
  questions: MockQuestion[]
  startedAt: number
  onSubmit: (picks: (number | null)[], seconds: number) => void
  onQuit: () => void
}

function formatClock(totalSeconds: number) {
  const s = Math.max(0, totalSeconds)
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, "0")}`
}

export function MockExam({ questions, startedAt, onSubmit, onQuit }: MockExamProps) {
  const [index, setIndex] = useState(0)
  const [picks, setPicks] = useState<(number | null)[]>(() =>
    questions.map(() => null)
  )
  const [now, setNow] = useState(startedAt)

  const limitSeconds = questions.length * MOCK_MINUTES_PER_QUESTION * 60
  const elapsed = Math.floor((now - startedAt) / 1000)
  const remaining = limitSeconds - elapsed
  const answered = picks.filter((p) => p !== null).length

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  // 時間切れで自動提出
  useEffect(() => {
    if (remaining <= 0) onSubmit(picks, limitSeconds)
  }, [remaining, picks, limitSeconds, onSubmit])

  const question = questions[index]
  const group = EXAM_GROUPS.find((g) => g.id === question.group)

  function submit() {
    const unanswered = questions.length - answered
    if (
      unanswered > 0 &&
      !window.confirm(`未回答が${unanswered}問あります。提出しますか？`)
    ) {
      return
    }
    onSubmit(picks, Math.min(elapsed, limitSeconds))
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "flex items-center gap-1 font-bold tabular-nums",
            remaining < 300 && "text-rose-600"
          )}
        >
          <Clock className="size-4" />
          残り {formatClock(remaining)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-7 text-xs"
          onClick={() => {
            if (window.confirm("模試を中止します。記録は残りません。よろしいですか？")) onQuit()
          }}
        >
          中止する
        </Button>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {questions.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`問${i + 1}${picks[i] === null ? "（未回答）" : "（回答済み）"}`}
            aria-current={i === index}
            className={cn(
              "size-8 rounded-lg border text-xs font-bold tabular-nums",
              picks[i] !== null && "bg-indigo-100 dark:bg-indigo-950",
              i === index && "ring-2 ring-indigo-500"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Card className="gap-4 rounded-3xl border-2 py-5 shadow-lg">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Badge variant="secondary">{group?.name}</Badge>
            <p className="font-bold">
              問{index + 1}　次の記述のうち、誤っているものはどれか。
            </p>
          </div>
          <div className="flex flex-col gap-2" role="radiogroup">
            {question.options.map((option, i) => {
              const isOn = picks[index] === i
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isOn}
                  onClick={() =>
                    setPicks(picks.map((p, j) => (j === index ? i : p)))
                  }
                  className={cn(
                    "flex gap-3 rounded-xl border-2 p-3 text-left text-sm leading-relaxed transition-colors",
                    isOn
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50"
                      : "hover:bg-muted/60"
                  )}
                >
                  <span className="font-bold">{OPTION_LABELS[i]}</span>
                  <span>{option.statement}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="xl"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
          className="gap-1 rounded-2xl"
        >
          <ChevronLeft className="size-5" />
          前へ
        </Button>
        {index < questions.length - 1 ? (
          <Button
            variant="outline"
            size="xl"
            onClick={() => setIndex(index + 1)}
            className="gap-1 rounded-2xl"
          >
            次へ
            <ChevronRight className="size-5" />
          </Button>
        ) : (
          <Button
            size="xl"
            onClick={submit}
            className="rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-600/90"
          >
            提出する
          </Button>
        )}
      </div>
      <p className="text-muted-foreground text-center text-xs tabular-nums">
        回答済み {answered} / {questions.length}問
      </p>
    </div>
  )
}
