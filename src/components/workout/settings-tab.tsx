"use client"

import { useRef, useState } from "react"
import { Bell, CalendarPlus, Copy, Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { downloadText } from "@/lib/workout/download"
import { dateKey } from "@/lib/workout/goal"
import {
  buildReminderIcs,
  notificationPermission,
  requestNotificationPermission,
  type NotifyPermission,
} from "@/lib/workout/reminder"
import {
  normalizeData,
  updateWorkoutData,
  type WorkoutData,
} from "@/lib/workout/storage"

const APP_ID = "ouchi-kintore-20"

export function SettingsTab({ data, today }: { data: WorkoutData; today: Date }) {
  return (
    <div className="flex flex-col gap-5">
      <ReminderSection data={data} today={today} />
      <BackupSection data={data} today={today} />
    </div>
  )
}

function appUrl(): string {
  return window.location.pathname.startsWith("/workout")
    ? `${window.location.origin}/workout`
    : ""
}

function ReminderSection({ data, today }: { data: WorkoutData; today: Date }) {
  const { reminderTime, reminderNotify } = data.settings
  const [permission, setPermission] = useState<NotifyPermission>(() =>
    notificationPermission()
  )
  const [message, setMessage] = useState<string | null>(null)

  function setTime(time: string) {
    if (!/^\d{2}:\d{2}$/.test(time)) return
    updateWorkoutData((current) => ({
      ...current,
      settings: { ...current.settings, reminderTime: time, lastNotified: null },
    }))
  }

  function addToCalendar() {
    const ok = downloadText(
      "ouchi-kintore-20.ics",
      buildReminderIcs(reminderTime, new Date(), appUrl()),
      "text/calendar;charset=utf-8"
    )
    setMessage(
      ok
        ? "予定のファイルを作りました。開いて「カレンダーに追加」を選んでください"
        : "この画面ではファイルを保存できません。ブラウザで開き直してください"
    )
  }

  async function toggleNotify(on: boolean) {
    if (on && permission !== "granted") {
      const result = await requestNotificationPermission()
      setPermission(result)
      if (result !== "granted") {
        setMessage(
          result === "denied"
            ? "通知が許可されていません。端末の設定でこのアプリの通知を許可してください"
            : "この端末では通知を使えません。カレンダーへの登録をお使いください"
        )
        return
      }
    }
    updateWorkoutData((current) => ({
      ...current,
      settings: { ...current.settings, reminderNotify: on, lastNotified: dateKey(today) },
    }))
    setMessage(null)
  }

  return (
    <section className="bg-card flex flex-col gap-4 rounded-3xl border p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-1.5 text-lg font-extrabold">
          <Bell className="size-5 text-orange-500" />
          毎日のリマインダー
        </h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          決まった時刻に「今日の20分」を知らせます
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label htmlFor="reminder-time" className="text-sm font-bold">
          知らせる時刻
        </label>
        <input
          id="reminder-time"
          type="time"
          value={reminderTime}
          onChange={(event) => setTime(event.target.value)}
          className="border-input bg-background focus-visible:ring-ring/50 h-11 rounded-xl border px-3 text-lg font-bold tabular-nums outline-none focus-visible:ring-[3px]"
        />
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border p-4">
        <span className="text-sm font-bold">カレンダーに登録（おすすめ）</span>
        <p className="text-muted-foreground text-xs leading-relaxed">
          スマホのカレンダーに「毎日 {reminderTime} から20分」の予定を通知つきで入れます。
          アプリを閉じていても、カレンダーが毎日知らせてくれます。時刻を変えたら登録し直してください。
        </p>
        <Button variant="outline" onClick={addToCalendar} className="h-11 rounded-xl">
          <CalendarPlus />
          カレンダーに登録する
        </Button>
      </div>

      <label
        htmlFor="reminder-notify"
        className="flex items-center justify-between gap-3 rounded-2xl border p-4"
      >
        <span className="flex flex-col gap-1">
          <span className="text-sm font-bold">アプリの通知</span>
          <span className="text-muted-foreground text-xs leading-relaxed">
            アプリを開いている間（裏に回していても）、{reminderTime} を過ぎてまだなら通知します。
            アプリを完全に閉じているときは届きません。
          </span>
        </span>
        <Switch
          id="reminder-notify"
          checked={reminderNotify && permission === "granted"}
          onCheckedChange={(on) => void toggleNotify(on)}
        />
      </label>

      {message && (
        <p className="text-muted-foreground text-xs" role="status">
          {message}
        </p>
      )}
    </section>
  )
}

function BackupSection({ data, today }: { data: WorkoutData; today: Date }) {
  const [message, setMessage] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [pending, setPending] = useState<WorkoutData | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function makeBackup(): string {
    return JSON.stringify({ app: APP_ID, exportedAt: new Date().toISOString(), data })
  }

  function saveFile() {
    const ok = downloadText(
      `ouchi-kintore-20-backup-${dateKey(today)}.json`,
      makeBackup(),
      "application/json"
    )
    setMessage(
      ok
        ? "バックアップのファイルを保存しました"
        : "この画面ではファイルを保存できません。「コピー」をお使いください"
    )
  }

  async function copy() {
    const backup = makeBackup()
    try {
      await navigator.clipboard.writeText(backup)
      setMessage("コピーしました。メモ帳アプリやメールに貼り付けて保管してください")
    } catch {
      setText(backup)
      setMessage("コピーできなかったので下の欄に表示しました。全部選んでコピーしてください")
    }
  }

  function parse(raw: string) {
    try {
      const json = JSON.parse(raw) as { app?: string; data?: unknown }
      const next = normalizeData(json.app === APP_ID ? json.data : json)
      if (!next) throw new Error("invalid")
      setPending(next)
      setMessage(null)
    } catch {
      setPending(null)
      setMessage("読み込めませんでした。このアプリで書き出したバックアップか確かめてください")
    }
  }

  async function readFile(file: File | undefined) {
    if (!file) return
    parse(await file.text())
  }

  function restore() {
    if (!pending) return
    updateWorkoutData(() => pending)
    setMessage(
      `読み込みました（トレーニング ${pending.sessions.length} 回・体重 ${pending.weights.length} 件）`
    )
    setPending(null)
    setText("")
  }

  return (
    <section className="bg-card flex flex-col gap-4 rounded-3xl border p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-1.5 text-lg font-extrabold">
          <Download className="size-5 text-orange-500" />
          記録のバックアップ
        </h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          記録はこの端末のブラウザの中にだけあります。機種変更やブラウザのデータ削除の前に書き出してください。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={saveFile} className="h-11 rounded-xl">
          <Download />
          ファイルに保存
        </Button>
        <Button variant="outline" onClick={() => void copy()} className="h-11 rounded-xl">
          <Copy />
          コピー
        </Button>
      </div>

      <div className="flex flex-col gap-2 border-t pt-4">
        <span className="text-sm font-bold">バックアップから戻す</span>
        <input
          ref={fileRef}
          id="backup-file"
          type="file"
          accept="application/json,.json,text/plain"
          className="hidden"
          onChange={(event) => void readFile(event.target.files?.[0])}
        />
        <Button
          variant="outline"
          onClick={() => fileRef.current?.click()}
          className="h-11 rounded-xl"
        >
          <Upload />
          ファイルを選ぶ
        </Button>
        <label htmlFor="backup-text" className="text-muted-foreground text-xs">
          またはコピーした文字を貼り付け
        </label>
        <textarea
          id="backup-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          placeholder='{"app":"ouchi-kintore-20", …}'
          className="border-input bg-background focus-visible:ring-ring/50 rounded-xl border px-3 py-2 font-mono text-xs outline-none focus-visible:ring-[3px]"
        />
        <Button
          variant="secondary"
          disabled={text.trim() === ""}
          onClick={() => parse(text)}
          className="h-10 rounded-xl"
        >
          貼り付けた内容を確認
        </Button>
      </div>

      {pending && (
        <div className="flex flex-col gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/40">
          <p>
            トレーニング {pending.sessions.length} 回・体重 {pending.weights.length} 件の記録で、
            <b>いまの記録を置き換えます</b>。いまの記録（トレーニング {data.sessions.length} 回）は消えます。
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setPending(null)}>
              やめる
            </Button>
            <Button className="flex-1" onClick={restore}>
              置き換える
            </Button>
          </div>
        </div>
      )}

      {message && (
        <p className="text-muted-foreground text-xs" role="status">
          {message}
        </p>
      )}
    </section>
  )
}
