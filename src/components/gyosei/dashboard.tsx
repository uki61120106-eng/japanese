"use client"

import {
  CalendarDays,
  ClipboardCheck,
  Flame,
  Play,
  Timer,
  TriangleAlert,
  Trophy,
} from "lucide-react"

import {
  formatMinutes,
  Meter,
  pct,
  StatTile,
  SubjectBadge,
} from "@/components/gyosei/common"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { topicName } from "@/lib/gyosei/content"
import { addDays, formatJP } from "@/lib/gyosei/dates"
import type { DayInfo, Plan } from "@/lib/gyosei/plan"
import {
  overallMastery,
  streak,
  type Session,
} from "@/lib/gyosei/session"
import type { AppState } from "@/lib/gyosei/store"
import { cn } from "@/lib/utils"

const DAILY_TARGET_MINUTES = 30

export function Dashboard({
  state,
  plan,
  info,
  today,
  daily,
  onStartDaily,
  onStartCheck,
  onOpenMock,
  onResumeMock,
}: {
  state: AppState
  plan: Plan
  info: DayInfo
  today: string
  daily: Session
  onStartDaily: () => void
  onStartCheck: () => void
  onOpenMock: () => void
  onResumeMock: () => void
}) {
  const settings = state.settings!
  const todayLog = state.days[today]
  const doneToday = todayLog?.done ?? false
  const newCount = daily.items.filter((item) => item.isNew).length
  const reviewCount = daily.items.length - newCount
  // 1問あたり約45秒＋要点5分＋記述8分で見積もる
  const estimate = Math.round(
    (daily.items.length * 45) / 60 + 5 + (daily.kijutsu ? 8 : 0)
  )

  const weekStart = addDays(settings.startDate, info.week * 7)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekSeconds = weekDays.reduce(
    (sum, day) => sum + (state.days[day]?.seconds ?? 0),
    0
  )
  const checkDone = state.checks.some((check) => check.week === info.week)
  const mastery = overallMastery(state)
  const lastMock = state.mocks[state.mocks.length - 1]
  const studiedSeconds = Object.values(state.days).reduce(
    (sum, day) => sum + day.seconds,
    0
  )

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-bold tracking-widest">
          行政書士 1年合格プラン
        </p>
        <div className="flex flex-wrap items-end justify-between gap-x-3">
          <h1 className="text-2xl font-black tracking-tight whitespace-nowrap">
            本試験まで
            <span className="text-primary mx-1 text-4xl tabular-nums">
              {Math.max(info.daysLeft, 0)}
            </span>
            日
          </h1>
          <span className="text-muted-foreground pb-1 text-xs">
            {formatJP(settings.examDate)}
          </span>
        </div>
      </header>

      {info.status === "before" && (
        <Notice>
          学習開始日は {formatJP(settings.startDate)} です。それまでは計画の1日目の内容で練習できます。
        </Notice>
      )}
      {info.status === "after" && (
        <Notice>
          設定した試験日を過ぎました。次の試験を目指す場合は、設定で開始日と試験日を更新してください。
        </Notice>
      )}

      {state.draft && (
        <Card className="gap-3 rounded-3xl border-2 border-amber-400/60 py-4">
          <CardContent className="flex items-center justify-between gap-3 px-5">
            <div className="flex flex-col">
              <span className="text-sm font-bold">
                {state.draft.kind === "full" ? "本試験形式の模試" : "ミニ模試"}を中断中
              </span>
              <span className="text-muted-foreground text-xs">
                続きから再開できます
              </span>
            </div>
            <Button size="sm" className="rounded-lg" onClick={onResumeMock}>
              再開
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="gap-4 rounded-3xl border-2 py-5 shadow-md">
        <CardContent className="flex flex-col gap-4 px-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs font-bold">
              第{info.week + 1}週 / 全{plan.totalWeeks}週 ・ {info.phase?.name}
            </span>
            {doneToday && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                完了
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs">今日の単元</span>
            {info.topic && (
              <div className="flex flex-wrap items-center gap-2">
                <SubjectBadge subject={info.topic.subject} />
                <span className="text-lg font-extrabold">
                  {topicName(info.topic.subject, info.topic.topic)}
                </span>
              </div>
            )}
            {info.phase && (
              <span className="text-muted-foreground text-xs">
                フェーズ目標：{info.phase.goal}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniStat label="新しい問題" value={newCount} />
            <MiniStat label="復習" value={reviewCount} />
            <MiniStat label="記述" value={daily.kijutsu ? 1 : 0} />
          </div>

          <Button
            size="xl"
            onClick={onStartDaily}
            disabled={daily.items.length === 0 && !daily.kijutsu}
            className="w-full gap-2 rounded-2xl text-base font-bold"
          >
            <Play className="size-5" />
            {doneToday ? "もう一周する" : `今日の学習をはじめる（約${estimate}分）`}
          </Button>
        </CardContent>
      </Card>

      {info.isCheckDay && (
        <Card
          className={cn(
            "gap-3 rounded-3xl py-4",
            !checkDone && "border-primary/50 border-2"
          )}
        >
          <CardContent className="flex flex-col gap-3 px-5">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="text-primary size-5" />
              <span className="font-bold">週末の理解度チェック</span>
            </div>
            <p className="text-muted-foreground text-sm">
              今週の単元から15問。正答率80%以上で合格。
              {info.isMockDay && " 今週は4週ごとのミニ模試の週でもあります。"}
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1 rounded-xl"
                variant={checkDone ? "outline" : "default"}
                onClick={onStartCheck}
              >
                {checkDone ? "もう一度チェック" : "チェックを受ける"}
              </Button>
              {info.isMockDay && (
                <Button
                  className="flex-1 rounded-xl"
                  variant="outline"
                  onClick={onOpenMock}
                >
                  ミニ模試へ
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-bold">
            <CalendarDays className="size-4" />
            今週の記録
          </h2>
          <span className="text-muted-foreground text-xs tabular-nums">
            {formatMinutes(weekSeconds)} / 目標 {DAILY_TARGET_MINUTES * 7}分
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((day, index) => {
            const log = state.days[day]
            const isToday = day === today
            return (
              <div
                key={day}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-xl border text-xs font-bold",
                  log?.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : log
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "bg-card",
                  isToday && "ring-primary ring-2 ring-offset-1"
                )}
                title={day}
              >
                <span>{index === 6 ? "確認" : index + 1}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <StatTile
          label="連続学習"
          value={streak(state, today)}
          unit="日"
          hint="学習セットを終えた日"
        />
        <StatTile
          label="累計学習時間"
          value={formatMinutes(studiedSeconds)}
          hint={`計画どおりなら約${Math.round((plan.totalDays * DAILY_TARGET_MINUTES) / 60)}時間`}
        />
        <div className="bg-card col-span-2 flex flex-col gap-2 rounded-2xl border p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Flame className="size-3.5" />
              定着した問題（2週間空けても正解）
            </span>
            <span className="font-bold tabular-nums">
              {mastery.mastered} / {mastery.total}問
            </span>
          </div>
          <Meter value={pct(mastery.mastered, mastery.total)} />
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>一度でも解いた問題</span>
            <span className="tabular-nums">
              {mastery.seen} / {mastery.total}問
            </span>
          </div>
        </div>
        {lastMock && (
          <div className="bg-card col-span-2 flex items-center justify-between rounded-2xl border p-3">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Trophy className="size-3.5" />
              直近の模試（{lastMock.kind === "full" ? "本試験形式" : "ミニ・換算"}）
            </span>
            <span
              className={cn(
                "font-extrabold tabular-nums",
                lastMock.passed ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {lastMock.scaledTotal} / 300点
            </span>
          </div>
        )}
      </section>

      <p className="text-muted-foreground flex items-start gap-1.5 text-xs leading-relaxed">
        <Timer className="mt-0.5 size-3.5 shrink-0" />
        毎日：要点（5分）→ 新しい問題 → 復習。7日目は理解度チェック、4週ごとにミニ模試、直前期は本試験形式の模試。
      </p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/60 flex flex-col rounded-xl py-2">
      <span className="text-xl font-extrabold tabular-nums">{value}</span>
      <span className="text-muted-foreground text-[0.7rem]">{label}</span>
    </div>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
      <span>{children}</span>
    </p>
  )
}
