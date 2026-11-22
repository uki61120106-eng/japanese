"use client"

import { useState } from "react"

import {
  GOAL_DAYS,
  addDays,
  dateKey,
  daysBetween,
  formatDateJa,
  formatKg,
  parseDateKey,
  plannedWeight,
  sortedWeights,
} from "@/lib/workout/goal"
import type { Goal, WeightLog } from "@/lib/workout/storage"

type WeightChartProps = {
  goal: Goal
  weights: WeightLog[]
  today: Date
}

const WIDTH = 340
const HEIGHT = 200
const PAD = { top: 16, right: 16, bottom: 28, left: 40 }

/** 1年分の横軸に、目標の直線（点線）と記録した体重（実線）を重ねる */
export function WeightChart({ goal, weights, today }: WeightChartProps) {
  const [hover, setHover] = useState<WeightLog | null>(null)

  const start = parseDateKey(goal.startDate)
  const points = sortedWeights(weights).filter(
    (w) => w.date >= goal.startDate
  )
  const target = goal.startWeight - goal.lossKg

  const values = [goal.startWeight, target, ...points.map((p) => p.kg)]
  const min = Math.floor(Math.min(...values) - 0.5)
  const max = Math.ceil(Math.max(...values) + 0.5)

  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const x = (day: number) => PAD.left + (day / GOAL_DAYS) * innerW
  const y = (kg: number) => PAD.top + ((max - kg) / (max - min)) * innerH
  const dayOf = (key: string) =>
    Math.min(Math.max(daysBetween(start, parseDateKey(key)), 0), GOAL_DAYS)

  // 縦軸の目盛りは 1kg 刻み（範囲が広ければ間引く）
  const step = Math.max(1, Math.ceil((max - min) / 5))
  const ticks: number[] = []
  for (let kg = min; kg <= max; kg += step) ticks.push(kg)

  // 横軸は3か月ごと
  const months = [0, 3, 6, 9, 12].map((m) => {
    const date = new Date(start)
    date.setMonth(date.getMonth() + m)
    return { day: Math.min(daysBetween(start, date), GOAL_DAYS), label: m === 0 ? "開始" : `${m}か月` }
  })

  const todayDay = daysBetween(start, today)
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(dayOf(p.date))},${y(p.kg)}`)
    .join(" ")
  const last = points.at(-1)
  const shown = hover ?? last

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="font-bold">体重の推移</span>
        {shown ? (
          <span className="text-muted-foreground flex gap-2 tabular-nums">
            <span>{formatDateJa(shown.date)}</span>
            <b className="text-foreground">{formatKg(shown.kg)} kg</b>
            <span>
              （目標ライン {formatKg(plannedWeight(goal, parseDateKey(shown.date)))} kg）
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">記録するとここに線が引かれます</span>
        )}
      </figcaption>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full max-w-full"
        role="img"
        aria-label={`開始 ${formatKg(goal.startWeight)}kg から 1年後 ${formatKg(target)}kg までの目標ラインと、記録した体重`}
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((kg) => (
          <g key={kg}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(kg)}
              y2={y(kg)}
              className="stroke-border"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 6}
              y={y(kg)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px] tabular-nums"
            >
              {kg}
            </text>
          </g>
        ))}
        {months.map((m) => (
          <text
            key={m.label}
            x={x(m.day)}
            y={HEIGHT - 8}
            textAnchor={m.day === 0 ? "start" : m.day === GOAL_DAYS ? "end" : "middle"}
            className="fill-muted-foreground text-[10px]"
          >
            {m.label}
          </text>
        ))}

        {todayDay >= 0 && todayDay <= GOAL_DAYS && (
          <line
            x1={x(todayDay)}
            x2={x(todayDay)}
            y1={PAD.top}
            y2={HEIGHT - PAD.bottom}
            className="stroke-muted-foreground/40"
            strokeDasharray="2 3"
            strokeWidth="1"
          />
        )}

        {/* 目標ライン */}
        <line
          x1={x(0)}
          y1={y(goal.startWeight)}
          x2={x(GOAL_DAYS)}
          y2={y(target)}
          className="stroke-muted-foreground"
          strokeDasharray="5 4"
          strokeWidth="1.5"
        />
        <text
          x={x(GOAL_DAYS)}
          y={y(target) + 14}
          textAnchor="end"
          className="fill-muted-foreground text-[10px] font-bold"
        >
          目標 {formatKg(target)}kg
        </text>

        {points.length > 1 && (
          <path
            d={line}
            fill="none"
            className="stroke-orange-500"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {points.map((p) => (
          <g key={p.date}>
            <circle
              cx={x(dayOf(p.date))}
              cy={y(p.kg)}
              r={p === shown ? 5 : 3.5}
              className="fill-orange-500 stroke-card"
              strokeWidth="2"
            />
            {/* 指で触りやすいように当たり判定を大きく取る */}
            <circle
              cx={x(dayOf(p.date))}
              cy={y(p.kg)}
              r="12"
              fill="transparent"
              onMouseEnter={() => setHover(p)}
              onClick={() => setHover(p)}
            />
          </g>
        ))}
      </svg>
      <p className="text-muted-foreground text-xs">
        点線＝1年で{goal.lossKg}kg減らす目標ライン（{formatDateJa(goal.startDate)} 開始 →{" "}
        {formatDateJa(dateKey(addDays(start, GOAL_DAYS)))}）。
        オレンジ＝記録した体重。点を押すと値が出ます。
      </p>
    </figure>
  )
}
