"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { formatDate, type DateKey } from "@/lib/sharoushi/dates"
import { PHASE_LABEL, type PlanBlock } from "@/lib/sharoushi/plan"
import { LAW_AS_OF, QUESTIONS } from "@/lib/sharoushi/questions"
import {
  resetStudyData,
  updateStudyData,
  type StudyData,
} from "@/lib/sharoushi/store"
import { cn } from "@/lib/utils"

type PlanTabProps = {
  data: StudyData
  today: DateKey
  plan: PlanBlock[]
}

const PHASE_COLOR = {
  input: "bg-teal-500",
  output: "bg-amber-500",
  final: "bg-indigo-500",
} as const

function shortDate(key: DateKey) {
  const [, m, d] = key.split("-").map(Number)
  return `${m}/${d}`
}

export function PlanTab({ data, today, plan }: PlanTabProps) {
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-3 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-3">
          <h2 className="text-sm font-bold">年間計画</h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {formatDate(data.startDate)} から {formatDate(data.examDate)} まで。
            毎日{data.dailyGoalMinutes}分を前提に、科目ごとのインプット → 横断演習 → 模試の順に進めます。
          </p>
          <ol className="flex flex-col">
            {plan.map((block) => {
              const isNow = block.start <= today && today <= block.end
              const isPast = block.end < today
              return (
                <li
                  key={block.start}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm",
                    isNow && "bg-teal-50 font-bold dark:bg-teal-950/50",
                    isPast && "text-muted-foreground"
                  )}
                >
                  <span className={cn("size-2.5 shrink-0 rounded-full", PHASE_COLOR[block.kind])} />
                  <span className="w-24 shrink-0 text-xs tabular-nums">
                    {shortDate(block.start)}〜{shortDate(block.end)}
                  </span>
                  <span className="flex-1">
                    {block.kind === "input" ? block.title : PHASE_LABEL[block.kind]}
                  </span>
                  {isNow && <span className="text-xs text-teal-700 dark:text-teal-300">いまここ</span>}
                </li>
              )
            })}
          </ol>
        </CardContent>
      </Card>

      <Card className="gap-3 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-sm font-bold">設定</h2>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="exam-date" className="text-sm">本試験日</Label>
            <input
              id="exam-date"
              type="date"
              value={data.examDate}
              min={today}
              onChange={(e) => {
                const examDate = e.target.value
                if (examDate) updateStudyData((d) => ({ ...d, examDate }))
              }}
              className="border-input bg-background rounded-md border px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="start-date" className="text-sm">学習開始日</Label>
            <input
              id="start-date"
              type="date"
              value={data.startDate}
              max={data.examDate}
              onChange={(e) => {
                const startDate = e.target.value
                if (startDate) updateStudyData((d) => ({ ...d, startDate }))
              }}
              className="border-input bg-background rounded-md border px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="goal" className="text-sm">1日の目標</Label>
            <select
              id="goal"
              value={data.dailyGoalMinutes}
              onChange={(e) =>
                updateStudyData((d) => ({ ...d, dailyGoalMinutes: Number(e.target.value) }))
              }
              className="border-input bg-background rounded-md border px-2 py-1 text-sm"
            >
              {[15, 30, 45, 60].map((m) => (
                <option key={m} value={m}>{m}分</option>
              ))}
            </select>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            試験日の初期値は「例年8月第4日曜」からの推定です。
            試験案内（社会保険労務士試験オフィシャルサイト）で正式な日程を確認して直してください。
          </p>
          {confirmReset ? (
            <div className="flex flex-col gap-2 rounded-xl border-2 border-rose-300 p-3 text-sm dark:border-rose-800">
              <p>学習記録・模試の結果・確認状況をすべて消去します。元に戻せません。</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfirmReset(false)}>
                  やめる
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 text-white hover:bg-rose-600/90"
                  onClick={() => {
                    resetStudyData()
                    setConfirmReset(false)
                  }}
                >
                  消去する
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="self-start text-rose-600"
              onClick={() => setConfirmReset(true)}
            >
              学習記録を消去する
            </Button>
          )}
        </CardContent>
      </Card>

      <p className="text-muted-foreground px-1 text-xs leading-relaxed">
        収録 {QUESTIONS.length}問（{LAW_AS_OF}時点の法令を前提に作成）。
        法改正や数値の改定があるため、学習の際は最新の法令・テキストで必ず確認してください。
        学習記録はこの端末のブラウザ内にのみ保存されます。
      </p>
    </div>
  )
}
