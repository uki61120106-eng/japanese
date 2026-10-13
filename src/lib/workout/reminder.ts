/**
 * 毎日のリマインダー。サーバーを持たない方針のため、2つの仕組みを組み合わせる。
 *   1. スマホのカレンダーに「毎日くり返す予定（通知つき）」を登録する（.ics ファイル）
 *      → アプリを閉じていても、カレンダーアプリが毎日知らせてくれる
 *   2. アプリを開いている間（裏に回していても）は、時刻を過ぎてまだなら通知を出す
 */
import { addDays } from "@/lib/workout/goal"

/** "19:00" → 19時0分の Date（基準日の） */
export function reminderAt(base: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number)
  const date = new Date(base)
  date.setHours(h || 0, m || 0, 0, 0)
  return date
}

export function isPastReminder(now: Date, time: string): boolean {
  return now.getTime() >= reminderAt(now, time).getTime()
}

function icsDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  )
}

/**
 * 毎日くり返す20分の予定（開始時刻に通知）。時刻はタイムゾーンを付けない
 * 「その端末の時刻」で書くので、日本時間なら日本時間のまま入る。
 */
export function buildReminderIcs(time: string, now: Date, appUrl: string): string {
  const start = reminderAt(isPastReminder(now, time) ? addDays(now, 1) : now, time)
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ie-kintore//ouchi-kintore-20//JA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    // 同じ UID にしておくと、時刻を変えて登録し直したときに上書きされるカレンダーが多い
    "UID:ouchi-kintore-20-daily@ie-kintore",
    `DTSTAMP:${stamp}`,
    `DTSTART:${icsDate(start)}`,
    "DURATION:PT20M",
    "RRULE:FREQ=DAILY",
    "SUMMARY:おうち筋トレ20（20分）",
    `DESCRIPTION:今日の20分をやりましょう。${appUrl}`,
    `URL:${appUrl}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:おうち筋トレ20の時間です",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.join("\r\n") + "\r\n"
}

export type NotifyPermission = NotificationPermission | "unsupported"

export function notificationPermission(): NotifyPermission {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported"
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotifyPermission> {
  if (!("Notification" in window)) return "unsupported"
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

/** Service Worker 経由で通知する（スマホは new Notification() が使えないことが多い） */
export async function showReminderNotification(): Promise<boolean> {
  if (notificationPermission() !== "granted") return false
  const title = "おうち筋トレ20"
  const options: NotificationOptions = {
    body: "今日の20分がまだです。いまから始めませんか？",
    icon: "/workout/icons/icon-192.png",
    badge: "/workout/icons/icon-192.png",
    tag: "daily-reminder",
  }
  try {
    const registration = await navigator.serviceWorker?.getRegistration("/workout")
    if (registration) {
      await registration.showNotification(title, options)
      return true
    }
    new Notification(title, options)
    return true
  } catch {
    return false
  }
}
