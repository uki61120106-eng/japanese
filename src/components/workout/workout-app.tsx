"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Dumbbell, Settings, Target } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinishScreen } from "@/components/workout/finish-screen"
import { GoalTab } from "@/components/workout/goal-tab"
import { LogTab } from "@/components/workout/log-tab"
import { PlayerScreen } from "@/components/workout/player-screen"
import { SettingsTab } from "@/components/workout/settings-tab"
import { TodayTab } from "@/components/workout/today-tab"
import { currentStreak, dateKey, isDayDone, latestWeight } from "@/lib/workout/goal"
import {
  buildSession,
  dayPlanFor,
  estimateKcal,
  totalSeconds,
  type Segment,
} from "@/lib/workout/plan"
import { registerServiceWorker } from "@/lib/workout/pwa"
import { isPastReminder, showReminderNotification } from "@/lib/workout/reminder"
import { unlockAudio } from "@/lib/workout/sound"
import {
  updateWorkoutData,
  useWorkoutData,
  type SessionLog,
} from "@/lib/workout/storage"

/** 体重が未入力のときに消費カロリーの推定に使う値 */
const DEFAULT_WEIGHT_KG = 60
/** これより短く終えたときは記録しない（秒） */
const MIN_RECORD_SECONDS = 60
/** スキップが多くても「やりきった」と数える下限 */
const COMPLETE_RATIO = 0.8

type Screen =
  | { name: "home" }
  | { name: "player"; segments: Segment[]; startedAt: number }
  | { name: "finish"; session: SessionLog }

type Tab = "today" | "log" | "goal" | "settings"

export function WorkoutApp() {
  const data = useWorkoutData()
  const [today, setToday] = useState(() => new Date())
  const [screen, setScreen] = useState<Screen>({ name: "home" })
  const [tab, setTab] = useState<Tab>("today")

  useEffect(() => {
    registerServiceWorker()
  }, [])

  // アプリを開いている間は1分ごとに確かめ、時刻を過ぎてまだなら1日1回だけ通知する
  const notify = data?.settings.reminderNotify ?? false
  const reminderTime = data?.settings.reminderTime ?? "19:00"
  useEffect(() => {
    if (!notify) return
    const check = () => {
      const now = new Date()
      const key = dateKey(now)
      const current = data
      if (!current || current.settings.lastNotified === key) return
      if (!isPastReminder(now, reminderTime)) return
      if (isDayDone(current.sessions.filter((s) => s.date === key))) return
      void showReminderNotification().then((shown) => {
        if (!shown) return
        updateWorkoutData((latest) => ({
          ...latest,
          settings: { ...latest.settings, lastNotified: key },
        }))
      })
    }
    check()
    const id = window.setInterval(check, 60_000)
    return () => window.clearInterval(id)
  }, [notify, reminderTime, data])

  if (!data) {
    // 端末の記録を読み込むまでの一瞬だけ表示される
    return <div className="bg-muted h-96 animate-pulse rounded-3xl" aria-busy="true" />
  }

  const weightKg =
    latestWeight(data.weights)?.kg ?? data.goal?.startWeight ?? DEFAULT_WEIGHT_KG

  function start() {
    if (!data) return
    unlockAudio()
    const now = new Date()
    setToday(now)
    setScreen({
      name: "player",
      segments: buildSession(dayPlanFor(now), data.settings),
      startedAt: now.getTime(),
    })
  }

  function record(segments: Segment[], activeSeconds: number, finished: boolean) {
    if (!data) return
    if (activeSeconds < MIN_RECORD_SECONDS) {
      setScreen({ name: "home" })
      return
    }
    const total = totalSeconds(segments)
    const session: SessionLog = {
      date: dateKey(today),
      theme: dayPlanFor(today).theme,
      level: data.settings.level,
      seconds: activeSeconds,
      totalSeconds: total,
      kcal: Math.round(estimateKcal(segments, weightKg, activeSeconds)),
      completed: finished && activeSeconds >= total * COMPLETE_RATIO,
    }
    updateWorkoutData((current) => ({
      ...current,
      sessions: [...current.sessions, session],
    }))
    setScreen({ name: "finish", session })
  }

  if (screen.name === "player") {
    return (
      <PlayerScreen
        segments={screen.segments}
        startedAt={screen.startedAt}
        voice={data.settings.voice}
        onFinish={(seconds) => record(screen.segments, seconds, true)}
        onQuit={(seconds) => record(screen.segments, seconds, false)}
      />
    )
  }

  if (screen.name === "finish") {
    return (
      <FinishScreen
        session={screen.session}
        streak={currentStreak(data.sessions, today)}
        goal={data.goal}
        today={today}
        latestKg={latestWeight(data.weights)?.kg}
        onHome={() => {
          setTab("today")
          setScreen({ name: "home" })
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/30">
          <Dumbbell className="size-6" />
        </span>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold">おうち筋トレ20</h1>
          <p className="text-muted-foreground text-xs">
            道具なし・毎日20分・1年で−3kg
          </p>
        </div>
      </header>

      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="gap-5">
        <TabsList className="h-11 w-full rounded-2xl">
          <TabsTrigger value="today" className="rounded-xl">
            <Dumbbell />
            今日
          </TabsTrigger>
          <TabsTrigger value="log" className="rounded-xl">
            <CalendarDays />
            記録
          </TabsTrigger>
          <TabsTrigger value="goal" className="rounded-xl">
            <Target />
            目標
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl">
            <Settings />
            設定
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <TodayTab data={data} today={today} weightKg={weightKg} onStart={start} />
        </TabsContent>
        <TabsContent value="log">
          <LogTab data={data} today={today} />
        </TabsContent>
        <TabsContent value="goal">
          <GoalTab data={data} today={today} />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab data={data} today={today} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
