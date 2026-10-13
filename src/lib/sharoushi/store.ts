"use client"

import { useSyncExternalStore } from "react"

import { defaultExamDate, todayKey, type DateKey } from "@/lib/sharoushi/dates"
import type { ExamGroupId } from "@/lib/sharoushi/subjects"
import { nextCardState, type CardState } from "@/lib/sharoushi/srs"
import { encodeStudyData, mergeStudyData } from "@/lib/sharoushi/sync-merge"

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
  /** 最後に記録を変えた時刻（ミリ秒）。端末間の統合に使う */
  updatedAt: number
  /** 記録を消去した時刻（ミリ秒）。これより前の記録は統合しない */
  resetAt: number
}

/**
 * 学習記録はまず端末の localStorage に保存する。
 * claude.ai のアーティファクトとして開いたときは、本人だけが読み書きできる
 * 保存領域（db の data/users/<id>/）にも同期し、スマホと PC で同じ記録を使う。
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
    updatedAt: 0,
    resetAt: 0,
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

/** 画面からの変更。時刻を付けて保存し、同期先にも送る */
function write(data: StudyData) {
  saveLocal({ ...data, updatedAt: Math.max(Date.now(), data.updatedAt + 1) })
  schedulePush()
}

function saveLocal(data: StudyData) {
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
  startCloudSync()
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
  const now = Date.now()
  write({ ...initialData(), resetAt: now, updatedAt: now })
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

// ---------------------------------------------------------------------------
// 端末間の同期（claude.ai のアーティファクトとして開いたときだけ動く）

export type SyncStatus =
  /** 同期先が無い（Next.js で動かしている、未ログインなど）。この端末だけに保存 */
  | "local"
  | "connecting"
  | "synced"
  | "error"

type DocSnapshot = {
  exists: boolean
  data(): Record<string, unknown> | undefined
  metadata: { hasPendingWrites: boolean }
}
type DocRef = {
  set(data: Record<string, unknown>): Promise<void>
  onSnapshot(
    next: (snap: DocSnapshot) => void,
    error?: (e: { code: string }) => void
  ): () => void
}
type ClaudeRuntime = {
  use(name: "db"): Promise<{ doc(path: string): DocRef } | null>
  use(name: "user"): Promise<{ id(): Promise<string | null> } | null>
}

/** 1つの文書の上限は 256 KiB。余裕を見てこれを超えたら送らない */
const MAX_PAYLOAD = 240_000

type SyncState = { status: SyncStatus; message: string }

const LOCAL_SYNC: SyncState = { status: "local", message: "" }
let syncState: SyncState = LOCAL_SYNC
const syncListeners = new Set<() => void>()
let syncStarted = false
let remoteRef: DocRef | null = null
let lastRemotePayload: string | null = null
let pushTimer: ReturnType<typeof setTimeout> | undefined
let pushing = false
let pushAgain = false

function setSyncStatus(status: SyncStatus, message = "") {
  if (syncState.status === status && syncState.message === message) return
  syncState = { status, message }
  syncListeners.forEach((listener) => listener())
}

export function useSyncStatus(): SyncState {
  return useSyncExternalStore(
    (listener) => {
      syncListeners.add(listener)
      return () => {
        syncListeners.delete(listener)
      }
    },
    () => syncState,
    () => LOCAL_SYNC
  )
}

function startCloudSync() {
  if (syncStarted || typeof window === "undefined") return
  syncStarted = true
  const runtime = (window as unknown as { claude?: ClaudeRuntime }).claude
  if (!runtime?.use) return
  setSyncStatus("connecting")
  void connect(runtime)
}

async function connect(runtime: ClaudeRuntime) {
  try {
    const [user, db] = await Promise.all([runtime.use("user"), runtime.use("db")])
    const id = user ? await user.id() : null
    if (!db || !id) {
      setSyncStatus("local", "ログインしていないため、この端末だけに保存しています")
      return
    }
    remoteRef = db.doc(`data/users/${id}/sharoushi`)
    remoteRef.onSnapshot(onRemote, () =>
      setSyncStatus("error", "同期が止まりました。ページを開き直すと再開します")
    )
    window.addEventListener("pagehide", () => void push())
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") void push()
    })
  } catch {
    setSyncStatus("local", "同期先に接続できないため、この端末だけに保存しています")
  }
}

function onRemote(snap: DocSnapshot) {
  if (snap.metadata.hasPendingWrites) return
  const body = snap.exists ? snap.data() : undefined
  const payload = typeof body?.payload === "string" ? body.payload : null
  lastRemotePayload = payload

  const local = getSnapshot()
  let merged = local
  if (payload) {
    try {
      const remote = { ...initialData(), ...(JSON.parse(payload) as StudyData) }
      merged = mergeStudyData(local, remote)
    } catch {
      // 壊れた同期データは、この端末の記録で上書きする
    }
  }
  const mergedPayload = encodeStudyData(merged)
  if (mergedPayload !== encodeStudyData(local)) saveLocal(merged)
  if (mergedPayload !== payload) schedulePush(0)
  else setSyncStatus("synced")
}

function schedulePush(delay = 1500) {
  if (!remoteRef) return
  clearTimeout(pushTimer)
  pushTimer = setTimeout(() => void push(), delay)
}

/** 同期先への書き込みは1つずつ。書き込み中に変更があれば、終わってからもう一度送る */
async function push() {
  if (!remoteRef) return
  clearTimeout(pushTimer)
  if (pushing) {
    pushAgain = true
    return
  }
  pushing = true
  try {
    const data = getSnapshot()
    const payload = encodeStudyData(data)
    if (payload !== lastRemotePayload) {
      if (payload.length > MAX_PAYLOAD) {
        setSyncStatus("error", "記録が大きすぎて同期できません。この端末には保存されています")
      } else {
        await remoteRef.set({ payload, updatedAt: data.updatedAt })
        lastRemotePayload = payload
        setSyncStatus("synced")
      }
    }
  } catch {
    setSyncStatus("error", "同期に失敗しました。この端末には保存されています")
  } finally {
    pushing = false
    if (pushAgain) {
      pushAgain = false
      void push()
    }
  }
}
