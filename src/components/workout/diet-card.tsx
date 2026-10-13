"use client"

import { Check, Utensils } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { DIET_ITEMS, dietKcal, type DietId } from "@/lib/workout/diet"
import { dailyKcalTarget, dateKey } from "@/lib/workout/goal"
import { updateWorkoutData, type WorkoutData } from "@/lib/workout/storage"
import { cn } from "@/lib/utils"

/** 今日の「運動 + 食事の工夫」が1日の目標に届いているかを見せ、工夫をワンタップで記録する */
export function DietCard({ data, today }: { data: WorkoutData; today: Date }) {
  const key = dateKey(today)
  const selected = data.diet[key] ?? []
  const workout = data.sessions
    .filter((session) => session.date === key)
    .reduce((sum, session) => sum + session.kcal, 0)
  const diet = dietKcal(selected)
  const target = dailyKcalTarget(data.goal ?? { lossKg: 3 })
  const total = workout + diet
  const reached = total >= target

  function toggle(id: DietId) {
    updateWorkoutData((current) => {
      const list = current.diet[key] ?? []
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
      const diet = { ...current.diet, [key]: next }
      if (next.length === 0) delete diet[key]
      return { ...current, diet }
    })
  }

  return (
    <section className="bg-card flex flex-col gap-4 rounded-3xl border p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="flex items-center gap-1.5 font-extrabold">
            <Utensils className="size-4 text-orange-500" />
            今日の食事の工夫
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            運動だけでは少し足りない分を、食事で減らした分と合わせて見ます
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-bold tabular-nums">
            {Math.round(total)}
            <span className="text-muted-foreground font-normal"> / {Math.round(target)} kcal</span>
          </span>
          <span
            className={cn(
              "text-xs font-bold",
              reached ? "text-emerald-600 dark:text-emerald-300" : "text-muted-foreground"
            )}
          >
            {reached ? "今日の目標に届きました" : `あと ${Math.ceil(target - total)} kcal`}
          </span>
        </div>
        <Progress
          value={Math.min(total / target, 1) * 100}
          className="bg-muted h-2.5"
          indicatorClassName={reached ? "bg-emerald-500" : "bg-orange-500"}
        />
        <p className="text-muted-foreground text-xs tabular-nums">
          運動 {Math.round(workout)} kcal ＋ 食事 {diet} kcal（どちらも目安）
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DIET_ITEMS.map((item) => {
          const on = selected.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(item.id)}
              className={cn(
                "focus-visible:ring-ring/50 flex min-w-0 flex-col items-start gap-0.5 rounded-2xl border px-3 py-2.5 text-left transition-colors outline-none focus-visible:ring-[3px]",
                on
                  ? "border-orange-400 bg-orange-50 dark:border-orange-500 dark:bg-orange-950/40"
                  : "bg-card hover:bg-accent"
              )}
            >
              <span className="flex w-full items-start justify-between gap-1">
                <span className="text-sm leading-snug font-bold">{item.label}</span>
                {on && <Check className="mt-0.5 size-4 shrink-0 text-orange-500" />}
              </span>
              <span className="text-muted-foreground text-[11px] tabular-nums">
                約{item.kcal}kcal・{item.basis}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
