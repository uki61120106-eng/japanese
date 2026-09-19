"use client"

import Link from "next/link"
import { BookOpen, Play, RotateCcw, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PART5_CATEGORIES } from "@/lib/toeic/category"
import { REVIEW_LENGTH } from "@/lib/toeic/session"
import {
  dueCount,
  overallAccuracy,
  streakDays,
  studiedCount,
  totalItemCount,
  type StudyLog,
} from "@/lib/toeic/srs"
import type { Part5Category } from "@/lib/toeic/types"
import { cn } from "@/lib/utils"

export type StudyMode = "review" | "part5" | "part7"

export const PART5_LENGTHS = [10, 20, 30]
export const PART7_COUNTS = [1, 2, 3]

type ToeicHomeScreenProps = {
  log: StudyLog
  /** ログを読んだ時刻。復習期限の判定に使う */
  now: number
  /** localStorage の読み込みが済んでいるか。済むまで数値は伏せる */
  ready: boolean
  mode: StudyMode
  onModeChange: (mode: StudyMode) => void
  categories: Part5Category[]
  onCategoriesChange: (categories: Part5Category[]) => void
  part5Length: number
  onPart5LengthChange: (length: number) => void
  part7Count: number
  onPart7CountChange: (count: number) => void
  onStart: () => void
  onResetLog: () => void
}

export function ToeicHomeScreen({
  log,
  now,
  ready,
  mode,
  onModeChange,
  categories,
  onCategoriesChange,
  part5Length,
  onPart5LengthChange,
  part7Count,
  onPart7CountChange,
  onStart,
  onResetLog,
}: ToeicHomeScreenProps) {
  const selected = new Set(categories)
  const allSelected = categories.length === PART5_CATEGORIES.length

  const due = dueCount(log, now)
  const studied = studiedCount(log)
  const accuracy = overallAccuracy(log)
  const streak = streakDays(log, now)
  const total = totalItemCount()

  const canStart =
    mode === "review" ? due > 0 : mode === "part5" ? categories.length > 0 : true

  function toggleCategory(id: Part5Category) {
    onCategoriesChange(
      selected.has(id)
        ? categories.filter((category) => category !== id)
        : [...categories, id]
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <Badge className="gap-1.5 bg-linear-to-r from-indigo-600 to-sky-600 px-3 py-1 text-[0.7rem] tracking-widest">
          <Target className="size-3" />
          TARGET 700
        </Badge>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          TOEIC トレーナー
        </h1>
        <p className="text-muted-foreground text-sm">
          Part 5（短文穴埋め）と Part 7（読解）を、間隔をあけて繰り返す
        </p>
      </header>

      <Card className="gap-4 rounded-3xl border-2 shadow-sm">
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="今日の復習"
              value={ready ? `${due}` : "—"}
              unit="問"
              highlight={due > 0}
            />
            <Stat
              label="累計正答率"
              value={ready && accuracy !== null ? `${accuracy}` : "—"}
              unit="%"
            />
            <Stat
              label="学習した問題"
              value={ready ? `${studied}` : "—"}
              unit={`/ ${total}`}
            />
            <Stat
              label="連続学習"
              value={ready ? `${streak}` : "—"}
              unit="日"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Progress
              value={(studied / total) * 100}
              className="bg-muted h-2"
              indicatorClassName="bg-indigo-600 transition-all duration-300"
            />
            <p className="text-muted-foreground text-xs">
              収録は Part 5 が120問、Part 7 が10文書34問です。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-5 rounded-3xl border-2 shadow-sm">
        <CardContent className="flex flex-col gap-5">
          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              学習メニュー
            </Label>
            <Tabs
              value={mode}
              onValueChange={(value) => onModeChange(value as StudyMode)}
            >
              <TabsList className="h-11 w-full rounded-xl p-1">
                <TabsTrigger value="review" className="rounded-lg">
                  復習
                </TabsTrigger>
                <TabsTrigger value="part5" className="rounded-lg">
                  Part 5
                </TabsTrigger>
                <TabsTrigger value="part7" className="rounded-lg">
                  Part 7
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </section>

          {mode === "review" && (
            <section className="bg-muted/60 flex flex-col gap-2 rounded-2xl px-4 py-3">
              <p className="text-sm font-medium">
                {due > 0
                  ? `復習期限が来ている ${due} 問から、最大 ${REVIEW_LENGTH} 問を出題します。`
                  : "いま復習期限が来ている問題はありません。"}
              </p>
              <p className="text-muted-foreground text-xs">
                間違えた問題は当日中に、正解した問題は 1日 → 3日 → 7日 → 14日 → 30日 の順で
                間隔をあけて出題されます。
              </p>
            </section>
          )}

          {mode === "part5" && (
            <>
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-muted-foreground text-xs tracking-widest">
                    出題するカテゴリ
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() =>
                      onCategoriesChange(
                        allSelected
                          ? []
                          : PART5_CATEGORIES.map((category) => category.id)
                      )
                    }
                  >
                    {allSelected ? "すべて外す" : "すべて選ぶ"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PART5_CATEGORIES.map((category) => {
                    const isOn = selected.has(category.id)
                    return (
                      <button
                        key={category.id}
                        type="button"
                        role="checkbox"
                        aria-checked={isOn}
                        onClick={() => toggleCategory(category.id)}
                        className={cn(
                          "focus-visible:ring-ring/60 flex flex-col gap-0.5 rounded-2xl border-2 px-3 py-2.5 text-left transition-all outline-none focus-visible:ring-4",
                          isOn ? category.chipActive : category.chip
                        )}
                      >
                        <span className="text-sm font-bold">
                          {category.label}
                        </span>
                        <span
                          className={cn(
                            "text-[0.65rem] leading-tight",
                            isOn ? "text-white/80" : "opacity-70"
                          )}
                        >
                          {category.hint}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>

              <LengthPicker
                label="1セットの問題数"
                options={PART5_LENGTHS}
                value={part5Length}
                onChange={onPart5LengthChange}
                unit="問"
              />
            </>
          )}

          {mode === "part7" && (
            <>
              <LengthPicker
                label="1セットの文書数"
                options={PART7_COUNTS}
                value={part7Count}
                onChange={onPart7CountChange}
                unit="文書"
              />
              <p className="text-muted-foreground text-xs">
                1文書につき設問が3〜4問つきます。復習期限が来ている設問や
                未学習の設問を多く含む文書から順に選ばれます。
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button
          size="xl"
          disabled={!canStart}
          onClick={onStart}
          className="w-full gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-sky-600 text-lg font-bold shadow-lg hover:from-indigo-600/90 hover:to-sky-600/90"
        >
          <Play className="size-5" />
          スタート
        </Button>
        {!canStart && (
          <p className="text-muted-foreground text-sm">
            {mode === "review"
              ? "復習できる問題がたまるまで、Part 5 か Part 7 を解いてください"
              : "カテゴリをひとつ以上えらんでください"}
          </p>
        )}
      </div>

      <Card className="rounded-3xl border-2 border-dashed shadow-none">
        <CardContent className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Target className="size-4 text-indigo-600 dark:text-indigo-400" />
            700点をねらうときの目安
          </h2>
          <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-xs leading-relaxed">
            <li>Part 5 は 1問 20秒以内、正答率 75〜80% を安定して出せる状態を目標にする</li>
            <li>Part 7 は 1設問 60秒以内。読み切れないより、解き切れないほうが失点が大きい</li>
            <li>間違えた問題は、解説を読んで終わりにせず、日をあけてもう一度解く</li>
          </ul>
          <p className="text-muted-foreground/80 text-[0.65rem] leading-relaxed">
            ※ ここに書いた数値は一般的な学習目標としての目安で、公式のスコア換算では
            ありません。実際のスコアは公式問題集や公開テストで確認してください。
          </p>
        </CardContent>
      </Card>

      <footer className="flex items-center justify-between gap-3 pb-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs underline-offset-4 hover:underline"
        >
          <BookOpen className="size-3.5" />
          かなフラッシュへ
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetLog}
          className="text-muted-foreground h-7 gap-1.5 text-xs"
        >
          <RotateCcw className="size-3.5" />
          学習記録を消す
        </Button>
      </footer>
    </div>
  )
}

function Stat({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string
  value: string
  unit: string
  highlight?: boolean
}) {
  return (
    <div className="bg-muted/60 flex flex-col gap-0.5 rounded-2xl px-3 py-2.5">
      <span className="text-muted-foreground text-[0.65rem] tracking-wider">
        {label}
      </span>
      <span className="flex items-baseline gap-1">
        <span
          className={cn(
            "text-2xl font-black tabular-nums",
            highlight && "text-indigo-600 dark:text-indigo-400"
          )}
        >
          {value}
        </span>
        <span className="text-muted-foreground text-[0.65rem]">{unit}</span>
      </span>
    </div>
  )
}

function LengthPicker({
  label,
  options,
  value,
  onChange,
  unit,
}: {
  label: string
  options: number[]
  value: number
  onChange: (value: number) => void
  unit: string
}) {
  return (
    <section className="flex flex-col gap-2">
      <Label className="text-muted-foreground text-xs tracking-widest">
        {label}
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className={cn(
              "focus-visible:ring-ring/60 rounded-xl border-2 py-2.5 text-sm font-bold transition-all outline-none focus-visible:ring-4",
              option === value
                ? "border-indigo-500 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-500"
                : "border-border bg-background hover:bg-muted"
            )}
          >
            {option} {unit}
          </button>
        ))}
      </div>
    </section>
  )
}

