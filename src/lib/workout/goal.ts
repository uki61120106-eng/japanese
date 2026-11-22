import type { Goal, SessionLog, WeightLog } from "@/lib/workout/storage"

/** 体脂肪 1kg を減らすのに必要とされるエネルギーの目安（kcal） */
export const KCAL_PER_KG_FAT = 7200
export const GOAL_DAYS = 365
const DAY_MS = 24 * 60 * 60 * 1000

/** 端末のタイムゾーンでの YYYY-MM-DD */
export function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS)
}

/** 目標達成に必要な1日あたりの消費の上乗せ（kcal） */
export function dailyKcalTarget(goal: Pick<Goal, "lossKg">): number {
  return (goal.lossKg * KCAL_PER_KG_FAT) / GOAL_DAYS
}

/** 開始日からの直線で引いた「この日に目指したい体重」 */
export function plannedWeight(goal: Goal, date: Date): number {
  const elapsed = daysBetween(parseDateKey(goal.startDate), date)
  const ratio = Math.min(Math.max(elapsed / GOAL_DAYS, 0), 1)
  return goal.startWeight - goal.lossKg * ratio
}

export function sortedWeights(weights: WeightLog[]): WeightLog[] {
  return [...weights].sort((a, b) => a.date.localeCompare(b.date))
}

export function latestWeight(weights: WeightLog[]): WeightLog | undefined {
  return sortedWeights(weights).at(-1)
}

/** 1日に複数回やった場合もまとめて、日付ごとの記録にする */
export function sessionsByDate(sessions: SessionLog[]): Map<string, SessionLog[]> {
  const map = new Map<string, SessionLog[]>()
  for (const session of sessions) {
    const list = map.get(session.date) ?? []
    list.push(session)
    map.set(session.date, list)
  }
  return map
}

export function isDayDone(list: SessionLog[] | undefined): boolean {
  return Boolean(list?.some((session) => session.completed))
}

/** 今日（まだなら昨日）からさかのぼって、最後までやりきった日が何日続いているか */
export function currentStreak(sessions: SessionLog[], today: Date): number {
  const byDate = sessionsByDate(sessions)
  let cursor = today
  if (!isDayDone(byDate.get(dateKey(cursor)))) {
    cursor = addDays(cursor, -1)
  }
  let streak = 0
  while (isDayDone(byDate.get(dateKey(cursor)))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function totalKcal(sessions: SessionLog[], since?: string): number {
  return sessions
    .filter((session) => !since || session.date >= since)
    .reduce((sum, session) => sum + session.kcal, 0)
}

export function formatKg(kg: number): string {
  return kg.toFixed(1)
}

export function formatDateJa(key: string): string {
  const date = parseDateKey(key)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
