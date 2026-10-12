"use client"

import { Circle, House, PartyPopper, Repeat, RotateCcw, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { QuizResult } from "@/components/soroban/soroban-app"
import { ProblemView } from "@/components/soroban/problem-view"
import { formatTime } from "@/components/soroban/soroban-quiz"
import { answerOf, formatNumber, type Problem } from "@/lib/soroban"
import { cn } from "@/lib/utils"

type SorobanResultProps = {
  problems: Problem[]
  result: QuizResult
  onRetryWrong: (wrong: Problem[]) => void
  onNewSet: () => void
  onHome: () => void
}

function praise(rate: number): string {
  if (rate === 100) return "ぜんもん せいかい！ すごい！"
  if (rate >= 80) return "よく できました！"
  if (rate >= 50) return "あと すこし！"
  return "なんども れんしゅう しよう"
}

export function SorobanResult({
  problems,
  result,
  onRetryWrong,
  onNewSet,
  onHome,
}: SorobanResultProps) {
  const wrong = problems.filter(
    (problem) => result.answers[problem.id] !== answerOf(problem)
  )
  const correctCount = problems.length - wrong.length
  const rate = Math.round((correctCount / problems.length) * 100)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <PartyPopper className="size-8 text-amber-500" />
        <h1 className="text-3xl font-black tracking-tight">おつかれさま！</h1>
        <p className="text-muted-foreground text-sm">{praise(rate)}</p>
      </header>

      <Card className="items-center gap-4 rounded-3xl border-2 py-8 shadow-lg">
        <CardContent className="flex w-full flex-col items-center gap-6">
          <div className="flex items-baseline gap-1">
            <span className="bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-7xl font-black text-transparent tabular-nums">
              {correctCount}
            </span>
            <span className="text-muted-foreground text-2xl font-bold">
              / {problems.length} もん
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-center dark:bg-emerald-950/40">
              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                せいかいりつ
              </div>
              <div className="text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-200">
                {rate}%
              </div>
            </div>
            <div className="rounded-2xl bg-sky-50 px-4 py-3 text-center dark:bg-sky-950/40">
              <div className="text-xs font-medium text-sky-700 dark:text-sky-300">
                かかった じかん
              </div>
              <div className="text-xl font-bold whitespace-nowrap text-sky-600 tabular-nums dark:text-sky-200">
                {formatTime(result.elapsedMs)}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="text-muted-foreground text-xs tracking-widest">
              ふりかえり
            </div>
            <ol className="flex flex-col gap-2">
              {problems.map((problem, i) => {
                const correct = answerOf(problem)
                const given = result.answers[problem.id]
                const ok = given === correct
                return (
                  <li
                    key={problem.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-3 py-2",
                      ok
                        ? "border-emerald-200 dark:border-emerald-900/60"
                        : "border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/30"
                    )}
                  >
                    <span className="text-muted-foreground w-5 text-xs tabular-nums">
                      {i + 1}
                    </span>
                    {ok ? (
                      <Circle className="size-5 shrink-0 stroke-[3] text-emerald-500" />
                    ) : (
                      <X className="size-5 shrink-0 stroke-[3] text-rose-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <ProblemView problem={problem} size="sm" />
                    </div>
                    <div className="text-right text-sm tabular-nums">
                      <div className="font-black">{formatNumber(correct)}</div>
                      {!ok && (
                        <div className="text-xs text-rose-600 dark:text-rose-300">
                          きみ：
                          {given === undefined ? "ー" : formatNumber(given)}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {wrong.length > 0 && (
          <Button
            size="xl"
            onClick={() => onRetryWrong(wrong)}
            className="gap-2 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 text-base font-bold text-white shadow-lg hover:from-amber-500/90 hover:to-orange-500/90"
          >
            <Repeat className="size-5" />
            まちがえた {wrong.length}もんを もういちど
          </Button>
        )}
        <Button
          size="xl"
          variant="outline"
          onClick={onNewSet}
          className="gap-2 rounded-2xl border-2 text-base font-bold"
        >
          <RotateCcw className="size-5" />
          あたらしい もんだいで もういちど
        </Button>
        <Button
          size="xl"
          variant="ghost"
          onClick={onHome}
          className="text-muted-foreground gap-2 rounded-2xl text-base"
        >
          <House className="size-5" />
          さいしょに もどる
        </Button>
      </div>
    </div>
  )
}
