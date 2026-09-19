"use client"

import { useEffect, useState } from "react"
import { Check, Turtle, Volume2, X } from "lucide-react"

import { PhraseCard } from "@/components/english/phrase-card"
import { SpeakCheck } from "@/components/english/speak-check"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Answer, Mode } from "@/lib/english-study"
import type { Phrase } from "@/lib/phrases"
import { SCENE_THEME } from "@/lib/scene-theme"
import { speak, stopSpeaking, type SpeechSupport } from "@/lib/speech"
import { cn } from "@/lib/utils"

type PracticeScreenProps = {
  deck: Phrase[]
  mode: Mode
  support: SpeechSupport
  onFinish: (answers: Record<string, Answer>) => void
  onQuit: () => void
}

/** ゆっくり再生の速さ。標準（1）より遅く、聞き取れる程度に留める。 */
const SLOW_RATE = 0.6

export function PracticeScreen({
  deck,
  mode,
  support,
  onFinish,
  onQuit,
}: PracticeScreenProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})

  const current = deck[index]
  const theme = SCENE_THEME[current.scene]

  // 画面を離れるときに読み上げを止める
  useEffect(() => stopSpeaking, [])

  function answer(value: Answer) {
    stopSpeaking()
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
            {index + 1} / {deck.length} フレーズ
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              stopSpeaking()
              onQuit()
            }}
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

      <PhraseCard
        phrase={current}
        flipped={flipped}
        onFlip={() => setFlipped(!flipped)}
      />

      {support.speak ? (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => speak(current.en)}
            className="h-12 gap-2 rounded-2xl border-2 text-sm font-bold"
          >
            <Volume2 className="size-5" />
            聞く
          </Button>
          <Button
            variant="outline"
            onClick={() => speak(current.en, { rate: SLOW_RATE })}
            className="h-12 gap-2 rounded-2xl border-2 text-sm font-bold"
          >
            <Turtle className="size-5" />
            ゆっくり
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground text-center text-xs">
          このブラウザは読み上げに対応していません。カタカナの読みを参考にしてください
        </p>
      )}

      {mode === "speak" && (
        // カードが変わったら前の判定を持ち越さないよう、key で作り直す
        <SpeakCheck
          key={current.id}
          expected={current.en}
          supported={support.listen}
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="xl"
            variant="outline"
            onClick={() => answer("unknown")}
            className="h-16 gap-2 rounded-2xl border-2 border-slate-300 text-base font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="size-5" />
            まだ むずかしい
          </Button>
          <Button
            size="xl"
            onClick={() => answer("known")}
            className="h-16 gap-2 rounded-2xl bg-emerald-500 text-base font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500/90"
          >
            <Check className="size-5" />
            言えた
          </Button>
        </div>
        <p className="text-muted-foreground text-center text-xs">
          カードをタップすると 英語が見えます
        </p>
      </div>
    </div>
  )
}
