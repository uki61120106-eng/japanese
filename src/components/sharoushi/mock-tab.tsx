"use client"

import { ClipboardList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/sharoushi/dates"
import {
  MOCK_GROUP_MIN_RATE,
  MOCK_MINUTES_PER_QUESTION,
  MOCK_PASS_RATE,
  MOCK_PER_GROUP,
} from "@/lib/sharoushi/mock"
import type { StudyData } from "@/lib/sharoushi/store"
import { EXAM_GROUPS } from "@/lib/sharoushi/subjects"

type MockTabProps = {
  data: StudyData
  onStart: () => void
}

export function MockTab({ data, onStart }: MockTabProps) {
  const count = EXAM_GROUPS.length * MOCK_PER_GROUP
  const history = [...data.mocks].reverse()

  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-4 rounded-3xl border-2 py-5 shadow-lg">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold">ミニ模試（択一式）</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              本試験の7科目区分から各{MOCK_PER_GROUP}問、計{count}問。
              5つの記述から誤っているものを1つ選びます。
              制限時間は本試験と同じ1問{MOCK_MINUTES_PER_QUESTION}分（{count * MOCK_MINUTES_PER_QUESTION}分）。
            </p>
          </div>
          <ul className="text-muted-foreground list-disc pl-5 text-xs leading-relaxed">
            <li>合格の目安: 総得点{MOCK_PASS_RATE * 100}%以上、かつ各科目区分{MOCK_GROUP_MIN_RATE * 100}%以上</li>
            <li>本試験の合格基準は年度ごとに補正されます。目安として使ってください</li>
            <li>間違えた問題の記述は、振り返りの復習に自動で入ります</li>
          </ul>
          <Button
            size="xl"
            onClick={onStart}
            className="w-full gap-2 rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-600/90"
          >
            <ClipboardList className="size-5" />
            模試を始める
          </Button>
        </CardContent>
      </Card>

      <Card className="gap-3 rounded-2xl py-4">
        <CardContent className="flex flex-col gap-2">
          <h2 className="text-sm font-bold">受験の記録</h2>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">まだ受けていません。</p>
          ) : (
            <ul className="flex flex-col divide-y">
              {history.map((m, i) => (
                <li key={i} className="flex items-center justify-between py-2 text-sm">
                  <span>{formatDate(m.date)}</span>
                  <span className="tabular-nums">
                    <span className="font-bold">{m.correct}</span> / {m.total}問
                    <span className="text-muted-foreground ml-2 text-xs">
                      {Math.round(m.seconds / 60)}分
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
