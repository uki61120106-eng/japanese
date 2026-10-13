"use client"

import { Check, House, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuestionCheck } from "@/components/sharoushi/question-check"
import type { MockQuestion, MockScore } from "@/lib/sharoushi/mock"
import { EXAM_GROUPS } from "@/lib/sharoushi/subjects"
import { cn } from "@/lib/utils"

const OPTION_LABELS = ["A", "B", "C", "D", "E"]

type MockResultProps = {
  questions: MockQuestion[]
  picks: (number | null)[]
  score: MockScore
  onHome: () => void
}

export function MockResult({ questions, picks, score, onHome }: MockResultProps) {
  const rate = score.total ? Math.round((score.correct / score.total) * 100) : 0

  return (
    <div className="flex flex-col gap-5">
      <Card className="items-center gap-3 rounded-3xl border-2 py-6 shadow-lg">
        <CardContent className="flex flex-col items-center gap-2 text-center">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-bold",
              score.passed
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
            )}
          >
            {score.passed ? "合格ライン到達" : "合格ラインまであと一歩"}
          </span>
          <div className="text-5xl font-black tabular-nums">
            {score.correct}
            <span className="text-muted-foreground text-xl"> / {score.total}</span>
          </div>
          <p className="text-muted-foreground text-sm">正答率 {rate}%</p>
          {score.failedGroups.length > 0 && (
            <p className="text-sm text-rose-600">
              足切りの目安を下回った区分: {score.failedGroups.length}つ
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="gap-2 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-1">
          <h2 className="mb-1 text-sm font-bold">科目区分ごとの得点</h2>
          {EXAM_GROUPS.map((group) => {
            const g = score.byGroup[group.id]
            if (!g) return null
            const failed = score.failedGroups.includes(group.id)
            return (
              <div key={group.id} className="flex items-center justify-between text-sm">
                <span className={cn(failed && "text-rose-600")}>{group.name}</span>
                <span className="font-bold tabular-nums">
                  {g.correct} / {g.total}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-muted-foreground text-xs font-bold tracking-widest">解答と解説</h2>
        {questions.map((q, i) => {
          const pick = picks[i]
          const ok = pick === q.answerIndex
          return (
            <Card key={i} className="gap-3 rounded-2xl py-4">
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold">
                  {ok ? (
                    <Check className="size-4 text-emerald-600" />
                  ) : (
                    <X className="size-4 text-rose-600" />
                  )}
                  問{i + 1}
                  <Badge variant="secondary">
                    {EXAM_GROUPS.find((g) => g.id === q.group)?.name}
                  </Badge>
                </div>
                <p className="text-xs">
                  正解 {OPTION_LABELS[q.answerIndex]}／あなたの解答{" "}
                  {pick === null ? "未回答" : OPTION_LABELS[pick]}
                </p>
                <ul className="flex flex-col gap-2">
                  {q.options.map((option, j) => (
                    <li
                      key={option.id}
                      className={cn(
                        "rounded-lg p-2 text-xs leading-relaxed",
                        j === q.answerIndex ? "bg-rose-50 dark:bg-rose-950/40" : "bg-muted/50"
                      )}
                    >
                      <span className="font-bold">
                        {OPTION_LABELS[j]}（{option.answer ? "正" : "誤"}）
                      </span>{" "}
                      {option.statement}
                      {(j === q.answerIndex || j === pick) && (
                        <span className="mt-1 flex flex-col gap-2">
                          <span className="text-muted-foreground">→ {option.explanation}</span>
                          <QuestionCheck question={option} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <Button size="xl" variant="outline" onClick={onHome} className="gap-2 rounded-2xl font-bold">
        <House className="size-5" />
        ホームへ戻る
      </Button>
    </div>
  )
}
