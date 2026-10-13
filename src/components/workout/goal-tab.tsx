"use client"

import { useState } from "react"
import { Target, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { WeightChart } from "@/components/workout/weight-chart"
import { WeightForm } from "@/components/workout/weight-form"
import {
  GOAL_DAYS,
  KCAL_PER_KG_FAT,
  addDays,
  dailyKcalTarget,
  dateKey,
  daysBetween,
  formatDateJa,
  formatKg,
  latestWeight,
  parseDateKey,
  plannedWeight,
  sortedWeights,
  totalKcal,
} from "@/lib/workout/goal"
import { updateWorkoutData, type WorkoutData } from "@/lib/workout/storage"
import { cn } from "@/lib/utils"

const LOSS_KG = 3

export function GoalTab({ data, today }: { data: WorkoutData; today: Date }) {
  if (!data.goal) return <GoalSetup today={today} initialKg={latestWeight(data.weights)?.kg} />
  return <GoalProgress data={data} today={today} />
}

function GoalSetup({ today, initialKg }: { today: Date; initialKg?: number }) {
  const [value, setValue] = useState(initialKg ? initialKg.toFixed(1) : "")
  const kg = Number(value)
  const valid = value !== "" && kg >= 20 && kg <= 300

  function start(event: React.FormEvent) {
    event.preventDefault()
    if (!valid) return
    const key = dateKey(today)
    const rounded = Math.round(kg * 10) / 10
    updateWorkoutData((current) => ({
      ...current,
      goal: { startDate: key, startWeight: rounded, lossKg: LOSS_KG },
      weights: [...current.weights.filter((w) => w.date !== key), { date: key, kg: rounded }],
    }))
  }

  return (
    <form onSubmit={start} className="bg-card flex flex-col gap-4 rounded-3xl border p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <Target className="size-8 text-orange-500" />
        <h2 className="text-xl font-extrabold">1年で{LOSS_KG}kg減らす</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          今の体重を入れると、1年後の目標と、毎月どこまで減っていればよいかの線を引きます。
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="start-weight" className="text-sm font-bold">
          今の体重
        </label>
        <div className="relative">
          <input
            id="start-weight"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="20"
            max="300"
            placeholder="65.0"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="border-input bg-background focus-visible:ring-ring/50 h-12 w-full rounded-xl border px-3 pr-10 text-xl font-bold tabular-nums outline-none focus-visible:ring-[3px]"
          />
          <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
            kg
          </span>
        </div>
        {valid && (
          <p className="text-sm">
            1年後の目標は <b className="tabular-nums">{formatKg(kg - LOSS_KG)} kg</b>
            （1か月あたり −{formatKg(LOSS_KG / 12)} kg のペース）
          </p>
        )}
      </div>
      <Button type="submit" size="xl" disabled={!valid} className="rounded-2xl">
        この目標で始める
      </Button>
    </form>
  )
}

function GoalProgress({ data, today }: { data: WorkoutData; today: Date }) {
  const goal = data.goal!
  const [confirmReset, setConfirmReset] = useState(false)

  const latest = latestWeight(data.weights.filter((w) => w.date >= goal.startDate))
  const current = latest?.kg ?? goal.startWeight
  const target = goal.startWeight - goal.lossKg
  const lost = goal.startWeight - current
  const progress = Math.min(Math.max(lost / goal.lossKg, 0), 1)
  const elapsed = Math.max(daysBetween(parseDateKey(goal.startDate), today), 0)
  const planned = latest ? plannedWeight(goal, parseDateKey(latest.date)) : goal.startWeight
  const diff = current - planned

  // 直近4週間の運動による消費の平均（推定）
  const since = dateKey(addDays(today, -27))
  const windowDays = Math.min(28, elapsed + 1)
  const avgKcal = totalKcal(data.sessions, since) / windowDays
  const needKcal = dailyKcalTarget(goal)

  const recentWeights = sortedWeights(data.weights).reverse().slice(0, 8)

  return (
    <div className="flex flex-col gap-5">
      <section className="bg-card flex flex-col gap-4 rounded-3xl border p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">1年で{goal.lossKg}kg減</h2>
          <span className="text-muted-foreground text-xs tabular-nums">
            {Math.min(elapsed, GOAL_DAYS)}日目 / {GOAL_DAYS}日
          </span>
        </div>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "開始", value: goal.startWeight },
            { label: "いま", value: current },
            { label: "1年後の目標", value: target },
          ].map((item) => (
            <div key={item.label} className="bg-muted rounded-2xl px-2 py-2.5">
              <dt className="text-muted-foreground text-[11px] font-bold">{item.label}</dt>
              <dd className="text-lg font-extrabold tabular-nums">
                {formatKg(item.value)}
                <span className="text-muted-foreground ml-0.5 text-xs font-bold">kg</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-bold tabular-nums">
              {lost >= 0 ? `−${formatKg(lost)}` : `+${formatKg(-lost)}`} kg
            </span>
            <span className="text-muted-foreground tabular-nums">
              達成率 {Math.round(progress * 100)}%
            </span>
          </div>
          <Progress value={progress * 100} className="bg-muted h-3" indicatorClassName="bg-orange-500" />
        </div>

        {latest && (
          <p
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-bold",
              diff <= 0.05
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                : "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
            )}
          >
            {diff <= 0.05
              ? `目標ラインより ${formatKg(Math.abs(diff))} kg 先行しています`
              : `目標ラインまであと ${formatKg(diff)} kg`}
            <span className="ml-1 font-normal opacity-80">
              （{formatDateJa(latest.date)} の記録で比較）
            </span>
          </p>
        )}

        <WeightChart goal={goal} weights={data.weights} today={today} />
      </section>

      <section className="bg-card rounded-2xl border p-4">
        <WeightForm today={today} initialKg={latest?.kg} />
        <p className="text-muted-foreground mt-2 text-xs">
          体重は1日の中でも1kg前後動きます。朝起きてトイレのあと、など同じ条件で量るとぶれが減ります。
        </p>
      </section>

      <section className="bg-card flex flex-col gap-3 rounded-2xl border p-4 text-sm leading-relaxed">
        <h3 className="font-bold">目標の計算</h3>
        <dl className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">体脂肪1kgのエネルギー（一般的な目安）</dt>
            <dd className="shrink-0 font-bold tabular-nums">{KCAL_PER_KG_FAT.toLocaleString()} kcal</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{goal.lossKg}kg分</dt>
            <dd className="shrink-0 font-bold tabular-nums">
              {(goal.lossKg * KCAL_PER_KG_FAT).toLocaleString()} kcal
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">1年で割ると、1日あたり</dt>
            <dd className="shrink-0 font-bold tabular-nums">約 {Math.round(needKcal)} kcal</dd>
          </div>
          <div className="flex justify-between gap-3 border-t pt-1.5">
            <dt className="text-muted-foreground">あなたの運動の平均（直近4週・推定）</dt>
            <dd className="shrink-0 font-bold tabular-nums">約 {Math.round(avgKcal)} kcal/日</dd>
          </div>
        </dl>
        <p className="text-muted-foreground text-xs">
          消費カロリーは種目の強さと体重から出した推定値です。実際は個人差が大きく、運動した日は
          食欲が増えて食べる量が増えることもあります。数字が足りていても体重が減らないときは、
          間食や飲み物を1日 {Math.max(Math.round(needKcal - avgKcal), 50)} kcal ほど減らすと届きやすくなります。
        </p>
      </section>

      {recentWeights.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-bold">体重の記録</h3>
          <ul className="bg-card flex flex-col divide-y rounded-2xl border">
            {recentWeights.map((w) => (
              <li key={w.date} className="flex items-center gap-3 px-4 py-2">
                <span className="w-12 text-sm tabular-nums">{formatDateJa(w.date)}</span>
                <span className="flex-1 text-sm font-bold tabular-nums">{formatKg(w.kg)} kg</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`${formatDateJa(w.date)} の記録を消す`}
                  onClick={() =>
                    updateWorkoutData((current) => ({
                      ...current,
                      weights: current.weights.filter((x) => x.date !== w.date),
                    }))
                  }
                >
                  <Trash2 className="text-muted-foreground" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col items-center gap-2">
        {confirmReset ? (
          <div className="bg-card flex w-full flex-col gap-2 rounded-2xl border p-4 text-sm">
            <p>目標を作り直します。体重とトレーニングの記録は残ります。</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmReset(false)}>
                やめる
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => updateWorkoutData((current) => ({ ...current, goal: null }))}
              >
                作り直す
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setConfirmReset(true)}>
            目標を作り直す
          </Button>
        )}
      </div>
    </div>
  )
}
