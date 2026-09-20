"use client"

import Link from "next/link"
import { BookOpen, Play, RotateCcw, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LEVEL_SHORT,
  PART5_CATEGORIES,
  PHRASE_CATEGORIES,
} from "@/lib/toeic/category"
import { CONTENT_COUNTS } from "@/lib/toeic/content"
import { REVIEW_LENGTH } from "@/lib/toeic/session"
import {
  dueCount,
  overallAccuracy,
  streakDays,
  studiedCount,
  totalItemCount,
  type StudyLog,
} from "@/lib/toeic/srs"
import type { Level, Part5Category, PhraseCategory } from "@/lib/toeic/types"
import { cn } from "@/lib/utils"

export type StudyMode = "review" | "phrase" | "part5" | "part7"

export const PART5_LENGTHS = [10, 20, 30]
export const PART7_COUNTS = [1, 2, 3]
export const PHRASE_LENGTHS = [20, 30, 50]
export const LEVELS: Level[] = ["core", "advanced"]

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
  levels: Level[]
  onLevelsChange: (levels: Level[]) => void
  part5Length: number
  onPart5LengthChange: (length: number) => void
  part7Count: number
  onPart7CountChange: (count: number) => void
  phraseCategories: PhraseCategory[]
  onPhraseCategoriesChange: (categories: PhraseCategory[]) => void
  phraseLength: number
  onPhraseLengthChange: (length: number) => void
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
  levels,
  onLevelsChange,
  part5Length,
  onPart5LengthChange,
  part7Count,
  onPart7CountChange,
  phraseCategories,
  onPhraseCategoriesChange,
  phraseLength,
  onPhraseLengthChange,
  onStart,
  onResetLog,
}: ToeicHomeScreenProps) {
  const selectedCategories = new Set(categories)
  const selectedPhrase = new Set(phraseCategories)
  const selectedLevels = new Set(levels)

  const allCategories = categories.length === PART5_CATEGORIES.length
  const allPhrase = phraseCategories.length === PHRASE_CATEGORIES.length

  const due = dueCount(log, now)
  const studied = studiedCount(log)
  const accuracy = overallAccuracy(log)
  const streak = streakDays(log, now)
  const total = totalItemCount()

  const canStart =
    mode === "review"
      ? due > 0
      : mode === "phrase"
        ? phraseCategories.length > 0
        : mode === "part5"
          ? categories.length > 0 && levels.length > 0
          : levels.length > 0

  function toggleLevel(level: Level) {
    onLevelsChange(
      selectedLevels.has(level)
        ? levels.filter((value) => value !== level)
        : [...levels, level]
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <Badge className="gap-1.5 bg-linear-to-r from-indigo-600 to-sky-600 px-3 py-1 text-[0.7rem] tracking-widest">
          <Target className="size-3" />
          TARGET 800
        </Badge>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          TOEIC トレーナー
        </h1>
        <p className="text-muted-foreground text-sm">
          フレーズ・Part 5・Part 7 を、間隔をあけて繰り返す
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
            <Stat label="連続学習" value={ready ? `${streak}` : "—"} unit="日" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Progress
              value={(studied / total) * 100}
              className="bg-muted h-2"
              indicatorClassName="bg-indigo-600 transition-all duration-300"
            />
            <p className="text-muted-foreground text-xs">
              収録はフレーズ {CONTENT_COUNTS.phrases} 枚、Part 5 が
              {CONTENT_COUNTS.part5} 問、Part 7 が {CONTENT_COUNTS.part7Sets}
              セット {CONTENT_COUNTS.part7Questions} 問です。
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
                <TabsTrigger value="review" className="rounded-lg text-xs">
                  復習
                </TabsTrigger>
                <TabsTrigger value="phrase" className="rounded-lg text-xs">
                  フレーズ
                </TabsTrigger>
                <TabsTrigger value="part5" className="rounded-lg text-xs">
                  Part 5
                </TabsTrigger>
                <TabsTrigger value="part7" className="rounded-lg text-xs">
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
                フレーズ・Part 5・Part 7 の区別なく、期限の古いものから出ます。
                間違えた問題は当日中に、正解した問題は 1日 → 3日 → 7日 → 14日 → 30日 の順で
                間隔をあけて出題されます。
              </p>
            </section>
          )}

          {mode === "phrase" && (
            <>
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-muted-foreground text-xs tracking-widest">
                    出題する分類
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() =>
                      onPhraseCategoriesChange(
                        allPhrase
                          ? []
                          : PHRASE_CATEGORIES.map((category) => category.id)
                      )
                    }
                  >
                    {allPhrase ? "すべて外す" : "すべて選ぶ"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PHRASE_CATEGORIES.map((category) => {
                    const isOn = selectedPhrase.has(category.id)
                    return (
                      <button
                        key={category.id}
                        type="button"
                        role="checkbox"
                        aria-checked={isOn}
                        onClick={() =>
                          onPhraseCategoriesChange(
                            isOn
                              ? phraseCategories.filter(
                                  (value) => value !== category.id
                                )
                              : [...phraseCategories, category.id]
                          )
                        }
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
                            "font-english text-[0.65rem] leading-tight",
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
                label="1セットの枚数"
                options={PHRASE_LENGTHS}
                value={phraseLength}
                onChange={onPhraseLengthChange}
                unit="枚"
              />
            </>
          )}

          {(mode === "part5" || mode === "part7") && (
            <section className="flex flex-col gap-2">
              <Label className="text-muted-foreground text-xs tracking-widest">
                難易度
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map((level) => {
                  const isOn = selectedLevels.has(level)
                  return (
                    <button
                      key={level}
                      type="button"
                      role="checkbox"
                      aria-checked={isOn}
                      onClick={() => toggleLevel(level)}
                      className={cn(
                        "focus-visible:ring-ring/60 rounded-xl border-2 py-2.5 text-sm font-bold transition-all outline-none focus-visible:ring-4",
                        isOn
                          ? "border-indigo-500 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-500"
                          : "border-border bg-background hover:bg-muted"
                      )}
                    >
                      {LEVEL_SHORT[level]}
                      <span
                        className={cn(
                          "ml-1.5 text-[0.65rem] font-normal",
                          isOn ? "text-white/75" : "text-muted-foreground"
                        )}
                      >
                        {level === "core" ? "600〜730" : "730〜860"}
                      </span>
                    </button>
                  )
                })}
              </div>
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
                        allCategories
                          ? []
                          : PART5_CATEGORIES.map((category) => category.id)
                      )
                    }
                  >
                    {allCategories ? "すべて外す" : "すべて選ぶ"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PART5_CATEGORIES.map((category) => {
                    const isOn = selectedCategories.has(category.id)
                    return (
                      <button
                        key={category.id}
                        type="button"
                        role="checkbox"
                        aria-checked={isOn}
                        onClick={() =>
                          onCategoriesChange(
                            isOn
                              ? categories.filter(
                                  (value) => value !== category.id
                                )
                              : [...categories, category.id]
                          )
                        }
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
                unit="セット"
              />
              <p className="text-muted-foreground text-xs">
                1セットにつき設問が3〜5問つきます。応用には、2通の文書を
                突き合わせて解くマルチプルパッセージが含まれます。
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
              ? "復習できる問題がたまるまで、ほかのメニューを解いてください"
              : mode === "part7"
                ? "難易度をひとつ以上えらんでください"
                : "えらんでいない項目があります"}
          </p>
        )}
      </div>

      <Card className="rounded-3xl border-2 border-dashed shadow-none">
        <CardContent className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Target className="size-4 text-indigo-600 dark:text-indigo-400" />
            800点をねらうときの目安
          </h2>
          <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-xs leading-relaxed">
            <li>
              Part 5 は 1問 20秒以内。基礎で 90%、応用で 75% を安定して出せる状態を目標にする
            </li>
            <li>
              Part 7 は 1設問 60秒以内。マルチプルパッセージは、2通目を読む前に
              1通目の日付・金額・条件を押さえておく
            </li>
            <li>
              フレーズは「見て意味が出る」で止めず、例文ごと口に出して使える形で覚える
            </li>
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
