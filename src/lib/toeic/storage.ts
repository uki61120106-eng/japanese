"use client"

import { useSyncExternalStore } from "react"

import { EMPTY_LOG, type StudyLog } from "@/lib/toeic/srs"

const STORAGE_KEY = "toeic-trainer:log:v1"

/**
 * 学習ログのストア。
 *
 * 保存先はブラウザの localStorage だけで、サーバーには何も送らない。
 * サーバー描画時には読めないので、useSyncExternalStore の
 * サーバー用スナップショットとして空のログを返し、
 * ハイドレーション後に本物へ差し替える。
 */
export type LogSnapshot = {
  log: StudyLog
  /** ログを読んだ（または書いた）時刻。0 はまだブラウザで読めていないことを表す */
  at: number
}

const SERVER_SNAPSHOT: LogSnapshot = { log: EMPTY_LOG, at: 0 }

let snapshot: LogSnapshot | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): LogSnapshot {
  // 同じ内容なら同じオブジェクトを返す必要があるので、読み込み結果を保持する
  snapshot ??= { log: readFromStorage(), at: Date.now() }
  return snapshot
}

function getServerSnapshot(): LogSnapshot {
  return SERVER_SNAPSHOT
}

/** 学習ログと、それを読んだ時刻を購読する */
export function useStudyLog(): LogSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** ログを差し替えて保存する */
export function writeLog(log: StudyLog, at: number): void {
  snapshot = { log, at }
  writeToStorage(log)
  emit()
}

/** ログを消して初期状態に戻す */
export function resetLog(at: number): void {
  snapshot = { log: EMPTY_LOG, at }
  removeFromStorage()
  emit()
}

function readFromStorage(): StudyLog {
  if (typeof window === "undefined") return EMPTY_LOG

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_LOG

    const parsed: unknown = JSON.parse(raw)
    return isStudyLog(parsed) ? parsed : EMPTY_LOG
  } catch {
    // プライベートモードや保存無効。学習自体は続けられるので既定値で進める。
    return EMPTY_LOG
  }
}

function writeToStorage(log: StudyLog): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
  } catch {
    // 容量超過や保存無効。記録は残らないが、その回の学習は続けられる。
  }
}

function removeFromStorage(): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 同上
  }
}

/** 保存形式が想定どおりかを確かめる。壊れていれば作り直す。 */
function isStudyLog(value: unknown): value is StudyLog {
  if (typeof value !== "object" || value === null) return false
  const log = value as Partial<StudyLog>
  return (
    log.version === 1 &&
    typeof log.records === "object" &&
    log.records !== null &&
    Array.isArray(log.days) &&
    typeof log.totals === "object" &&
    log.totals !== null &&
    typeof log.totals.answered === "number" &&
    typeof log.totals.correct === "number"
  )
}
