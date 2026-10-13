"use client"

import { useState } from "react"
import { ClipboardCopy, History, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { addDays, fromDateKey, type DateKey } from "@/lib/sharoushi/dates"
import { QUESTIONS, type Question } from "@/lib/sharoushi/questions"
import type { StudyData } from "@/lib/sharoushi/store"
import { subjectStats, weakQuestions } from "@/lib/sharoushi/stats"
import { getSubject } from "@/lib/sharoushi/subjects"
import { cn } from "@/lib/utils"

type ReviewTabProps = {
  data: StudyData
  today: DateKey
  due: Question[]
  lastWrong: Question[]
  onStart: (title: string, questions: Question[]) => void
}

export function ReviewTab({ data, today, due, lastWrong, onStart }: ReviewTabProps) {
  const stats = subjectStats(data.cards)
  const weak = weakQuestions(data.cards)
  const [copied, setCopied] = useState(false)
  /** クリップボードが使えない環境では、選択してコピーできるように本文を出す */
  const [fallbackText, setFallbackText] = useState<string | null>(null)
  const flagged = QUESTIONS.filter((q) => data.checks[q.id]?.status === "flag")
  const okCount = QUESTIONS.filter((q) => data.checks[q.id]?.status === "ok").length

  async function copyReport() {
    const text = flagged
      .map((q) => {
        const note = data.checks[q.id]?.note
        return `[${q.id}] ${q.statement}\n  正解: ${q.answer ? "○" : "×"} / 根拠: ${q.basis}${note ? `\n  メモ: ${note}` : ""}`
      })
      .join("\n\n")
    const report = `誤りの報告（${flagged.length}件）\n\n${text}`
    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
    } catch {
      setFallbackText(report)
    }
  }

  const days = Array.from({ length: 28 }, (_, i) => addDays(today, i - 27))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Button
          size="xl"
          disabled={due.length === 0}
          onClick={() => onStart("期日の来た復習", due)}
          className="h-auto flex-col gap-0.5 rounded-2xl bg-amber-500 py-3 font-bold text-white hover:bg-amber-500/90"
        >
          <span className="flex items-center gap-1">
            <History className="size-4" />
            復習する
          </span>
          <span className="text-xs font-medium">期日の来た {due.length}問</span>
        </Button>
        <Button
          size="xl"
          disabled={lastWrong.length === 0}
          onClick={() => onStart("前回間違えた問題", lastWrong)}
          className="h-auto flex-col gap-0.5 rounded-2xl bg-rose-600 py-3 font-bold text-white hover:bg-rose-600/90"
        >
          <span className="flex items-center gap-1">
            <RotateCcw className="size-4" />
            解き直す
          </span>
          <span className="text-xs font-medium">前回間違えた {lastWrong.length}問</span>
        </Button>
      </div>

      <Card className="gap-3 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-2">
          <h2 className="text-sm font-bold">直近4週間の学習</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day) => {
              const minutes = (data.log[day]?.seconds ?? 0) / 60
              const level = minutes === 0 && !data.log[day]?.answered ? 0 : minutes < 10 ? 1 : minutes < data.dailyGoalMinutes ? 2 : 3
              return (
                <div
                  key={day}
                  title={`${day}: ${Math.round(minutes)}分`}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-md text-[0.65rem] tabular-nums",
                    level === 0 && "bg-muted text-muted-foreground",
                    level === 1 && "bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200",
                    level === 2 && "bg-teal-300 text-teal-950 dark:bg-teal-700 dark:text-white",
                    level === 3 && "bg-teal-600 text-white",
                    day === today && "ring-foreground/40 ring-2"
                  )}
                >
                  {fromDateKey(day).getDate()}
                </div>
              )
            })}
          </div>
          <p className="text-muted-foreground text-xs">
            濃いほど長く学習した日（最も濃い色が目標{data.dailyGoalMinutes}分以上）
          </p>
        </CardContent>
      </Card>

      <Card className="gap-3 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-3">
          <h2 className="text-sm font-bold">科目別の進み具合</h2>
          {stats.map((s) => {
            const answered = s.correct + s.wrong
            const rate = answered ? Math.round((s.correct / answered) * 100) : null
            return (
              <div key={s.subject} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold">{getSubject(s.subject).name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    着手 {s.seen}/{s.total}・定着 {s.mastered}・正答率 {rate === null ? "—" : `${rate}%`}
                  </span>
                </div>
                <Progress
                  value={(s.seen / s.total) * 100}
                  className="bg-muted h-1.5"
                  indicatorClassName="bg-teal-500"
                />
              </div>
            )
          })}
          <p className="text-muted-foreground text-xs">
            「定着」は60日間隔の段階まで連続で正解した問題
          </p>
        </CardContent>
      </Card>

      <Card className="gap-3 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">苦手な問題</h2>
            {weak.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStart("苦手な問題", weak)}
              >
                まとめて解く
              </Button>
            )}
          </div>
          {weak.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              まだありません。間違えた問題がここに集まります。
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {weak.map((q) => (
                <li key={q.id} className="flex items-start gap-2 text-sm">
                  <Badge variant="secondary" className="mt-0.5">
                    {getSubject(q.subject).short}
                  </Badge>
                  <span className="line-clamp-2 flex-1">{q.statement}</span>
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    ×{data.cards[q.id].wrong}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="gap-3 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-3">
          <h2 className="text-sm font-bold">問題の確認状況</h2>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-emerald-50 py-2 dark:bg-emerald-950/40">
              <div className="text-muted-foreground">確認済み</div>
              <div className="text-lg font-bold tabular-nums">{okCount}</div>
            </div>
            <div className="rounded-xl bg-rose-50 py-2 dark:bg-rose-950/40">
              <div className="text-muted-foreground">要修正</div>
              <div className="text-lg font-bold tabular-nums">{flagged.length}</div>
            </div>
            <div className="bg-muted/60 rounded-xl py-2">
              <div className="text-muted-foreground">未確認</div>
              <div className="text-lg font-bold tabular-nums">
                {QUESTIONS.length - okCount - flagged.length}
              </div>
            </div>
          </div>
          {flagged.length > 0 && (
            <>
              <ul className="flex flex-col gap-2">
                {flagged.map((q) => (
                  <li key={q.id} className="flex flex-col gap-0.5 text-sm">
                    <span className="line-clamp-2">{q.statement}</span>
                    {data.checks[q.id]?.note && (
                      <span className="text-muted-foreground text-xs">
                        メモ: {data.checks[q.id]?.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="outline"
                onClick={copyReport}
                className="gap-1 self-start"
              >
                <ClipboardCopy className="size-3.5" />
                {copied ? "コピーしました" : "報告内容をコピー"}
              </Button>
              {fallbackText !== null && (
                <div className="flex flex-col gap-1">
                  <label htmlFor="report-text" className="text-xs">
                    自動でコピーできませんでした。下の文を全選択してコピーしてください。
                  </label>
                  <textarea
                    id="report-text"
                    readOnly
                    value={fallbackText}
                    rows={6}
                    onFocus={(event) => event.currentTarget.select()}
                    className="border-input bg-background rounded-md border px-2 py-1 text-xs"
                  />
                </div>
              )}
            </>
          )}
          <p className="text-muted-foreground text-xs leading-relaxed">
            解説の下の「条文で確認した」「誤りを報告」で記録できます。
            報告内容をコピーして Claude に渡すと、問題データを直せます。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
