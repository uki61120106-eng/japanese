"use client"

import { Check, Flame, Play, Volume2, VolumeX } from "lucide-react"

import { InstallHint } from "@/components/install-hint"
import { Button } from "@/components/ui/button"
import { DietCard } from "@/components/workout/diet-card"
import { ExerciseFigure } from "@/components/workout/exercise-figure"
import { Switch } from "@/components/ui/switch"
import { resolveExercise } from "@/lib/workout/exercises"
import {
  addDays,
  currentStreak,
  dateKey,
  isDayDone,
  sessionsByDate,
} from "@/lib/workout/goal"
import {
  LEVELS,
  ROUNDS,
  WEEK,
  WEEKDAY_LABELS,
  buildSession,
  dayPlanFor,
  estimateKcal,
  type Level,
} from "@/lib/workout/plan"
import { isPastReminder } from "@/lib/workout/reminder"
import { updateWorkoutData, type WorkoutData } from "@/lib/workout/storage"
import { cn } from "@/lib/utils"

type TodayTabProps = {
  data: WorkoutData
  today: Date
  weightKg: number
  onStart: () => void
}

export function TodayTab({ data, today, weightKg, onStart }: TodayTabProps) {
  const { settings } = data
  const plan = dayPlanFor(today)
  const segments = buildSession(plan, settings)
  const kcal = estimateKcal(segments, weightKg)
  const byDate = sessionsByDate(data.sessions)
  const doneToday = isDayDone(byDate.get(dateKey(today)))
  const streak = currentStreak(data.sessions, today)
  const overdue = !doneToday && isPastReminder(today, settings.reminderTime)

  // 今週（月曜はじまり）
  const monday = addDays(today, -((today.getDay() + 6) % 7))
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i))

  function setSettings(patch: Partial<WorkoutData["settings"]>) {
    updateWorkoutData((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }))
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="bg-card flex flex-col gap-4 rounded-3xl border p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-muted-foreground text-xs font-bold">
              {today.getMonth() + 1}月{today.getDate()}日（{WEEKDAY_LABELS[today.getDay()]}）のメニュー
            </span>
            <h2 className="text-2xl font-extrabold text-balance">{plan.theme}</h2>
            <p className="text-muted-foreground text-sm">{plan.summary}</p>
          </div>
          {doneToday && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
              <Check className="size-3.5" />
              達成
            </span>
          )}
        </div>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "時間", value: "20", unit: "分" },
            { label: "メイン", value: `${plan.main.length}×${ROUNDS}`, unit: "周" },
            { label: "消費の目安", value: `${Math.round(kcal)}`, unit: "kcal" },
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

        <ol className="flex flex-col divide-y">
          {plan.main.map((id, index) => {
            const exercise = resolveExercise(id, settings.quiet)
            return (
              <li key={id} className="flex items-center gap-3 py-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 tabular-nums dark:bg-orange-950/60 dark:text-orange-200">
                  {index + 1}
                </span>
                <ExerciseFigure
                  id={exercise.id}
                  still
                  className="bg-muted/60 size-11 shrink-0 rounded-xl"
                />
                <span className="min-w-0 flex-1 font-bold">{exercise.name}</span>
                <span className="text-muted-foreground shrink-0 text-xs">{exercise.target}</span>
              </li>
            )
          })}
        </ol>
        <p className="text-muted-foreground -mt-2 text-xs">
          前後にウォームアップ3分・ストレッチ3分がつきます
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">強さ</span>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="強さ">
            {(Object.keys(LEVELS) as Level[]).map((level) => (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={settings.level === level}
                onClick={() => setSettings({ level })}
                className={cn(
                  "focus-visible:ring-ring/50 flex flex-col items-center gap-0.5 rounded-2xl border px-2 py-2.5 transition-colors outline-none focus-visible:ring-[3px]",
                  settings.level === level
                    ? "border-orange-400 bg-orange-500 text-white"
                    : "bg-card hover:bg-accent"
                )}
              >
                <span className="font-extrabold">{LEVELS[level].label}</span>
                <span
                  className={cn(
                    "text-[10px] leading-tight",
                    settings.level === level ? "text-white/85" : "text-muted-foreground"
                  )}
                >
                  {LEVELS[level].note}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card flex flex-col divide-y rounded-2xl border">
          <label htmlFor="quiet" className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="flex flex-col">
              <span className="text-sm font-bold">静音モード</span>
              <span className="text-muted-foreground text-xs">
                ジャンプする種目を足音の出ない動きに替えます
              </span>
            </span>
            <Switch
              id="quiet"
              checked={settings.quiet}
              onCheckedChange={(quiet) => setSettings({ quiet })}
            />
          </label>
          <label htmlFor="voice" className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="flex flex-col">
              <span className="flex items-center gap-1.5 text-sm font-bold">
                {settings.voice ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                音声ガイド
              </span>
              <span className="text-muted-foreground text-xs">
                種目名を読み上げます。画面を見なくても進められます
              </span>
            </span>
            <Switch
              id="voice"
              checked={settings.voice}
              onCheckedChange={(voice) => setSettings({ voice })}
            />
          </label>
        </div>

        {overdue && (
          <p className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
            {settings.reminderTime} を過ぎました。今日の20分がまだです
          </p>
        )}
        <Button
          size="xl"
          onClick={onStart}
          className="h-16 rounded-2xl bg-orange-500 text-lg font-extrabold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-500/90"
        >
          <Play className="size-5" />
          {doneToday ? "もう一度やる" : "20分スタート"}
        </Button>
      </section>

      <DietCard data={data} today={today} />

      <InstallHint
        scope="/workout"
        icon="/workout/icons/icon-192.png"
        hidden={settings.hideInstallHint}
        onDismiss={() =>
          updateWorkoutData((data) => ({
            ...data,
            settings: { ...data.settings, hideInstallHint: true },
          }))
        }
        iosNote="iPhone では Safari とホーム画面のアプリで記録の保存場所が分かれます。記録を始める前に追加するのがおすすめです。"
      />

      <section className="bg-card flex flex-col gap-3 rounded-3xl border p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">今週</span>
          <span className="flex items-center gap-1 text-sm font-bold">
            <Flame className="size-4 text-orange-500" />
            <span className="tabular-nums">{streak}</span>日連続
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {week.map((date) => {
            const key = dateKey(date)
            const done = isDayDone(byDate.get(key))
            const isToday = key === dateKey(today)
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "text-[11px] font-bold",
                    isToday ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {WEEKDAY_LABELS[date.getDay()]}
                </span>
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border-2 text-xs",
                    done
                      ? "border-orange-500 bg-orange-500 text-white"
                      : isToday
                        ? "border-orange-400 border-dashed"
                        : "border-border"
                  )}
                  aria-label={done ? "達成" : "未実施"}
                >
                  {done ? <Check className="size-4" /> : WEEK[date.getDay()].theme.slice(0, 1)}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
