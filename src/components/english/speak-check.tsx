"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Mic, MicOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { evaluate, type PronunciationResult } from "@/lib/pronunciation"
import { listen, type ListenError, type ListenHandle } from "@/lib/speech"
import { cn } from "@/lib/utils"

type SpeakCheckProps = {
  /** お手本の英文 */
  expected: string
  supported: boolean
}

const ERROR_MESSAGE: Record<ListenError, string> = {
  unsupported: "このブラウザは音声の聞き取りに対応していません",
  denied: "マイクの使用が許可されませんでした",
  "no-speech": "声が聞き取れませんでした。もう一度どうぞ",
  other: "聞き取りに失敗しました。もう一度どうぞ",
}

const JUDGEMENT_LABEL = {
  perfect: "そのとおり！",
  close: "おしい！",
  retry: "もう一度",
} as const

const JUDGEMENT_STYLE = {
  perfect:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
  close:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
  retry:
    "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
} as const

export function SpeakCheck({ expected, supported }: SpeakCheckProps) {
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState<PronunciationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const handleRef = useRef<ListenHandle | null>(null)

  // 画面を離れるときに聞き取りを止める
  // （カードが切り替わったときの判定リセットは、呼び出し側の key に任せている）
  useEffect(() => () => handleRef.current?.stop(), [])

  function start() {
    if (listening) {
      handleRef.current?.stop()
      return
    }

    setResult(null)
    setError(null)
    setListening(true)

    handleRef.current = listen({
      onResult: (transcript) => setResult(evaluate(expected, transcript)),
      onError: (reason) => setError(ERROR_MESSAGE[reason]),
      onEnd: () => {
        setListening(false)
        handleRef.current = null
      },
    })
  }

  if (!supported) {
    return (
      <p className="text-muted-foreground flex items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-3 text-xs">
        <MicOff className="size-4 shrink-0" />
        このブラウザは音声の聞き取りに対応していません（Chrome や Edge でお試しください）
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        size="xl"
        onClick={start}
        aria-pressed={listening}
        className={cn(
          "h-14 w-full gap-2 rounded-2xl text-base font-bold shadow-lg transition-colors",
          listening
            ? "bg-rose-500 text-white shadow-rose-500/30 hover:bg-rose-500/90"
            : "bg-slate-800 text-white shadow-slate-800/25 hover:bg-slate-800/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
        )}
      >
        {listening ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            聞いています…（押すと中止）
          </>
        ) : (
          <>
            <Mic className="size-5" />
            声に出して言ってみる
          </>
        )}
      </Button>

      {error && (
        <p className="text-muted-foreground text-center text-xs">{error}</p>
      )}

      {result && (
        <div
          className={cn(
            "flex flex-col gap-2 rounded-2xl border-2 px-4 py-3",
            JUDGEMENT_STYLE[result.judgement]
          )}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-bold">
              {JUDGEMENT_LABEL[result.judgement]}
            </span>
            <span className="text-xs font-medium tabular-nums opacity-80">
              {result.score} / 100
            </span>
          </div>

          <p className="flex flex-wrap gap-x-1.5 gap-y-1 text-base font-bold">
            {result.expected.map((item, i) => (
              <span
                key={`${item.word}-${i}`}
                className={cn(
                  !item.matched &&
                    "underline decoration-wavy decoration-2 underline-offset-4 opacity-50"
                )}
              >
                {item.word}
              </span>
            ))}
          </p>

          <p className="text-xs opacity-80">
            聞き取り: 「{result.heard || "（聞き取れませんでした）"}」
          </p>
        </div>
      )}
    </div>
  )
}
