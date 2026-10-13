"use client"

import { CircleCheck, Info } from "lucide-react"

import { ScreenTitle } from "@/components/gyosei/common"
import { Card, CardContent } from "@/components/ui/card"
import { topicName } from "@/lib/gyosei/content"
import { formatShort } from "@/lib/gyosei/dates"
import { EXAM_SECTIONS, PASS_LINE, POINTS } from "@/lib/gyosei/exam"
import type { DayInfo, Plan } from "@/lib/gyosei/plan"
import { cn } from "@/lib/utils"

export function PlanScreen({ plan, info }: { plan: Plan; info: DayInfo }) {
  return (
    <div className="flex flex-col gap-5">
      <ScreenTitle
        title="学習計画"
        description={`全${plan.totalWeeks}週。試験日までの期間に合わせて、各フェーズの週数を配点の比率で伸縮しています。`}
      />

      <ol className="flex flex-col gap-2">
        {plan.phases.map((phase, index) => {
          const current = info.phase?.id === phase.id
          const past =
            info.week >= phase.startWeek + phase.weeks && !current
          if (phase.weeks === 0) {
            return (
              <li
                key={phase.id}
                className="text-muted-foreground rounded-2xl border border-dashed p-3 text-xs"
              >
                {phase.name}：期間が短いため省略（総復習で扱います）
              </li>
            )
          }
          return (
            <li key={phase.id}>
              <Card
                className={cn(
                  "gap-2 rounded-2xl py-3",
                  current && "border-primary border-2 shadow-md",
                  past && "opacity-70"
                )}
              >
                <CardContent className="flex flex-col gap-1.5 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-extrabold">
                      {past ? (
                        <CircleCheck className="size-4 text-emerald-600" />
                      ) : (
                        <span className="text-muted-foreground text-xs tabular-nums">
                          {index + 1}
                        </span>
                      )}
                      {phase.name}
                    </span>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                      {formatShort(phase.startDate)}〜{formatShort(phase.endDate)}・
                      {phase.weeks}週
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">目標：{phase.goal}</p>
                  {phase.topics.length > 0 && (
                    <p className="text-xs leading-relaxed">
                      {phase.topics
                        .map((ref) => topicName(ref.subject, ref.topic))
                        .join(" → ")}
                    </p>
                  )}
                  {phase.mode === "review" && (
                    <p className="text-xs leading-relaxed">
                      未出題の問題を配点の大きい科目から消化し、毎日1問の記述式で答案を書く練習をする。
                    </p>
                  )}
                  {phase.mode === "final" && (
                    <p className="text-xs leading-relaxed">
                      平日は復習＋ミニ模試、週末は本試験形式の模試（分割受験可）で時間配分を固める。
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ol>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">1日30分の使い方</h2>
        <div className="bg-card flex flex-col divide-y rounded-2xl border text-sm">
          <Row label="要点を読む" value="5分" />
          <Row label="新しい問題（10問）" value="約8分" />
          <Row label="復習（最大20問）" value="約15分" />
          <Row label="記述式（該当日のみ）" value="約8分" />
          <Row label="7日目：理解度チェック（15問）" value="約12分＋復習" />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">試験の構成（配点）</h2>
        <div className="bg-card overflow-hidden rounded-2xl border text-sm">
          <table className="w-full">
            <thead className="bg-muted/60 text-muted-foreground text-xs">
              <tr>
                <th className="px-3 py-2 text-left font-medium">科目</th>
                <th className="px-2 py-2 text-right font-medium">択一</th>
                <th className="px-2 py-2 text-right font-medium">多肢</th>
                <th className="px-2 py-2 text-right font-medium">記述</th>
                <th className="px-3 py-2 text-right font-medium">配点</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {EXAM_SECTIONS.map((section) => (
                <tr key={section.subject}>
                  <td className="px-3 py-2">{section.name}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{section.choice5}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{section.tashi}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{section.kijutsu}</td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums">
                    {section.choice5 * POINTS.choice5 +
                      section.tashi * POINTS.tashiBlank * 4 +
                      section.kijutsu * POINTS.kijutsu}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground flex gap-1.5 text-xs leading-relaxed">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          合格基準は法令等{PASS_LINE.law}点・基礎知識{PASS_LINE.general}点・合計
          {PASS_LINE.total}点以上。試験は例年11月の第2日曜日、13時〜16時。出題は試験年度の4月1日時点で施行されている法令が基準です。
        </p>
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <span>{label}</span>
      <span className="text-muted-foreground tabular-nums">{value}</span>
    </div>
  )
}
