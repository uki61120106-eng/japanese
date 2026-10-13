"use client"

import { CalendarClock, Flame, Play, Timer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { daysBetween, formatDate, type DateKey } from "@/lib/sharoushi/dates"
import {
  PHASE_LABEL,
  currentBlock,
  estimateMinutes,
  type DailyMenu,
  type PlanBlock,
} from "@/lib/sharoushi/plan"
import type { StudyData } from "@/lib/sharoushi/store"
import { streakDays } from "@/lib/sharoushi/stats"

type TodayTabProps = {
  data: StudyData
  today: DateKey
  plan: PlanBlock[]
  menu: DailyMenu
  onStart: () => void
}

export function TodayTab({ data, today, plan, menu, onStart }: TodayTabProps) {
  const daysLeft = daysBetween(today, data.examDate)
  const todayLog = data.log[today]
  const minutes = Math.floor((todayLog?.seconds ?? 0) / 60)
  const goal = data.dailyGoalMinutes
  const streak = streakDays(data.log, today)
  const block = currentBlock(plan, today)
  const count = menu.review.length + menu.fresh.length

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="gap-1 rounded-2xl py-4">
          <CardContent className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <CalendarClock className="size-3.5" />
              本試験まで
            </span>
            <span className="text-3xl font-black tabular-nums">
              {daysLeft > 0 ? daysLeft : 0}
              <span className="text-muted-foreground ml-1 text-sm font-bold">日</span>
            </span>
          </CardContent>
        </Card>
        <Card className="gap-1 rounded-2xl py-4">
          <CardContent className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Flame className="size-3.5" />
              連続学習
            </span>
            <span className="text-3xl font-black tabular-nums">
              {streak}
              <span className="text-muted-foreground ml-1 text-sm font-bold">日</span>
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-3 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 font-bold">
              <Timer className="size-4" />
              今日の学習時間
            </span>
            <span className="tabular-nums">
              {minutes} / {goal} 分
            </span>
          </div>
          <Progress
            value={Math.min(100, (minutes / goal) * 100)}
            className="bg-muted h-2.5"
            indicatorClassName="bg-teal-500"
          />
          <p className="text-muted-foreground text-xs">
            解いた問題 {todayLog?.answered ?? 0}問・正解 {todayLog?.correct ?? 0}問
          </p>
        </CardContent>
      </Card>

      {daysLeft <= 0 ? (
        <Card className="rounded-2xl py-5">
          <CardContent className="text-sm">
            設定されている試験日（{formatDate(data.examDate)}）を過ぎました。
            「計画」タブで次の試験日を設定してください。
          </CardContent>
        </Card>
      ) : (
        <Card className="gap-4 rounded-3xl border-2 border-teal-200 py-5 shadow-lg dark:border-teal-900">
          <CardContent className="flex flex-col gap-4">
            {block && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                  {PHASE_LABEL[block.kind]}
                </span>
                <span className="text-lg font-bold">{block.title}</span>
                <span className="text-muted-foreground text-xs">{block.description}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-muted/60 rounded-xl py-2">
                <div className="text-muted-foreground text-xs">復習</div>
                <div className="text-xl font-bold tabular-nums">{menu.review.length}問</div>
              </div>
              <div className="bg-muted/60 rounded-xl py-2">
                <div className="text-muted-foreground text-xs">新しい問題</div>
                <div className="text-xl font-bold tabular-nums">{menu.fresh.length}問</div>
              </div>
            </div>

            <Button
              size="xl"
              disabled={count === 0}
              onClick={onStart}
              className="w-full gap-2 rounded-2xl bg-teal-600 text-base font-bold text-white shadow-md hover:bg-teal-600/90"
            >
              <Play className="size-5" />
              {count === 0 ? "今日のメニューは完了" : `今日のメニューを始める（約${estimateMinutes(count)}分）`}
            </Button>
            {count === 0 && (
              <p className="text-muted-foreground text-center text-xs">
                余裕があれば「振り返り」で苦手な問題に取り組みましょう
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
