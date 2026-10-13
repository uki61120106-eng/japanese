/** 日付は端末のローカル時刻で "YYYY-MM-DD" 文字列として扱う。 */

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function parseISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function addDays(value: string, days: number): string {
  const date = parseISODate(value)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

/** b - a の日数（同じ日なら 0） */
export function diffDays(a: string, b: string): number {
  const ms = parseISODate(b).getTime() - parseISODate(a).getTime()
  return Math.round(ms / 86_400_000)
}

export function formatJP(value: string): string {
  const date = parseISODate(value)
  const week = "日月火水木金土"[date.getDay()]
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${week}）`
}

export function formatShort(value: string): string {
  const date = parseISODate(value)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
