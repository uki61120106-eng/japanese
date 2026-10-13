"use client"

import { useSyncExternalStore } from "react"

import { personalDoc } from "@/lib/gyosei/claude-runtime"
import type { MockDraft, MockRecord } from "@/lib/gyosei/mock"
import type { CardState } from "@/lib/gyosei/srs"

/**
 * 学習記録はブラウザ（localStorage）に保存する。claude.ai のアーティファクトとして
 * 動くときは、利用者専用のドキュメント（db 機能）にも保存し、端末をまたいで引き継ぐ。
 * どちらの場合も、設定画面から書き出し・読み込みができる。
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

/** 保存先。"local" はこの端末のブラウザのみ、"cloud" は claude.ai にも保存 */
export type SyncStatus = "connecting" | "local" | "cloud" | "error"
let syncStatus: SyncStatus = "local"
type Remote = Awaited<ReturnType<typeof personalDoc>>
let remote: Remote = null

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

function getState(): AppState {
  if (!cache) cache = load()
  return cache
}

/** クラウドの記録を読み込むまでは null（読み込み中）を返す */
function getSnapshot(): AppState | null {
  return syncStatus === "connecting" ? null : getState()
}

function getServerSnapshot(): AppState | null {
  return null
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify() {
  listeners.forEach((listener) => listener())
}

function saveLocal(state: AppState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 保存できなくても画面上の学習は続けられるようにする
  }
}

export function updateState(updater: (state: AppState) => AppState) {
  cache = updater(getState())
  saveLocal(cache)
  scheduleRemoteSave()
  notify()
}

// クラウドへの保存は、連続した操作を1回にまとめ、1件ずつ順番に書き込む
const REMOTE_DEBOUNCE_MS = 1500
let saveTimer: number | null = null
let saving = false
let dirty = false

function scheduleRemoteSave() {
  if (!remote) return
  dirty = true
  if (saveTimer !== null) window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    saveTimer = null
    void flushRemote()
  }, REMOTE_DEBOUNCE_MS)
}

async function flushRemote() {
  if (!remote || saving || !dirty) return
  saving = true
  dirty = false
  const state = getState()
  try {
    await remote.set({ json: JSON.stringify(state), savedAt: Date.now() })
    if (syncStatus !== "cloud") {
      syncStatus = "cloud"
      notify()
    }
  } catch {
    dirty = true
    syncStatus = "error"
    notify()
  } finally {
    saving = false
  }
  if (dirty) scheduleRemoteSave()
}

/**
 * アーティファクトとして動くときに呼ぶ。クラウドに記録があればそれを使い、
 * なければこの端末の記録をクラウドへ上げる。使えなければ端末保存のまま続ける。
 */
export async function connectRemote() {
  syncStatus = "connecting"
  notify()
  const doc = await personalDoc()
  if (!doc) {
    syncStatus = "local"
    notify()
    return
  }
  try {
    const snap = await doc.get()
    const json = snap.exists ? snap.data()?.json : undefined
    const parsed: unknown = typeof json === "string" ? JSON.parse(json) : null
    remote = doc
    if (isAppState(parsed)) {
      cache = { ...emptyState(), ...parsed }
      saveLocal(cache)
      syncStatus = "cloud"
    } else {
      syncStatus = "cloud"
      if (getState().settings) {
        dirty = true
        void flushRemote()
      }
    }
  } catch {
    syncStatus = "error"
  }
  window.addEventListener("pagehide", () => void flushRemote())
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flushRemote()
  })
  notify()
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    subscribe,
    () => syncStatus,
    () => "local"
  )
}

/** サーバー描画中は null。ブラウザでは保存済みの状態を返す。 */
export function useAppState(): AppState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function exportState(today: string): string {
  updateState((state) => ({ ...state, lastExport: today }))
  return JSON.stringify(getState(), null, 2)
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
