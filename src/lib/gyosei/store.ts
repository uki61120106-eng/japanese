"use client"

import { useSyncExternalStore } from "react"

import type { MockDraft, MockRecord } from "@/lib/gyosei/mock"
import type { CardState } from "@/lib/gyosei/srs"

/**
 * 学習記録はこの端末のブラウザ（localStorage）にだけ保存する。
 * 端末の変更やブラウザのデータ削除に備えて、設定画面から書き出し・読み込みができる。
 */
const STORAGE_KEY = "gyosei-study-v1"

export type Settings = {
  startDate: string
  examDate: string
  /** 1日に新しく解く問題数 */
  newPerDay: number
  /** 1日に解く復習問題の上限 */
  reviewCap: number
}

export type DayLog = {
  answered: number
  correct: number
  seconds: number
  /** その日の学習セットを最後までやり終えたか */
  done: boolean
}

export type CheckLog = {
  week: number
  date: string
  correct: number
  total: number
}

export type AppState = {
  version: 1
  settings: Settings | null
  cards: Record<string, CardState>
  days: Record<string, DayLog>
  checks: CheckLog[]
  mocks: MockRecord[]
  /** 記述式の自己採点（直近の点数） */
  kijutsu: Record<string, { last: number; best: number; date: string }>
  draft: MockDraft | null
  /** 最後に記録を書き出した日 */
  lastExport?: string
}

export function emptyState(): AppState {
  return {
    version: 1,
    settings: null,
    cards: {},
    days: {},
    checks: [],
    mocks: [],
    kijutsu: {},
    draft: null,
  }
}

let cache: AppState | null = null
const listeners = new Set<() => void>()

function isAppState(value: unknown): value is AppState {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as AppState).version === 1 &&
    typeof (value as AppState).cards === "object"
  )
}

function load(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isAppState(parsed)) return { ...emptyState(), ...parsed }
    }
  } catch {
    // プライベートブラウズ等で読めない場合は空の状態で始める
  }
  return emptyState()
}

function getSnapshot(): AppState {
  if (!cache) cache = load()
  return cache
}

function getServerSnapshot(): AppState | null {
  return null
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function updateState(updater: (state: AppState) => AppState) {
  cache = updater(getSnapshot())
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // 保存できなくても画面上の学習は続けられるようにする
  }
  listeners.forEach((listener) => listener())
}

/** サーバー描画中は null。ブラウザでは保存済みの状態を返す。 */
export function useAppState(): AppState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function exportState(today: string): string {
  updateState((state) => ({ ...state, lastExport: today }))
  return JSON.stringify(getSnapshot(), null, 2)
}

export function importState(json: string): boolean {
  try {
    const parsed: unknown = JSON.parse(json)
    if (!isAppState(parsed)) return false
    updateState(() => ({ ...emptyState(), ...parsed }))
    return true
  } catch {
    return false
  }
}

export function resetState() {
  updateState(() => emptyState())
}
