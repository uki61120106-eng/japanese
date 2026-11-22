"use client"

import { Flame, PartyPopper } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WeightForm } from "@/components/workout/weight-form"
import { dailyKcalTarget } from "@/lib/workout/goal"
import type { Goal, SessionLog } from "@/lib/workout/storage"

type FinishScreenProps = {
  session: SessionLog
  streak: number
  goal: Goal | null
  today: Date
  latestKg?: number
  onHome: () => void
}

export function FinishScreen({
  session,
  streak,
  goal,
  today,
  latestKg,
  onHome,
}: FinishScreenProps) {
  const minutes = Math.floor(session.seconds / 60)
  const seconds = session.seconds % 60
  const target = dailyKcalTarget(goal ?? { lossKg: 3 })
  const ratio = Math.round((session.kcal / target) * 100)

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col items-center gap-2 py-4 text-center">
        <PartyPopper className="size-12 text-orange-500" />
        <h1 className="text-3xl font-extrabold">
          {session.completed ? "おつかれさまでした" : "ここまで記録しました"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {session.theme}・{minutes}分{seconds > 0 ? `${seconds}秒` : ""}
        </p>
      </section>

      <dl className="grid grid-cols-2 gap-3">
        <div className="bg-card flex flex-col gap-1 rounded-2xl border p-4">
          <dt className="text-muted-foreground text-xs font-bold">消費（推定）</dt>
          <dd className="text-3xl font-extrabold tabular-nums">
            {Math.round(session.kcal)}
            <span className="text-muted-foreground ml-1 text-sm">kcal</span>
          </dd>
          <dd className="text-muted-foreground text-xs">
            1日の目標 {Math.round(target)}kcal の {ratio}%
          </dd>
        </div>
        <div className="bg-card flex flex-col gap-1 rounded-2xl border p-4">
          <dt className="text-muted-foreground text-xs font-bold">連続</dt>
          <dd className="flex items-baseline gap-1 text-3xl font-extrabold tabular-nums">
            <Flame className="size-6 self-center text-orange-500" />
            {streak}
            <span className="text-muted-foreground text-sm">日</span>
          </dd>
          <dd className="text-muted-foreground text-xs">
            {session.completed ? "明日も20分" : "最後までやると連続に数えます"}
          </dd>
        </div>
      </dl>

      <section className="bg-card rounded-2xl border p-4">
        <WeightForm today={today} initialKg={latestKg} />
      </section>

      <Button size="xl" onClick={onHome} className="rounded-2xl">
        ホームへもどる
      </Button>
    </div>
  )
}
