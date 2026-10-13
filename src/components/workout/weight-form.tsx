"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { dateKey } from "@/lib/workout/goal"
import { updateWorkoutData } from "@/lib/workout/storage"

/** 体重の入力。同じ日に2回入れたら上書きする。 */
export function WeightForm({
  today,
  initialKg,
  onSaved,
}: {
  today: Date
  initialKg?: number
  onSaved?: (kg: number) => void
}) {
  const [value, setValue] = useState(initialKg ? initialKg.toFixed(1) : "")
  const [message, setMessage] = useState<string | null>(null)
  const kg = Number(value)
  const valid = value !== "" && kg >= 20 && kg <= 300

  function save(event: React.FormEvent) {
    event.preventDefault()
    if (!valid) {
      setMessage("20〜300 の数字で入れてください")
      return
    }
    const key = dateKey(today)
    const rounded = Math.round(kg * 10) / 10
    updateWorkoutData((data) => ({
      ...data,
      weights: [...data.weights.filter((w) => w.date !== key), { date: key, kg: rounded }],
    }))
    setMessage(`${rounded.toFixed(1)} kg で記録しました`)
    onSaved?.(rounded)
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-2">
      <label htmlFor="weight-today" className="text-sm font-bold">
        今日の体重
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id="weight-today"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="20"
            max="300"
            placeholder="60.0"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setMessage(null)
            }}
            className="border-input bg-background focus-visible:ring-ring/50 h-11 w-full rounded-xl border px-3 pr-10 text-lg font-bold tabular-nums outline-none focus-visible:ring-[3px]"
          />
          <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
            kg
          </span>
        </div>
        <Button type="submit" className="h-11 rounded-xl px-5">
          記録
        </Button>
      </div>
      {message && (
        <p className="text-muted-foreground text-xs" role="status">
          {message}
        </p>
      )}
    </form>
  )
}
