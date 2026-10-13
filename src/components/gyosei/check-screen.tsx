"use client"

import { useState } from "react"
import { ChevronRight, ClipboardCheck, PenLine, Target } from "lucide-react"

import {
  Meter,
  pct,
  ScreenTitle,
  SubjectBadge,
} from "@/components/gyosei/common"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { KIJUTSU, SUBJECT_THEME, topicName } from "@/lib/gyosei/content"
import type { TopicRef } from "@/lib/gyosei/plan"
import { subjectMastery, weakItems } from "@/lib/gyosei/session"
import type { AppState } from "@/lib/gyosei/store"
import type { Kijutsu } from "@/lib/gyosei/types"
import { cn } from "@/lib/utils"

/** 正答率がこれ未満（5回以上解答）の単元を弱点として示す */
const WEAK_RATE = 60

export function CheckScreen({
  state,
  onStartCheck,
  onStartWeak,
  onStartTopic,
  onStartKijutsu,
}: {
  state: AppState
  onStartCheck: () => void
  onStartWeak: () => void
  onStartTopic: (ref: TopicRef) => void
  onStartKijutsu: (kijutsu: Kijutsu) => void
}) {
  const [open, setOpen] = useState<string | null>(null)
  const subjects = subjectMastery(state)
  const weakCount = weakItems(state).length
  const recentChecks = state.checks.slice(-8).reverse()

  return (
    <div className="flex flex-col gap-5">
      <ScreenTitle
        title="理解度チェック"
        description="定着率＝間隔を空けても正解できた問題の割合。正答率＝これまでの全解答のうち正解した割合。"
      />

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-auto flex-col gap-1 rounded-2xl py-3"
          onClick={onStartCheck}
        >
          <ClipboardCheck className="text-primary size-5" />
          <span className="font-bold">今週のチェック</span>
          <span className="text-muted-foreground text-xs">15問・目標80%</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-1 rounded-2xl py-3"
          onClick={onStartWeak}
          disabled={weakCount === 0}
        >
          <Target className="size-5 text-rose-500" />
          <span className="font-bold">苦手克服</span>
          <span className="text-muted-foreground text-xs">
            対象 {weakCount}問
          </span>
        </Button>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">科目別の理解度</h2>
        {subjects.map(({ subject, total, topics }) => {
          const isOpen = open === subject.id
          const accuracy = pct(total.correct, total.answered)
          return (
            <Card key={subject.id} className="gap-0 rounded-2xl py-0">
              <button
                type="button"
                className="flex w-full flex-col gap-2 p-4 text-left"
                onClick={() => setOpen(isOpen ? null : subject.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between gap-2">
                  <SubjectBadge subject={subject.id} />
                  <span className="text-muted-foreground flex items-center gap-1 text-xs tabular-nums">
                    定着 {pct(total.mastered, total.total)}% ・ 正答率{" "}
                    {total.answered ? `${accuracy}%` : "—"}
                    <ChevronRight
                      className={cn("size-4 transition-transform", isOpen && "rotate-90")}
                    />
                  </span>
                </div>
                <Meter
                  value={pct(total.mastered, total.total)}
                  fillClassName={SUBJECT_THEME[subject.id].fill}
                />
              </button>
              {isOpen && (
                <CardContent className="flex flex-col gap-1 border-t px-2 py-2">
                  {topics.map(({ topic, mastery }) => {
                    const rate = pct(mastery.correct, mastery.answered)
                    const weak = mastery.answered >= 5 && rate < WEAK_RATE
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() =>
                          onStartTopic({ subject: subject.id, topic: topic.id })
                        }
                        className="hover:bg-muted flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-left"
                      >
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-sm font-medium">
                            {topic.name}
                            {weak && (
                              <span className="rounded bg-rose-500/15 px-1 text-[0.65rem] font-bold text-rose-600">
                                弱点
                              </span>
                            )}
                          </span>
                          <span className="text-muted-foreground text-xs tabular-nums">
                            解いた {mastery.seen}/{mastery.total} ・ 定着{" "}
                            {mastery.mastered} ・ 正答率{" "}
                            {mastery.answered ? `${rate}%` : "—"}
                          </span>
                        </span>
                        <span className="text-primary shrink-0 text-xs font-bold">
                          演習
                        </span>
                      </button>
                    )
                  })}
                </CardContent>
              )}
            </Card>
          )
        })}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="flex items-center gap-1.5 text-sm font-bold">
          <PenLine className="size-4" />
          記述式（自己採点）
        </h2>
        {KIJUTSU.map((item) => {
          const log = state.kijutsu[item.id]
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onStartKijutsu(item)}
              className="bg-card hover:bg-muted flex items-center justify-between gap-3 rounded-2xl border p-3 text-left"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-2">
                  <SubjectBadge subject={item.subject} />
                  <span className="text-muted-foreground truncate text-xs">
                    {topicName(item.subject, item.topic)}
                  </span>
                </span>
                <span className="line-clamp-1 text-sm">{item.prompt}</span>
              </span>
              <span className="shrink-0 text-right text-xs tabular-nums">
                {log ? (
                  <>
                    <span className="font-bold">{log.last}点</span>
                    <br />
                    <span className="text-muted-foreground">最高 {log.best}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">未回答</span>
                )}
              </span>
            </button>
          )
        })}
      </section>

      {recentChecks.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold">週次チェックの記録</h2>
          <div className="bg-card flex flex-col divide-y rounded-2xl border">
            {recentChecks.map((check) => {
              const rate = pct(check.correct, check.total)
              return (
                <div
                  key={check.week}
                  className="flex items-center justify-between px-4 py-2 text-sm"
                >
                  <span>第{check.week + 1}週</span>
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      rate >= 80 ? "text-emerald-600" : "text-amber-600"
                    )}
                  >
                    {rate}%（{check.correct}/{check.total}）
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
