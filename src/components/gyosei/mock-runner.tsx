"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Grid3x3, Pause, Timer } from "lucide-react"

import { formatClock, SubjectBadge } from "@/components/gyosei/common"
import { InlineConfirm } from "@/components/gyosei/inline-confirm"
import { KijutsuAnswerBox } from "@/components/gyosei/kijutsu-practice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { addStudySeconds, saveDraft } from "@/lib/gyosei/actions"
import { KIJUTSU, STATEMENT_MAP, TASHI } from "@/lib/gyosei/content"
import type { MockAnswer, MockDraft, MockQuestion } from "@/lib/gyosei/mock"
import { BLANKS, type Blank } from "@/lib/gyosei/types"
import { cn } from "@/lib/utils"

const SAVE_EVERY_SECONDS = 15

export function sectionLabel(question: MockQuestion): string {
  if (question.kind === "tashi") return "多肢選択式"
  if (question.kind === "kijutsu") return "記述式"
  return question.subject === "chishiki" ? "基礎知識 5肢択一" : "法令等 5肢択一"
}

export function isAnswered(question: MockQuestion, answer: MockAnswer): boolean {
  if (question.kind === "choice5") return answer.choice !== undefined
  if (question.kind === "tashi")
    return BLANKS.every((blank) => answer.blanks?.[blank])
  return Boolean(answer.text?.trim())
}

export function MockRunner({
  initial,
  today,
  onPause,
  onSubmit,
}: {
  initial: MockDraft
  today: string
  onPause: () => void
  onSubmit: (draft: MockDraft) => void
}) {
  const [answers, setAnswers] = useState(initial.answers)
  const [index, setIndex] = useState(0)
  const [elapsed, setElapsed] = useState(initial.elapsedSec)
  const [showNav, setShowNav] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const savedElapsed = useRef(initial.elapsedSec)
  const latest = useRef({ answers, elapsed })

  useEffect(() => {
    latest.current = { answers, elapsed }
  }, [answers, elapsed])

  function persist() {
    const { answers: a, elapsed: e } = latest.current
    const draft = { ...initial, answers: a, elapsedSec: e }
    saveDraft(draft)
    addStudySeconds(today, e - savedElapsed.current)
    savedElapsed.current = e
    return draft
  }

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  const remaining = initial.limitSec - elapsed
  const timeUp = remaining <= 0

  useEffect(() => {
    if (elapsed % SAVE_EVERY_SECONDS === 0) persist()
    // persist は latest を読むだけなので依存に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed])

  function update(next: MockAnswer) {
    const copy = [...answers]
    copy[index] = next
    setAnswers(copy)
    latest.current = { answers: copy, elapsed }
    persist()
  }

  function submit() {
    onSubmit(persist())
  }

  const question = initial.questions[index]
  const answer = answers[index]
  const answeredCount = initial.questions.filter((q, i) =>
    isAnswered(q, answers[i])
  ).length
  const unanswered = initial.questions.length - answeredCount

  return (
    <div className="flex flex-col gap-4">
      <header className="bg-background/90 sticky top-[env(safe-area-inset-top,0px)] z-10 -mx-4 flex flex-col gap-2 px-4 py-2 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 font-mono text-lg font-bold tabular-nums",
              remaining < 300 && "text-rose-600"
            )}
          >
            <Timer className="size-4" />
            {timeUp ? "時間切れ" : formatClock(remaining)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNav(!showNav)}
              aria-expanded={showNav}
            >
              <Grid3x3 />
              {answeredCount}/{initial.questions.length}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                persist()
                onPause()
              }}
            >
              <Pause />
              中断
            </Button>
          </div>
        </div>
        {showNav && (
          <div className="grid grid-cols-10 gap-1">
            {initial.questions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i)
                  setShowNav(false)
                }}
                className={cn(
                  "rounded-md border py-1 text-xs tabular-nums",
                  isAnswered(q, answers[i]) && "bg-primary/15 border-primary/40",
                  i === index && "ring-primary ring-2"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </header>

      {timeUp && (
        <p className="rounded-xl bg-rose-500/10 p-3 text-sm font-bold text-rose-700 dark:text-rose-300">
          制限時間を過ぎました。本試験ではここで終了です。提出して採点しましょう。
        </p>
      )}

      <Card className="gap-4 rounded-3xl py-5">
        <CardContent className="flex flex-col gap-4 px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold">問題 {index + 1}</span>
            <span className="text-muted-foreground text-xs">
              {sectionLabel(question)}
            </span>
            <SubjectBadge subject={question.subject} />
          </div>

          {question.kind === "choice5" && (
            <div className="flex flex-col gap-3">
              <p className="font-bold leading-relaxed">{question.header}</p>
              {question.options.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => update({ ...answer, choice: i })}
                  className={cn(
                    "flex gap-3 rounded-xl border-2 p-3 text-left text-sm leading-relaxed transition-colors",
                    answer.choice === i
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted border-transparent bg-muted/50"
                  )}
                >
                  <span className="font-extrabold">{i + 1}</span>
                  <span>{STATEMENT_MAP.get(id)?.text}</span>
                </button>
              ))}
            </div>
          )}

          {question.kind === "tashi" && (
            <TashiInput
              key={index}
              passage={TASHI.find((t) => t.id === question.id)!.passage}
              title={TASHI.find((t) => t.id === question.id)!.title}
              choices={question.choices}
              value={answer.blanks ?? {}}
              onChange={(blanks) => update({ ...answer, blanks })}
            />
          )}

          {question.kind === "kijutsu" && (
            <div className="flex flex-col gap-3">
              <p className="leading-relaxed">
                {KIJUTSU.find((k) => k.id === question.id)!.prompt}
              </p>
              <KijutsuAnswerBox
                value={answer.text ?? ""}
                onChange={(text) => update({ ...answer, text })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="rounded-xl"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          <ChevronLeft />
          前へ
        </Button>
        {index < initial.questions.length - 1 ? (
          <Button className="rounded-xl" onClick={() => setIndex(index + 1)}>
            次へ
            <ChevronRight />
          </Button>
        ) : (
          <Button
            className="rounded-xl"
            onClick={() => (unanswered === 0 ? submit() : setConfirming(true))}
          >
            提出して採点
          </Button>
        )}
      </div>
      {confirming ? (
        <InlineConfirm
          message={
            unanswered > 0
              ? `未回答が${unanswered}問あります。提出して採点しますか？`
              : "ここで提出して採点しますか？"
          }
          confirmLabel="提出する"
          onConfirm={submit}
          onCancel={() => setConfirming(false)}
        />
      ) : (
        index < initial.questions.length - 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground self-center"
            onClick={() => setConfirming(true)}
          >
            提出して採点する
          </Button>
        )
      )}
    </div>
  )
}

function TashiInput({
  title,
  passage,
  choices,
  value,
  onChange,
}: {
  title: string
  passage: string
  choices: string[]
  value: Partial<Record<Blank, string>>
  onChange: (value: Partial<Record<Blank, string>>) => void
}) {
  const [active, setActive] = useState<Blank>(
    BLANKS.find((blank) => !value[blank]) ?? "ア"
  )
  const parts = passage.split(/\{(ア|イ|ウ|エ)\}/)

  return (
    <div className="flex flex-col gap-3">
      <p className="font-bold">
        次の文章（{title}）の空欄ア〜エに当てはまる語句を、語群から選びなさい。
      </p>
      <p className="bg-muted/50 rounded-xl p-3 text-sm leading-loose">
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <button
              key={i}
              type="button"
              onClick={() => setActive(part as Blank)}
              className={cn(
                "mx-0.5 inline-flex min-w-16 items-center justify-center rounded-md border-2 px-1.5 align-middle text-sm font-bold",
                active === part
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background"
              )}
            >
              {part}：{value[part as Blank] ?? "　"}
            </button>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
      <p className="text-muted-foreground text-xs">
        空欄「{active}」に入る語を選ぶ（空欄をタップして切り替え）
      </p>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {choices.map((choice, i) => {
          const usedBy = BLANKS.find((blank) => value[blank] === choice)
          return (
            <button
              key={choice}
              type="button"
              onClick={() => {
                const next = { ...value, [active]: choice }
                onChange(next)
                const following = BLANKS.find((blank) => !next[blank])
                if (following) setActive(following)
              }}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-left text-xs",
                usedBy ? "border-primary bg-primary/10 font-bold" : "hover:bg-muted"
              )}
            >
              <span className="text-muted-foreground mr-1 tabular-nums">
                {i + 1}
              </span>
              {choice}
              {usedBy && <span className="text-primary ml-1">（{usedBy}）</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
