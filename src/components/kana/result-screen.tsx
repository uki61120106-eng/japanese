"use client"

import { House, PartyPopper, Repeat, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Kana } from "@/lib/kana"
import { ROW_THEME } from "@/lib/row-theme"
import { countKnown, wrongCards, type Answer } from "@/lib/study"
import { cn } from "@/lib/utils"

type ResultScreenProps = {
  deck: Kana[]
  answers: Record<string, Answer>
  onRetryAll: () => void
  onRetryWrong: () => void
  onHome: () => void
}

function praise(rate: number): string {
  if (rate === 100) return "パーフェクト！"
  if (rate >= 80) return "いいちょうし！"
  if (rate >= 50) return "あと少し！"
  return "くりかえして おぼえよう"
}

export function ResultScreen({
  deck,
  answers,
  onRetryAll,
  onRetryWrong,
  onHome,
}: ResultScreenProps) {
  const known = countKnown(answers)
  const wrong = wrongCards(deck, answers)
  const rate = Math.round((known / deck.length) * 100)

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
            <span className="bg-linear-to-r from-rose-500 to-fuchsia-500 bg-clip-text text-7xl font-black text-transparent tabular-nums">
              {rate}
            </span>
            <span className="text-muted-foreground text-2xl font-bold">%</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-center dark:bg-emerald-950/40">
              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                おぼえてた
              </div>
              <div className="text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-200">
                {known}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center dark:bg-slate-800">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                わすれてた
              </div>
              <div className="text-2xl font-bold text-slate-700 tabular-nums dark:text-slate-100">
                {wrong.length}
              </div>
            </div>
          </div>

          {wrong.length > 0 && (
            <div className="flex w-full flex-col gap-2">
              <div className="text-muted-foreground text-xs tracking-widest">
                わすれてた もじ
              </div>
              <div className="flex flex-wrap gap-2">
                {wrong.map((kana) => (
                  <span
                    key={kana.id}
                    className={cn(
                      "flex size-12 flex-col items-center justify-center rounded-xl border-2 text-xl font-bold",
                      ROW_THEME[kana.row].chip
                    )}
                  >
                    {kana.char}
                    <span className="text-[0.6rem] font-medium opacity-70">
                      {kana.romaji}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {wrong.length > 0 && (
          <Button
            size="xl"
            onClick={onRetryWrong}
            className="gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-fuchsia-500 text-base font-bold shadow-lg hover:from-rose-500/90 hover:to-fuchsia-500/90"
          >
            <Repeat className="size-5" />
            まちがえた {wrong.length} まいを もう一回
          </Button>
        )}
        <Button
          size="xl"
          variant="outline"
          onClick={onRetryAll}
          className="gap-2 rounded-2xl border-2 text-base font-bold"
        >
          <RotateCcw className="size-5" />
          おなじ {deck.length} まいを もう一回
        </Button>
        <Button
          size="xl"
          variant="ghost"
          onClick={onHome}
          className="text-muted-foreground gap-2 rounded-2xl text-base"
        >
          <House className="size-5" />
          ホームへ もどる
        </Button>
      </div>
    </div>
  )
}
