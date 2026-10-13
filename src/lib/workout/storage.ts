/**
 * 記録の保存先。サーバーは持たず、端末のブラウザ（localStorage）にだけ保存する。
 * React からは useWorkoutData() で購読し、updateWorkoutData() で書き換える。
 */
import { useSyncExternalStore } from "react"

import type { Level } from "@/lib/workout/plan"

export type Settings = {
  level: Level
  /** 跳ぶ種目を足音の出ない種目に置き換える */
  quiet: boolean
  /** 種目名とカウントダウンを読み上げる */
  voice: boolean
  /** 「ホーム画面に追加」の案内を閉じた */
  hideInstallHint: boolean
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
}

const KEY = "ie-kintore:v1"

const EMPTY: WorkoutData = {
  version: 1,
  settings: { level: "easy", quiet: true, voice: true, hideInstallHint: false },
  goal: null,
  sessions: [],
  weights: [],
}

let cache: WorkoutData | null = null
const listeners = new Set<() => void>()

function read(): WorkoutData {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<WorkoutData>
    return {
      ...EMPTY,
      ...parsed,
      settings: { ...EMPTY.settings, ...parsed.settings },
    }
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
