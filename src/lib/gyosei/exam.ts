import { addDays, diffDays, toISODate } from "@/lib/gyosei/dates"
import type { SubjectId } from "@/lib/gyosei/types"

/**
 * 行政書士試験の出題構成と合格基準（令和6年度以降の試験）。
 * 法令等は 5肢択一 40問・多肢選択 3問・記述式 3問、基礎知識は 5肢択一 14問。
 */
export const EXAM_SECTIONS: {
  subject: SubjectId
  name: string
  choice5: number
  tashi: number
  kijutsu: number
}[] = [
  { subject: "kiso", name: "基礎法学", choice5: 2, tashi: 0, kijutsu: 0 },
  { subject: "kenpo", name: "憲法", choice5: 5, tashi: 1, kijutsu: 0 },
  { subject: "gyosei", name: "行政法", choice5: 19, tashi: 2, kijutsu: 1 },
  { subject: "minpo", name: "民法", choice5: 9, tashi: 0, kijutsu: 2 },
  { subject: "shoho", name: "商法・会社法", choice5: 5, tashi: 0, kijutsu: 0 },
  { subject: "chishiki", name: "基礎知識", choice5: 14, tashi: 0, kijutsu: 0 },
]

export const POINTS = { choice5: 4, tashiBlank: 2, kijutsu: 20 } as const

export const PASS_LINE = {
  /** 法令等科目 244点中 */
  law: 122,
  lawMax: 244,
  /** 基礎知識 56点中 */
  general: 24,
  generalMax: 56,
  /** 合計 300点中 */
  total: 180,
  totalMax: 300,
} as const

export const EXAM_MINUTES = 180

/** 試験は例年 11月の第2日曜日に行われる。 */
export function examDateOf(year: number): string {
  const first = new Date(year, 10, 1)
  const offset = (7 - first.getDay()) % 7
  return toISODate(new Date(year, 10, 1 + offset + 7))
}

/**
 * 学習開始日から見た目標の試験日。
 * 準備期間が 300 日に満たない回は見送り、翌年の試験を目標にする。
 */
export function defaultExamDate(start: string): string {
  const year = Number(start.slice(0, 4))
  for (const candidate of [year, year + 1, year + 2]) {
    const date = examDateOf(candidate)
    if (diffDays(start, date) >= 300) return date
  }
  return addDays(start, 365)
}
