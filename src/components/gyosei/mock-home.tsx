"use client"

import { Clock, Play, Trophy } from "lucide-react"

import { formatMinutes, ScreenTitle } from "@/components/gyosei/common"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatShort } from "@/lib/gyosei/dates"
import { PASS_LINE } from "@/lib/gyosei/exam"
import type { MockKind } from "@/lib/gyosei/mock"
import type { AppState } from "@/lib/gyosei/store"
import { cn } from "@/lib/utils"

export function MockHome({
  state,
  onStart,
  onResume,
}: {
  state: AppState
  onStart: (kind: MockKind) => void
  onResume: () => void
}) {
  const history = [...state.mocks].reverse()

  return (
    <div className="flex flex-col gap-5">
      <ScreenTitle
        title="模擬試験"
        description="一問一答の問題から、本試験と同じ5肢択一（「正しいもの／誤っているもの」）を毎回組み直して出題します。"
      />

      {state.draft && (
        <Card className="gap-3 rounded-3xl border-2 border-amber-400/60 py-4">
          <CardContent className="flex items-center justify-between gap-3 px-5">
            <span className="text-sm font-bold">
              中断中の模試があります（経過 {formatMinutes(state.draft.elapsedSec)}）
            </span>
            <Button size="sm" className="rounded-lg" onClick={onResume}>
              再開
            </Button>
          </CardContent>
        </Card>
      )}

      <MockCard
        title="ミニ模試"
        meta="5肢択一15問 ・ 30分"
        description="毎日の30分枠でそのまま受けられる。4週ごとの週末に受けて、得点を本試験の300点満点に換算して推移を見る。"
        disabled={state.draft !== null}
        onStart={() => onStart("mini")}
      />
      <MockCard
        title="本試験形式"
        meta="5肢択一54問・多肢選択3問・記述式3問 ・ 180分"
        description="本試験と同じ問題数・配点・合格基準で採点する。途中で中断して、翌日以降に続きから再開できる（30分×6日に分けて受けてもよい）。"
        disabled={state.draft !== null}
        onStart={() => onStart("full")}
      />

      <p className="text-muted-foreground text-xs leading-relaxed">
        合格基準：法令等 {PASS_LINE.law}点以上（{PASS_LINE.lawMax}点中）、基礎知識{" "}
        {PASS_LINE.general}点以上（{PASS_LINE.generalMax}点中）、合計{" "}
        {PASS_LINE.total}点以上（{PASS_LINE.totalMax}点中）の3つをすべて満たすこと。
      </p>

      {history.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="flex items-center gap-1.5 text-sm font-bold">
            <Trophy className="size-4" />
            受験履歴
          </h2>
          <div className="bg-card flex flex-col divide-y rounded-2xl border">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
              >
                <span className="flex flex-col">
                  <span className="font-medium">
                    {formatShort(record.date)}{" "}
                    {record.kind === "full" ? "本試験形式" : "ミニ模試"}
                  </span>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    法令 {record.law}/{record.lawMax} ・ 基礎知識 {record.general}/
                    {record.generalMax}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-extrabold tabular-nums",
                    record.passed ? "text-emerald-600" : "text-rose-600"
                  )}
                >
                  {record.scaledTotal}点
                  <span className="ml-1 text-xs">
                    {record.passed ? "合格圏" : "不足"}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            ミニ模試の点数は正答率からの換算値で、目安です。
          </p>
        </section>
      )}
    </div>
  )
}

function MockCard({
  title,
  meta,
  description,
  disabled,
  onStart,
}: {
  title: string
  meta: string
  description: string
  disabled: boolean
  onStart: () => void
}) {
  return (
    <Card className="gap-3 rounded-3xl py-5">
      <CardContent className="flex flex-col gap-3 px-5">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="size-3.5" />
            {meta}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{description}</p>
        <Button className="rounded-xl" disabled={disabled} onClick={onStart}>
          <Play />
          はじめる
        </Button>
      </CardContent>
    </Card>
  )
}
