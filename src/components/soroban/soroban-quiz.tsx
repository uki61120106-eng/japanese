"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowRight, Circle, Delete, Timer, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { QuizResult } from "@/components/soroban/soroban-app"
import { GRADE_THEME } from "@/components/soroban/soroban-home"
import { ProblemView } from "@/components/soroban/problem-view"
import {
  KIND_LABEL,
  answerOf,
  formatNumber,
  type Grade,
  type Problem,
} from "@/lib/soroban"
import { cn } from "@/lib/utils"

/** 4級のかけ算でも答えは最大7桁。余裕をもって9桁まで入力できる。 */
const MAX_DIGITS = 9

type SorobanQuizProps = {
  grade: Grade
  problems: Problem[]
  onFinish: (result: QuizResult) => void
  onQuit: () => void
}

export function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return minutes > 0 ? `${minutes}ふん ${seconds}びょう` : `${seconds}びょう`
}

export function SorobanQuiz({
  grade,
  problems,
  onFinish,
  onQuit,
}: SorobanQuizProps) {
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState("")
  const [answers, setAnswers] = useState<Record<string, number>>({})
  /** こたえ合わせ中なら、そのときの入力 */
  const [checked, setChecked] = useState<number | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const startedAt = useRef(0)
  const problemArea = useRef<HTMLDivElement>(null)
  /** 問題の下側が画面に入りきっていないとき true */
  const [hasMoreBelow, setHasMoreBelow] = useState(false)

  const current = problems[index]
  const correct = answerOf(current)
  const isLast = index === problems.length - 1

  // こたえ合わせ中は時計を止める（考えている時間だけを数える）
  useEffect(() => {
    if (checked !== null) return
    startedAt.current = Date.now() - elapsedMs
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt.current)
    }, 250)
    return () => window.clearInterval(timer)
    // elapsedMs は再開時の基準にだけ使う
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked])

  function press(digit: string) {
    if (checked !== null) return
    setInput((value) =>
      value.length >= MAX_DIGITS || (value === "0" && digit === "0")
        ? value
        : value === "0"
          ? digit
          : value + digit
    )
  }

  function erase() {
    if (checked !== null) return
    setInput((value) => value.slice(0, -1))
  }

  function submit() {
    if (checked !== null || input === "") return
    const value = Number(input)
    setAnswers((prev) => ({ ...prev, [current.id]: value }))
    setElapsedMs(Date.now() - startedAt.current)
    setChecked(value)
  }

  function next() {
    if (checked === null) return
    if (isLast) {
      onFinish({ answers, elapsedMs })
      return
    }
    setIndex(index + 1)
    setInput("")
    setChecked(null)
  }

  // 見取算の数が見切れていたら「したに つづくよ」を出す（数を見落とさないように）
  function updateHasMoreBelow() {
    const el = problemArea.current
    if (!el) return
    setHasMoreBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 4)
  }

  useEffect(() => {
    const el = problemArea.current
    if (!el) return
    el.scrollTop = 0
    updateHasMoreBelow()
    const observer = new ResizeObserver(updateHasMoreBelow)
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  // パソコンではキーボードでも入力できる
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (/^[0-9]$/.test(event.key)) press(event.key)
      else if (event.key === "Backspace") erase()
      else if (event.key === "Enter") {
        event.preventDefault()
        if (checked === null) submit()
        else next()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  const isCorrect = checked === correct

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <header className="flex shrink-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm font-medium tabular-nums">
            {grade}きゅう ・ {index + 1} / {problems.length} もんめ
          </span>
          <span className="text-muted-foreground flex items-center gap-1 text-sm tabular-nums">
            <Timer className="size-4" />
            {formatTime(elapsedMs)}
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
          value={(index / problems.length) * 100}
          className="bg-muted h-2.5"
          indicatorClassName={cn(
            "transition-all duration-300",
            GRADE_THEME[grade].fill
          )}
        />
      </header>

      <div className="bg-card flex min-h-0 flex-1 flex-col items-center gap-2 rounded-3xl border-2 px-4 py-3 shadow-lg">
        {/* 画面がとても低いときだけ、問題の部分がスクロールする */}
        <div className="relative flex min-h-0 w-full flex-1 flex-col">
          <div
            ref={problemArea}
            onScroll={updateHasMoreBelow}
            className="flex min-h-0 w-full flex-1 overflow-y-auto"
          >
            <div className="m-auto flex flex-col items-center gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                {KIND_LABEL[current.kind]}
              </span>
              <ProblemView problem={current} />
            </div>
          </div>
          {hasMoreBelow && (
            <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t pt-6">
              <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow">
                <ArrowDown className="size-3.5" />
                したに つづくよ
              </span>
            </div>
          )}
        </div>

        <div
          aria-live="polite"
          className={cn(
            "flex h-12 w-full shrink-0 items-center [@media(min-height:620px)]:h-14 justify-end rounded-2xl border-2 px-4 text-3xl font-black tabular-nums",
            checked === null && "border-amber-300 bg-amber-50/60 dark:border-amber-700 dark:bg-amber-950/30",
            checked !== null &&
              isCorrect &&
              "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
            checked !== null &&
              !isCorrect &&
              "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
          )}
        >
          {input === "" ? (
            <span className="text-muted-foreground text-base font-medium">
              こたえを いれてね
            </span>
          ) : (
            formatNumber(Number(input))
          )}
        </div>
      </div>

      {checked === null ? (
        <NumberPad
          onDigit={press}
          onErase={erase}
          onSubmit={submit}
          canSubmit={input !== ""}
        />
      ) : (
        <div className="flex shrink-0 flex-col gap-3">
          <div
            className={cn(
              "flex items-center justify-center gap-3 rounded-2xl px-4 py-4 text-center",
              isCorrect
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
            )}
          >
            {isCorrect ? (
              <>
                <Circle className="size-10 stroke-[3]" />
                <span className="text-2xl font-black">せいかい！</span>
              </>
            ) : (
              <>
                <X className="size-10 stroke-[3]" />
                <span className="flex flex-col items-start">
                  <span className="text-lg font-black">ざんねん…</span>
                  <span className="text-sm">
                    こたえは{" "}
                    <span className="text-xl font-black tabular-nums">
                      {formatNumber(correct)}
                    </span>
                  </span>
                </span>
              </>
            )}
          </div>
          <Button
            size="xl"
            onClick={next}
            autoFocus
            className="h-16 gap-2 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 text-lg font-bold text-white shadow-lg hover:from-amber-500/90 hover:to-orange-500/90"
          >
            {isLast ? "けっかを みる" : "つぎの もんだい"}
            <ArrowRight className="size-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

function NumberPad({
  onDigit,
  onErase,
  onSubmit,
  canSubmit,
}: {
  onDigit: (digit: string) => void
  onErase: () => void
  onSubmit: () => void
  canSubmit: boolean
}) {
  // 背の低いスマホ（iPhone SE など）ではキーを少し低くする
  const key =
    "h-11 [@media(min-height:620px)]:h-12 [@media(min-height:720px)]:h-14 rounded-2xl border-2 bg-card text-2xl font-bold shadow-sm transition-all active:scale-95 hover:bg-muted"
  return (
    <div className="grid shrink-0 grid-cols-3 gap-2 select-none">
      {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((digit) => (
        <button
          key={digit}
          type="button"
          className={key}
          onClick={() => onDigit(digit)}
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        aria-label="1もじ けす"
        className={cn(key, "flex items-center justify-center text-base")}
        onClick={onErase}
      >
        <Delete className="size-6" />
      </button>
      <button type="button" className={key} onClick={() => onDigit("0")}>
        0
      </button>
      <button
        type="button"
        disabled={!canSubmit}
        className="h-11 rounded-2xl bg-emerald-500 [@media(min-height:620px)]:h-12 [@media(min-height:720px)]:h-14 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-500/90 active:scale-95 disabled:opacity-40"
        onClick={onSubmit}
      >
        こたえる
      </button>
    </div>
  )
}
