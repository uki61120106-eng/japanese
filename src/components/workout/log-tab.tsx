"use client"

import { useState } from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { dateKey, formatDateJa, isDayDone, sessionsByDate } from "@/lib/workout/goal"
import { LEVELS, WEEKDAY_LABELS } from "@/lib/workout/plan"
import type { WorkoutData } from "@/lib/workout/storage"
import { cn } from "@/lib/utils"

export function LogTab({ data, today }: { data: WorkoutData; today: Date }) {
  // 表示している月（今月からのずれ）
  const [offset, setOffset] = useState(0)
  const month = new Date(today.getFullYear(), today.getMonth() + offset, 1)
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  // 月曜はじまりで先頭を空ける
  const lead = (month.getDay() + 6) % 7
  const byDate = sessionsByDate(data.sessions)
  const todayKey = dateKey(today)

  const monthPrefix = dateKey(month).slice(0, 7)
  const monthSessions = data.sessions.filter((s) => s.date.startsWith(monthPrefix))
  const doneDays = new Set(monthSessions.filter((s) => s.completed).map((s) => s.date)).size
  const minutes = Math.round(monthSessions.reduce((sum, s) => sum + s.seconds, 0) / 60)
  const kcal = Math.round(monthSessions.reduce((sum, s) => sum + s.kcal, 0))

  const recent = [...data.sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  const weekdayOrder = [1, 2, 3, 4, 5, 6, 0]

  return (
    <div className="flex flex-col gap-5">
      <section className="bg-card flex flex-col gap-4 rounded-3xl border p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setOffset(offset - 1)} aria-label="前の月">
            <ChevronLeft />
          </Button>
          <h2 className="text-lg font-extrabold tabular-nums">
            {month.getFullYear()}年{month.getMonth() + 1}月
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOffset(offset + 1)}
            disabled={offset >= 0}
            aria-label="次の月"
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdayOrder.map((day) => (
            <span key={day} className="text-muted-foreground text-[11px] font-bold">
              {WEEKDAY_LABELS[day]}
            </span>
          ))}
          {Array.from({ length: lead }, (_, i) => (
            <span key={`lead-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(month.getFullYear(), month.getMonth(), i + 1)
            const key = dateKey(date)
            const list = byDate.get(key)
            const done = isDayDone(list)
            const partial = !done && Boolean(list?.length)
            return (
              <span
                key={key}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-full text-xs font-bold tabular-nums",
                  done && "bg-orange-500 text-white",
                  partial && "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200",
                  !done && !partial && key > todayKey && "text-muted-foreground/50",
                  key === todayKey && !done && "ring-2 ring-orange-400"
                )}
                title={done ? "達成" : partial ? "途中まで" : undefined}
              >
                {i + 1}
              </span>
            )
          })}
        </div>

        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-orange-500" />
            20分やりきった日
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-orange-100 dark:bg-orange-950/60" />
            途中まで
          </span>
        </div>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "達成した日", value: doneDays, unit: "日" },
            { label: "運動時間", value: minutes, unit: "分" },
            { label: "消費（推定）", value: kcal.toLocaleString(), unit: "kcal" },
          ].map((item) => (
            <div key={item.label} className="bg-muted rounded-2xl px-2 py-2.5">
              <dt className="text-muted-foreground text-[11px] font-bold">{item.label}</dt>
              <dd className="text-lg font-extrabold tabular-nums">
                {item.value}
                <span className="text-muted-foreground ml-0.5 text-xs font-bold">{item.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">最近のトレーニング</h2>
        {recent.length === 0 ? (
          <p className="bg-card text-muted-foreground rounded-2xl border p-4 text-sm">
            まだ記録がありません。「今日」タブの「20分スタート」から始めると、ここに並びます。
          </p>
        ) : (
          <ul className="bg-card flex flex-col divide-y rounded-2xl border">
            {recent.map((session, index) => (
              <li key={`${session.date}-${index}`} className="flex items-center gap-3 px-4 py-3">
                <span className="w-11 shrink-0 text-sm font-bold tabular-nums">
                  {formatDateJa(session.date)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-bold">{session.theme}</span>
                  <span className="text-muted-foreground text-xs">
                    {LEVELS[session.level].label}・{Math.round(session.seconds / 60)}分・
                    {Math.round(session.kcal)}kcal
                  </span>
                </span>
                {session.completed ? (
                  <Check className="size-5 shrink-0 text-orange-500" aria-label="達成" />
                ) : (
                  <span className="text-muted-foreground shrink-0 text-xs">途中</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
