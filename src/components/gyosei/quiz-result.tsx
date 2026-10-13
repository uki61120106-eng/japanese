"use client"

import { Check, House, RotateCcw, X } from "lucide-react"

import { pct, SubjectBadge } from "@/components/gyosei/common"
import type { QuizOutcome } from "@/components/gyosei/quiz-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Session } from "@/lib/gyosei/session"
import { cn } from "@/lib/utils"

const CHECK_TARGET = 80

export function QuizResult({
  session,
  outcomes,
  kijutsuScore,
  onRetryWrong,
  onHome,
}: {
  session: Session
  outcomes: QuizOutcome[]
  kijutsuScore: number | null
  onRetryWrong: () => void
  onHome: () => void
}) {
  const correct = outcomes.filter((o) => o.correct).length
  const rate = pct(correct, outcomes.length)
  const wrong = outcomes.filter((o) => !o.correct)
  const isCheck = session.kind === "check"

  return (
    <div className="flex flex-col gap-5">
      <Card className="items-center gap-2 rounded-3xl py-6 text-center">
        <CardContent className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground text-sm font-bold">{session.title}</p>
          <p className="text-5xl font-black tabular-nums">
            {rate}
            <span className="text-2xl">%</span>
          </p>
          <p className="text-muted-foreground text-sm tabular-nums">
            {outcomes.length}問中 {correct}問 正解
            {kijutsuScore !== null && ` ／ 記述 ${kijutsuScore}点`}
          </p>
          {isCheck && (
            <p
              className={cn(
                "mt-1 rounded-full px-3 py-1 text-sm font-bold",
                rate >= CHECK_TARGET
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
              )}
            >
              {rate >= CHECK_TARGET
                ? "目標（80%）クリア。次の週へ進もう"
                : "目標の80%に届かず。苦手克服で復習しよう"}
            </p>
          )}
        </CardContent>
      </Card>

      {wrong.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold">まちがえた問題（翌日の復習に入ります）</h2>
          {wrong.map(({ statement }) => (
            <Card key={statement.id} className="gap-2 rounded-2xl py-4">
              <CardContent className="flex flex-col gap-2 px-4">
                <div className="flex items-center gap-2">
                  <SubjectBadge subject={statement.subject} />
                  <span className="text-xs font-bold">
                    正解：{statement.answer ? "○" : "×"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{statement.text}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {statement.explanation}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {wrong.length === 0 && outcomes.length > 0 && (
        <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-emerald-600">
          <Check className="size-4" />
          全問正解
        </p>
      )}

      <div className="flex flex-col gap-2">
        {wrong.length > 0 && (
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl"
            onClick={onRetryWrong}
          >
            <RotateCcw />
            まちがえた {wrong.length} 問をもう一度
          </Button>
        )}
        <Button size="lg" className="rounded-xl" onClick={onHome}>
          <House />
          ホームへ
        </Button>
      </div>
      {wrong.length > 0 && (
        <p className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
          <X className="size-3" />
          もう一度解いた結果も復習の記録に反映されます
        </p>
      )}
    </div>
  )
}
