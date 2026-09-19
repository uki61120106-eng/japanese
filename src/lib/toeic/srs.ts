import { PART5_QUESTIONS } from "@/lib/toeic/part5-questions"
import { PART7_PASSAGES } from "@/lib/toeic/part7-passages"
import type { Item, Part5Category } from "@/lib/toeic/types"

/** 1問ごとの学習記録 */
export type ItemRecord = {
  /** 習熟度の箱（0〜5）。大きいほど次の出題まで間隔が開く */
  box: number
  /** 次に出題してよくなる時刻（エポックミリ秒） */
  due: number
  /** 出題された回数 */
  seen: number
  /** 正解した回数 */
  correct: number
  /** 現在の連続正解数 */
  streak: number
  /** 最後に解答した時刻 */
  lastAnsweredAt: number
}

/** localStorage に入れる学習ログ全体 */
export type StudyLog = {
  version: 1
  records: Record<string, ItemRecord>
  /** 学習した日（YYYY-MM-DD）。連続学習日数の計算に使う */
  days: string[]
  totals: { answered: number; correct: number }
}

export const EMPTY_LOG: StudyLog = {
  version: 1,
  records: {},
  days: [],
  totals: { answered: 0, correct: 0 },
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * 箱ごとの復習間隔（日）。
 * 箱0は「同じセッション中にもう一度」を意図して0日にしている。
 */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30]
export const MAX_BOX = BOX_INTERVAL_DAYS.length - 1

/** 全出題（Part 5 + Part 7）を1つの配列に並べる */
export function allItems(): Item[] {
  const part5: Item[] = PART5_QUESTIONS.map((question) => ({
    kind: "part5",
    id: question.id,
    question,
  }))

  const part7: Item[] = PART7_PASSAGES.flatMap((passage) =>
    passage.questions.map((question, index) => ({
      kind: "part7" as const,
      id: question.id,
      passage,
      question,
      indexInPassage: index + 1,
      questionCount: passage.questions.length,
    }))
  )

  return [...part5, ...part7]
}

const ALL_ITEMS = allItems()
const ITEM_BY_ID = new Map(ALL_ITEMS.map((item) => [item.id, item]))

export function itemById(id: string): Item | undefined {
  return ITEM_BY_ID.get(id)
}

export function totalItemCount(): number {
  return ALL_ITEMS.length
}

/** 未学習の問題は「今すぐ出題してよい」新品の記録として扱う */
export function recordFor(log: StudyLog, id: string): ItemRecord {
  return (
    log.records[id] ?? {
      box: 0,
      due: 0,
      seen: 0,
      correct: 0,
      streak: 0,
      lastAnsweredAt: 0,
    }
  )
}

/**
 * 1問の解答結果を記録に反映する。
 * 正解なら箱を1つ上げ、不正解なら箱0に戻して同じセッション内で再び出題対象にする。
 */
export function applyAnswer(
  record: ItemRecord,
  correct: boolean,
  now: number
): ItemRecord {
  const box = correct ? Math.min(record.box + 1, MAX_BOX) : 0
  return {
    box,
    due: now + BOX_INTERVAL_DAYS[box] * DAY_MS,
    seen: record.seen + 1,
    correct: record.correct + (correct ? 1 : 0),
    streak: correct ? record.streak + 1 : 0,
    lastAnsweredAt: now,
  }
}

/** ローカル時刻での YYYY-MM-DD */
export function dayKey(time: number): string {
  const d = new Date(time)
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

/** セッションの結果をログに書き戻した新しいログを返す（元のログは変更しない） */
export function mergeResults(
  log: StudyLog,
  results: { itemId: string; correct: boolean }[],
  now: number
): StudyLog {
  const records = { ...log.records }
  let correctCount = 0

  for (const result of results) {
    records[result.itemId] = applyAnswer(
      recordFor(log, result.itemId),
      result.correct,
      now
    )
    if (result.correct) correctCount += 1
  }

  const today = dayKey(now)
  const days = log.days.includes(today) ? log.days : [...log.days, today]

  return {
    version: 1,
    records,
    // 連続日数の計算には直近しか使わないので、古い日付は落としておく
    days: days.slice(-400),
    totals: {
      answered: log.totals.answered + results.length,
      correct: log.totals.correct + correctCount,
    },
  }
}

/** 復習期限が来ている問題の数（未学習は含めない） */
export function dueCount(log: StudyLog, now: number): number {
  return Object.values(log.records).filter((record) => record.due <= now).length
}

/** 一度でも解答した問題の数 */
export function studiedCount(log: StudyLog): number {
  return Object.keys(log.records).length
}

/** 今日を含む連続学習日数 */
export function streakDays(log: StudyLog, now: number): number {
  const set = new Set(log.days)
  // 今日まだ学習していなくても、昨日までの連続は保っている扱いにする
  let cursor = set.has(dayKey(now)) ? now : now - DAY_MS
  let count = 0
  while (set.has(dayKey(cursor))) {
    count += 1
    cursor -= DAY_MS
  }
  return count
}

export type CategoryStat = {
  category: Part5Category
  seen: number
  correct: number
}

/** Part 5 のカテゴリ別の累計成績 */
export function categoryStats(log: StudyLog): CategoryStat[] {
  const byCategory = new Map<Part5Category, CategoryStat>()

  for (const question of PART5_QUESTIONS) {
    const stat = byCategory.get(question.category) ?? {
      category: question.category,
      seen: 0,
      correct: 0,
    }
    const record = log.records[question.id]
    if (record) {
      stat.seen += record.seen
      stat.correct += record.correct
    }
    byCategory.set(question.category, stat)
  }

  return [...byCategory.values()]
}

/** 累計正答率（%）。1問も解いていなければ null */
export function overallAccuracy(log: StudyLog): number | null {
  if (log.totals.answered === 0) return null
  return Math.round((log.totals.correct / log.totals.answered) * 100)
}
