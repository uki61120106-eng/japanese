/**
 * 日付は端末のローカル時刻で "YYYY-MM-DD" の文字列として扱う。
 * 「今日の学習」の区切りを利用者の生活時間に合わせるため。
 */
export type DateKey = string

export function toDateKey(date: Date): DateKey {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function todayKey(): DateKey {
  return toDateKey(new Date())
}

export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key: DateKey, days: number): DateKey {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

/** to - from の日数（同じ日なら 0） */
export function daysBetween(from: DateKey, to: DateKey): number {
  const ms = fromDateKey(to).getTime() - fromDateKey(from).getTime()
  return Math.round(ms / 86_400_000)
}

export function formatDate(key: DateKey): string {
  const date = fromDateKey(key)
  const week = "日月火水木金土"[date.getDay()]
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${week}）`
}

/**
 * 本試験日の初期値。例年8月の第4日曜に行われているため、
 * 今日以降で最も近いその日を返す。正式な日程は利用者が設定画面で直す。
 */
export function defaultExamDate(today: DateKey): DateKey {
  const year = fromDateKey(today).getFullYear()
  for (const y of [year, year + 1]) {
    const first = new Date(y, 7, 1)
    const firstSunday = 1 + ((7 - first.getDay()) % 7)
    const key = toDateKey(new Date(y, 7, firstSunday + 21))
    // 学習期間が短すぎる年は翌年を目標にする
    if (daysBetween(today, key) >= 90) return key
  }
  throw new Error("到達しない")
}
