"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpen, Check, Circle, Lightbulb, X } from "lucide-react"

import { SubjectBadge } from "@/components/gyosei/common"
import { KijutsuPractice } from "@/components/gyosei/kijutsu-practice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { addStudySeconds, recordAnswer, recordKijutsu } from "@/lib/gyosei/actions"
import { SUBJECT_MAP, topicName } from "@/lib/gyosei/content"
import type { Session } from "@/lib/gyosei/session"
import type { Statement } from "@/lib/gyosei/types"
import { cn } from "@/lib/utils"

export type QuizOutcome = { statement: Statement; correct: boolean }

type Step = "points" | "quiz" | "kijutsu"

/** 放置した時間を学習時間に数えないよう、1問あたりの上限を設ける */
const MAX_SECONDS_PER_ITEM = 180

const now = () => Date.now()

export function QuizScreen({
  session,
  today,
  onFinish,
  onQuit,
}: {
  session: Session
  today: string
  onFinish: (outcomes: QuizOutcome[], kijutsuScore: number | null) => void
  onQuit: () => void
}) {
  const showPoints = session.kind === "daily" && session.topic !== null
  const [step, setStep] = useState<Step>(
    showPoints ? "points" : session.items.length ? "quiz" : "kijutsu"
  )
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<boolean | null>(null)
  const [outcomes, setOutcomes] = useState<QuizOutcome[]>([])
  const lastTick = useRef<number | null>(null)

  useEffect(() => {
    lastTick.current = now()
  }, [])

  /** 前回の記録からの経過秒数（学習時間として積み上げる） */
  function elapsed(): number {
    const current = now()
    const seconds = lastTick.current
      ? Math.min((current - lastTick.current) / 1000, MAX_SECONDS_PER_ITEM)
      : 0
    lastTick.current = current
    return Math.round(seconds)
  }

  const item = session.items[index]
  const total = session.items.length

  function answer(value: boolean) {
    if (picked !== null) return
    const correct = value === item.statement.answer
    setPicked(value)
    setOutcomes([...outcomes, { statement: item.statement, correct }])
    recordAnswer(item.statement.id, correct, today, elapsed())
  }

  function next() {
    if (index < total - 1) {
      setIndex(index + 1)
      setPicked(null)
      return
    }
    if (session.kijutsu) {
      setStep("kijutsu")
      return
    }
    onFinish(outcomes, null)
  }

  function quit() {
    addStudySeconds(today, elapsed())
    onQuit()
  }

  const topic = session.topic
  const subjectTopic = topic
    ? SUBJECT_MAP[topic.subject].topics.find((t) => t.id === topic.topic)
    : null

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold">{session.title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={quit}
            className="text-muted-foreground h-7 text-xs"
          >
            中断する
          </Button>
        </div>
        {step === "quiz" && (
          <div className="flex items-center gap-3">
            <Progress value={(index / total) * 100} className="bg-muted h-2" />
            <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
              {index + 1} / {total}
            </span>
          </div>
        )}
      </header>

      {step === "points" && topic && subjectTopic && (
        <Card className="gap-4 rounded-3xl py-5">
          <CardContent className="flex flex-col gap-4 px-5">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary size-4" />
              <span className="text-sm font-bold">今日の要点</span>
              <SubjectBadge subject={topic.subject} />
            </div>
            <h2 className="text-xl font-extrabold">{subjectTopic.name}</h2>
            <ul className="flex flex-col gap-2.5">
              {subjectTopic.points.map((point) => (
                <li key={point} className="flex gap-2 leading-relaxed">
                  <span className="bg-primary mt-2.5 size-1.5 shrink-0 rounded-full" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs">
              目安5分。テキストを持っている場合は、この単元のページを並行して読む。
            </p>
            <Button
              size="lg"
              className="rounded-xl"
              onClick={() => {
                addStudySeconds(today, elapsed())
                setStep(total ? "quiz" : "kijutsu")
              }}
            >
              問題に進む（{total}問）
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "quiz" && item && (
        <Card
          key={item.statement.id}
          className="gap-4 rounded-3xl py-5"
        >
          <CardContent className="flex flex-col gap-4 px-5">
            <div className="flex flex-wrap items-center gap-2">
              <SubjectBadge subject={item.statement.subject} />
              <span className="text-muted-foreground text-xs">
                {topicName(item.statement.subject, item.statement.topic)}
              </span>
              {item.isNew && (
                <span className="rounded-md bg-amber-400/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-amber-700 dark:text-amber-300">
                  NEW
                </span>
              )}
            </div>
            <p className="text-[1.05rem] leading-relaxed font-medium">
              {item.statement.text}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {([true, false] as const).map((value) => {
                const isAnswer = value === item.statement.answer
                const isPicked = picked === value
                return (
                  <Button
                    key={String(value)}
                    variant="outline"
                    size="xl"
                    disabled={picked !== null && !isPicked && !isAnswer}
                    onClick={() => answer(value)}
                    aria-label={value ? "正しい" : "誤り"}
                    className={cn(
                      "h-16 rounded-2xl border-2 text-2xl font-black",
                      picked !== null &&
                        isAnswer &&
                        "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                      picked !== null &&
                        isPicked &&
                        !isAnswer &&
                        "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    )}
                  >
                    {value ? <Circle className="size-7" /> : <X className="size-8" />}
                  </Button>
                )
              })}
            </div>

            {picked !== null && (
              <div className="flex flex-col gap-3">
                <div
                  className={cn(
                    "flex flex-col gap-1.5 rounded-xl p-3",
                    picked === item.statement.answer
                      ? "bg-emerald-500/10"
                      : "bg-rose-500/10"
                  )}
                >
                  <p
                    className={cn(
                      "flex items-center gap-1.5 font-extrabold",
                      picked === item.statement.answer
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-rose-700 dark:text-rose-300"
                    )}
                  >
                    {picked === item.statement.answer ? (
                      <Check className="size-4" />
                    ) : (
                      <X className="size-4" />
                    )}
                    {picked === item.statement.answer ? "正解" : "不正解"}
                    <span className="text-foreground font-bold">
                      ／ 正しくは「{item.statement.answer ? "○" : "×"}」
                    </span>
                  </p>
                  <p className="flex gap-1.5 text-sm leading-relaxed">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    {item.statement.explanation}
                  </p>
                </div>
                <Button size="lg" className="rounded-xl" onClick={next}>
                  {index < total - 1
                    ? "次へ"
                    : session.kijutsu
                      ? "記述式へ"
                      : "結果を見る"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === "kijutsu" && session.kijutsu && (
        <Card className="gap-4 rounded-3xl py-5">
          <CardContent className="px-5">
            <KijutsuPractice
              kijutsu={session.kijutsu}
              doneLabel="記録して結果を見る"
              onDone={(score) => {
                recordKijutsu(session.kijutsu!.id, score, today)
                addStudySeconds(today, elapsed())
                onFinish(outcomes, score)
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
