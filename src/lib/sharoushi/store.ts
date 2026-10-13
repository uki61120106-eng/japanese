"use client"

import { useSyncExternalStore } from "react"

import { defaultExamDate, todayKey, type DateKey } from "@/lib/sharoushi/dates"
import type { ExamGroupId } from "@/lib/sharoushi/subjects"
import { nextCardState, type CardState } from "@/lib/sharoushi/srs"

export type DayLog = {
  seconds: number
  answered: number
  correct: number
}

export type MockRecord = {
  date: DateKey
  seconds: number
  correct: number
  total: number
  byGroup: Partial<Record<ExamGroupId, { correct: number; total: number }>>
}

/**
 * 問題の内容を自分で確かめた結果。
 * - ok: 条文などで正しいと確認した
 * - flag: 内容が怪しい・誤りがある（あとで問題データを直す）
 */
export type CheckStatus = "ok" | "flag"

export type QuestionCheck = {
  status: CheckStatus
  date: DateKey
  note?: string
}

export type StudyData = {
  version: 1
  examDate: DateKey
  /** 学習を始めた日。年間計画の起点になる。 */
  startDate: DateKey
  dailyGoalMinutes: number
  cards: Record<string, CardState>
  log: Record<DateKey, DayLog>
  mocks: MockRecord[]
  checks: Record<string, QuestionCheck>
}

/**
 * 学習記録は端末の localStorage にだけ保存する（サーバーには送らない）。
 * 端末やブラウザを変えると引き継がれない。
 */
const STORAGE_KEY = "sharoushi-study:v1"

function initialData(): StudyData {
  const today = todayKey()
  return {
    version: 1,
    examDate: defaultExamDate(today),
    startDate: today,
    dailyGoalMinutes: 30,
    cards: {},
    log: {},
    mocks: [],
    checks: {},
  }
}

const listeners = new Set<() => void>()
let cachedRaw: string | null | undefined
let cachedData: StudyData | null = null

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function getSnapshot(): StudyData {
  const raw = readRaw()
  if (raw !== cachedRaw || cachedData === null) {
    cachedRaw = raw
    cachedData = parse(raw)
  }
  return cachedData
}

function parse(raw: string | null): StudyData {
  if (!raw) return memoryFallback ?? initialData()
  try {
    const data = JSON.parse(raw) as StudyData
    if (data.version === 1) return { ...initialData(), ...data }
  } catch {
    // 壊れた値は捨てて最初からにする
  }
  return initialData()
}

/** localStorage が使えない環境（プライベートモード等）では、開いている間だけ記録を持つ */
let memoryFallback: StudyData | null = null

function write(data: StudyData) {
  const raw = JSON.stringify(data)
  try {
    window.localStorage.setItem(STORAGE_KEY, raw)
  } catch {
    memoryFallback = data
  }
  cachedRaw = readRaw()
  cachedData = data
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

/** サーバー描画時は記録が無いので null。読み込み中の表示に使う。 */
export function useStudyData(): StudyData | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}

export function updateStudyData(update: (data: StudyData) => StudyData) {
  write(update(getSnapshot()))
}

export function recordAnswer(questionId: string, isCorrect: boolean) {
  const today = todayKey()
  updateStudyData((data) => {
    const day = data.log[today] ?? { seconds: 0, answered: 0, correct: 0 }
    return {
      ...data,
      cards: {
        ...data.cards,
        [questionId]: nextCardState(data.cards[questionId], isCorrect, today),
      },
      log: {
        ...data.log,
        [today]: {
          ...day,
          answered: day.answered + 1,
          correct: day.correct + (isCorrect ? 1 : 0),
        },
      },
    }
  })
}

export function addStudySeconds(seconds: number) {
  if (seconds <= 0) return
  const today = todayKey()
  updateStudyData((data) => {
    const day = data.log[today] ?? { seconds: 0, answered: 0, correct: 0 }
    return {
      ...data,
      log: { ...data.log, [today]: { ...day, seconds: day.seconds + seconds } },
    }
  })
}

export function recordMock(record: MockRecord) {
  updateStudyData((data) => ({ ...data, mocks: [...data.mocks, record] }))
}

export function resetStudyData() {
  write(initialData())
}

/** 同じ状態をもう一度押したら「未確認」に戻す */
export function setQuestionCheck(
  questionId: string,
  status: CheckStatus,
  note?: string
) {
  updateStudyData((data) => {
    const checks = { ...data.checks }
    if (checks[questionId]?.status === status && note === undefined) {
      delete checks[questionId]
    } else {
      checks[questionId] = { status, date: todayKey(), ...(note ? { note } : {}) }
    }
    return { ...data, checks }
  })
}
