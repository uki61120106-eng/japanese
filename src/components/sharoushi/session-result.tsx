"use client"

import { House, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { SessionResult } from "@/components/sharoushi/quiz-session"
import { getSubject } from "@/lib/sharoushi/subjects"

type SessionResultScreenProps = {
  results: SessionResult[]
  onRetryWrong: () => void
  onHome: () => void
}

export function SessionResultScreen({
  results,
  onRetryWrong,
  onHome,
}: SessionResultScreenProps) {
  const correct = results.filter((r) => r.correct).length
  const wrong = results.filter((r) => !r.correct)
  const rate = results.length ? Math.round((correct / results.length) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-black">おつかれさまでした</h1>
        <p className="text-muted-foreground text-sm">
          間違えた問題は明日の復習に自動で入ります
        </p>
      </header>

      <Card className="items-center rounded-3xl border-2 py-6 shadow-lg">
        <CardContent className="flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-black text-teal-600 tabular-nums dark:text-teal-400">
              {rate}
            </span>
            <span className="text-muted-foreground text-xl font-bold">%</span>
          </div>
          <p className="text-muted-foreground text-sm tabular-nums">
            {results.length}問中 {correct}問 正解
          </p>
        </CardContent>
      </Card>

      {wrong.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-muted-foreground text-xs font-bold tracking-widest">
            間違えた問題
          </h2>
          {wrong.map(({ question }) => (
            <Card key={question.id} className="gap-2 rounded-2xl py-4">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{getSubject(question.subject).short}</Badge>
                  <span className="text-xs font-bold">
                    正解: {question.answer ? "○ 正しい" : "× 誤り"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{question.statement}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {question.explanation}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <div className="flex flex-col gap-2">
        {wrong.length > 0 && (
          <Button
            size="xl"
            onClick={onRetryWrong}
            className="w-full gap-2 rounded-2xl bg-teal-600 font-bold text-white hover:bg-teal-600/90"
          >
            <RotateCcw className="size-5" />
            間違えた{wrong.length}問をもう一度
          </Button>
        )}
        <Button
          size="xl"
          variant="outline"
          onClick={onHome}
          className="w-full gap-2 rounded-2xl font-bold"
        >
          <House className="size-5" />
          ホームへ戻る
        </Button>
      </div>
    </div>
  )
}
