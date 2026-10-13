"use client"

import { useState } from "react"
import { Check, ChevronRight, House, X } from "lucide-react"

import { formatMinutes, Meter, pct, SubjectBadge } from "@/components/gyosei/common"
import { KijutsuGrader } from "@/components/gyosei/kijutsu-practice"
import { sectionLabel } from "@/components/gyosei/mock-runner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  KIJUTSU,
  STATEMENT_MAP,
  SUBJECTS,
  SUBJECT_THEME,
  TASHI,
} from "@/lib/gyosei/content"
import { PASS_LINE } from "@/lib/gyosei/exam"
import {
  questionScore,
  type MockDraft,
  type MockRecord,
} from "@/lib/gyosei/mock"
import { BLANKS } from "@/lib/gyosei/types"
import { cn } from "@/lib/utils"

/** 記述式の自己採点。終わったら答案（checked 入り）を返す。 */
export function MockGrade({
  draft,
  onDone,
}: {
  draft: MockDraft
  onDone: (draft: MockDraft) => void
}) {
  const [answers, setAnswers] = useState(draft.answers)
  const targets = draft.questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => question.kind === "kijutsu")

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-black">記述式の自己採点</h1>
        <p className="text-muted-foreground text-sm">
          解答例と見比べて、自分の答案に含まれている要素にチェックしてください。
        </p>
      </header>
      {targets.map(({ question, index }) => {
        const data = KIJUTSU.find((k) => k.id === (question as { id: string }).id)!
        return (
          <Card key={index} className="gap-3 rounded-3xl py-5">
            <CardContent className="flex flex-col gap-3 px-5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold">問題 {index + 1}</span>
                <SubjectBadge subject={data.subject} />
              </div>
              <p className="text-sm leading-relaxed">{data.prompt}</p>
              <div className="bg-muted/60 rounded-xl p-3">
                <p className="text-muted-foreground text-xs font-bold">あなたの答案</p>
                <p className="mt-1 leading-relaxed">
                  {answers[index].text?.trim() || "（未記入）"}
                </p>
              </div>
              <KijutsuGrader
                kijutsu={data}
                checked={answers[index].checked ?? []}
                onCheckedChange={(checked) => {
                  const copy = [...answers]
                  copy[index] = { ...copy[index], checked }
                  setAnswers(copy)
                }}
              />
            </CardContent>
          </Card>
        )
      })}
      <Button
        size="lg"
        className="rounded-xl"
        onClick={() => onDone({ ...draft, answers })}
      >
        採点結果を見る
      </Button>
    </div>
  )
}

export function MockResult({
  draft,
  record,
  onHome,
}: {
  draft: MockDraft
  record: MockRecord
  onHome: () => void
}) {
  const [open, setOpen] = useState<number | null>(null)
  const isMini = record.kind === "mini"
  const lawScaled = record.lawMax
    ? Math.round((record.law / record.lawMax) * PASS_LINE.lawMax)
    : 0
  const generalScaled = record.generalMax
    ? Math.round((record.general / record.generalMax) * PASS_LINE.generalMax)
    : 0

  const criteria = [
    {
      label: "法令等",
      value: lawScaled,
      line: PASS_LINE.law,
      max: PASS_LINE.lawMax,
    },
    {
      label: "基礎知識",
      value: generalScaled,
      line: PASS_LINE.general,
      max: PASS_LINE.generalMax,
    },
    {
      label: "合計",
      value: record.scaledTotal,
      line: PASS_LINE.total,
      max: PASS_LINE.totalMax,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Card className="items-center gap-2 rounded-3xl py-6 text-center">
        <CardContent className="flex flex-col items-center gap-1">
          <p className="text-muted-foreground text-sm font-bold">
            {isMini ? "ミニ模試（300点換算）" : "本試験形式 模試"}
          </p>
          <p className="text-5xl font-black tabular-nums">
            {record.scaledTotal}
            <span className="text-xl"> / 300点</span>
          </p>
          <p
            className={cn(
              "mt-2 rounded-full px-3 py-1 text-sm font-bold",
              record.passed
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
            )}
          >
            {record.passed ? "合格基準をすべて満たしています" : "合格基準に届いていません"}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            所要時間 {formatMinutes(record.seconds)}
          </p>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">合格基準との比較</h2>
        {criteria.map((item) => (
          <div key={item.label} className="bg-card flex flex-col gap-1.5 rounded-2xl border p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="flex items-center gap-1 tabular-nums">
                {item.value >= item.line ? (
                  <Check className="size-4 text-emerald-600" />
                ) : (
                  <X className="size-4 text-rose-600" />
                )}
                <span className="font-bold">{item.value}</span>
                <span className="text-muted-foreground text-xs">
                  / {item.max}（基準 {item.line}）
                </span>
              </span>
            </div>
            <div className="relative">
              <Meter
                value={pct(item.value, item.max)}
                fillClassName={item.value >= item.line ? "bg-emerald-500" : "bg-rose-500"}
              />
              <span
                className="bg-foreground absolute top-[-2px] h-3 w-0.5"
                style={{ left: `${pct(item.line, item.max)}%` }}
                aria-hidden
              />
            </div>
          </div>
        ))}
        {isMini && (
          <p className="text-muted-foreground text-xs">
            ミニ模試は正答率を本試験の配点に当てはめた換算値です。
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">科目別（素点）</h2>
        <div className="bg-card flex flex-col gap-3 rounded-2xl border p-3">
          {SUBJECTS.filter((s) => record.bySubject[s.id]).map((subject) => {
            const entry = record.bySubject[subject.id]!
            return (
              <div key={subject.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{subject.name}</span>
                  <span className="tabular-nums">
                    {entry.score} / {entry.max}点（{pct(entry.score, entry.max)}%）
                  </span>
                </div>
                <Meter
                  value={pct(entry.score, entry.max)}
                  fillClassName={SUBJECT_THEME[subject.id].fill}
                />
              </div>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">問題ごとの解説</h2>
        <div className="bg-card flex flex-col divide-y rounded-2xl border">
          {draft.questions.map((question, index) => {
            const answer = draft.answers[index]
            const { score, max } = questionScore(question, answer)
            const isOpen = open === index
            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2">
                    {score === max ? (
                      <Check className="size-4 text-emerald-600" />
                    ) : (
                      <X className="size-4 text-rose-600" />
                    )}
                    問題 {index + 1}
                    <span className="text-muted-foreground text-xs">
                      {sectionLabel(question)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 tabular-nums">
                    {score}/{max}
                    <ChevronRight
                      className={cn("size-4 transition-transform", isOpen && "rotate-90")}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-2 px-3 pb-3 text-sm">
                    {question.kind === "choice5" && (
                      <>
                        <p className="font-bold">{question.header}</p>
                        {question.options.map((id, i) => {
                          const st = STATEMENT_MAP.get(id)!
                          return (
                            <div
                              key={id}
                              className={cn(
                                "rounded-lg border p-2",
                                i === question.answerIndex &&
                                  "border-emerald-500 bg-emerald-500/5",
                                i === answer.choice &&
                                  i !== question.answerIndex &&
                                  "border-rose-500 bg-rose-500/5"
                              )}
                            >
                              <p>
                                <span className="mr-1 font-bold">
                                  {i + 1}（{st.answer ? "○" : "×"}）
                                </span>
                                {st.text}
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                {st.explanation}
                              </p>
                            </div>
                          )
                        })}
                        <p className="text-xs">
                          正解 {question.answerIndex + 1} ／ あなたの解答{" "}
                          {answer.choice !== undefined ? answer.choice + 1 : "未回答"}
                        </p>
                      </>
                    )}
                    {question.kind === "tashi" &&
                      (() => {
                        const data = TASHI.find((t) => t.id === question.id)!
                        return (
                          <>
                            <p className="font-bold">{data.title}</p>
                            {BLANKS.map((blank) => (
                              <p key={blank}>
                                {blank}：正解「{data.answers[blank]}」／ あなた「
                                {answer.blanks?.[blank] ?? "未回答"}」
                              </p>
                            ))}
                          </>
                        )
                      })()}
                    {question.kind === "kijutsu" &&
                      (() => {
                        const data = KIJUTSU.find((k) => k.id === question.id)!
                        return (
                          <>
                            <p>{data.prompt}</p>
                            <p className="text-xs">
                              あなたの答案：{answer.text?.trim() || "（未記入）"}
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300">
                              解答例：{data.modelAnswer}
                            </p>
                          </>
                        )
                      })()}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-muted-foreground text-xs">
          まちがえた5肢択一の正解肢と選んだ肢は、翌日の復習に入ります。
        </p>
      </section>

      <Button size="lg" className="rounded-xl" onClick={onHome}>
        <House />
        ホームへ
      </Button>
    </div>
  )
}
