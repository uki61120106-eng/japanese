/**
 * 記録の保存先。サーバーは持たず、端末のブラウザ（localStorage）にだけ保存する。
 * React からは useWorkoutData() で購読し、updateWorkoutData() で書き換える。
 */
import { useSyncExternalStore } from "react"

import type { DietId } from "@/lib/workout/diet"
import type { Level } from "@/lib/workout/plan"

export type Settings = {
  level: Level
  /** 跳ぶ種目を足音の出ない種目に置き換える */
  quiet: boolean
  /** 種目名とカウントダウンを読み上げる */
  voice: boolean
  /** 「ホーム画面に追加」の案内を閉じた */
  hideInstallHint: boolean
  /** 毎日のリマインダーの時刻（HH:MM） */
  reminderTime: string
  /** アプリを開いている間の通知を使う */
  reminderNotify: boolean
  /** 最後に通知した日（同じ日に2回知らせない） */
  lastNotified: string | null
}

export type Goal = {
  /** YYYY-MM-DD */
  startDate: string
  startWeight: number
  lossKg: number
}

export type SessionLog = {
  date: string
  theme: string
  level: Level
  /** 実際に行った秒数 */
  seconds: number
  totalSeconds: number
  kcal: number
  completed: boolean
}

export type WeightLog = { date: string; kg: number }

export type WorkoutData = {
  version: 1
  settings: Settings
  goal: Goal | null
  sessions: SessionLog[]
  weights: WeightLog[]
  /** 日付（YYYY-MM-DD）ごとの食事の工夫 */
  diet: Record<string, DietId[]>
}

const KEY = "ie-kintore:v1"

const EMPTY: WorkoutData = {
  version: 1,
  settings: {
    level: "easy",
    quiet: true,
    voice: true,
    hideInstallHint: false,
    reminderTime: "19:00",
    reminderNotify: false,
    lastNotified: null,
  },
  goal: null,
  sessions: [],
  weights: [],
  diet: {},
}

let cache: WorkoutData | null = null
const listeners = new Set<() => void>()

/**
 * 保存されていた値やバックアップから読み込んだ値を、今の形にそろえる。
 * 形がおかしいときは null を返す（バックアップの読み込みで使う）。
 */
export function normalizeData(value: unknown): WorkoutData | null {
  if (!value || typeof value !== "object") return null
  const parsed = value as Partial<WorkoutData>
  if (parsed.version !== undefined && parsed.version !== 1) return null
  if (parsed.sessions !== undefined && !Array.isArray(parsed.sessions)) return null
  if (parsed.weights !== undefined && !Array.isArray(parsed.weights)) return null
  if (
    parsed.diet !== undefined &&
    (typeof parsed.diet !== "object" || parsed.diet === null || Array.isArray(parsed.diet))
  ) {
    return null
  }
  return {
    ...EMPTY,
    ...parsed,
    version: 1,
    settings: { ...EMPTY.settings, ...parsed.settings },
    sessions: parsed.sessions ?? [],
    weights: parsed.weights ?? [],
    diet: parsed.diet ?? {},
  }
}

function read(): WorkoutData {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return EMPTY
    return normalizeData(JSON.parse(raw)) ?? EMPTY
  } catch {
    // プライベートモードなどで読めないときは空の状態で動かす
    return EMPTY
  }
}

function getSnapshot(): WorkoutData {
  if (!cache) cache = read()
  return cache
}

function getServerSnapshot(): WorkoutData | null {
  return null
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // 別タブで記録したときも反映する
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return
    cache = read()
    listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

/** サーバー描画中と初回のハイドレーション中は null（端末の記録はまだ読めない） */
export function useWorkoutData(): WorkoutData | null {
  return useSyncExternalStore<WorkoutData | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
}

export function updateWorkoutData(update: (data: WorkoutData) => WorkoutData) {
  cache = update(getSnapshot())
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    // 保存できなくても、開いている間は画面に反映させる
  }
  listeners.forEach((listener) => listener())
}
