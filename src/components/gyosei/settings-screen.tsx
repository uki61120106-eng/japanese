"use client"

import { useRef, useState } from "react"
import { Download, GraduationCap, Trash2, Upload } from "lucide-react"

import { ScreenTitle } from "@/components/gyosei/common"
import { InlineConfirm } from "@/components/gyosei/inline-confirm"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { saveSettings } from "@/lib/gyosei/actions"
import { saveTextFile } from "@/lib/gyosei/claude-runtime"
import { STATEMENTS } from "@/lib/gyosei/content"
import { diffDays, formatJP, todayISO } from "@/lib/gyosei/dates"
import { defaultExamDate, examDateOf } from "@/lib/gyosei/exam"
import {
  exportState,
  importState,
  resetState,
  useSyncStatus,
  type Settings,
} from "@/lib/gyosei/store"

function SettingsForm({
  initial,
  submitLabel,
  onSaved,
}: {
  initial: Settings
  submitLabel: string
  onSaved?: () => void
}) {
  const [form, setForm] = useState(initial)
  const days = diffDays(form.startDate, form.examDate)
  const valid = days >= 7

  return (
    <Card className="gap-4 rounded-3xl py-5">
      <CardContent className="flex flex-col gap-4 px-5">
        <Field label="学習開始日">
          <input
            type="date"
            value={form.startDate}
            onChange={(event) => {
              const startDate = event.target.value
              if (startDate) setForm({ ...form, startDate })
            }}
            className="bg-background h-11 w-full rounded-xl border px-3 text-base"
          />
        </Field>
        <Field
          label="受験する試験日"
          hint={`例年11月の第2日曜日。開始日から300日以上空く回を自動で選んでいます（${examDateOf(Number(form.startDate.slice(0, 4)))} など）。`}
        >
          <div className="flex gap-2">
            <input
              type="date"
              value={form.examDate}
              onChange={(event) => {
                const examDate = event.target.value
                if (examDate) setForm({ ...form, examDate })
              }}
              className="bg-background h-11 w-full rounded-xl border px-3 text-base"
            />
            <Button
              variant="outline"
              className="shrink-0 rounded-xl"
              onClick={() =>
                setForm({ ...form, examDate: defaultExamDate(form.startDate) })
              }
            >
              自動
            </Button>
          </div>
        </Field>
        <p className="text-sm">
          準備期間：
          <span className="font-bold tabular-nums">
            {valid ? `${days}日（約${Math.ceil(days / 7)}週）` : "開始日と試験日を確認してください"}
          </span>
          {valid && (
            <span className="text-muted-foreground">
              ・1日30分で合計約{Math.round((days * 30) / 60)}時間
            </span>
          )}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="1日の新しい問題">
            <NumberSelect
              value={form.newPerDay}
              options={[5, 8, 10, 12, 15]}
              onChange={(newPerDay) => setForm({ ...form, newPerDay })}
            />
          </Field>
          <Field label="1日の復習の上限">
            <NumberSelect
              value={form.reviewCap}
              options={[10, 15, 20, 25, 30]}
              onChange={(reviewCap) => setForm({ ...form, reviewCap })}
            />
          </Field>
        </div>

        <Button
          size="lg"
          className="rounded-xl"
          disabled={!valid}
          onClick={() => {
            saveSettings(form)
            onSaved?.()
          }}
        >
          {submitLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      {children}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  )
}

function NumberSelect({
  value,
  options,
  onChange,
}: {
  value: number
  options: number[]
  onChange: (value: number) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="bg-background h-11 w-full rounded-xl border px-3 text-base"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}問
        </option>
      ))}
    </select>
  )
}

export const DEFAULT_SETTINGS = (today: string): Settings => ({
  startDate: today,
  examDate: defaultExamDate(today),
  newPerDay: 10,
  reviewCap: 20,
})

/** 初回起動時の画面 */
export function SetupScreen({ today }: { today: string }) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col items-center gap-2 pt-4 text-center">
        <GraduationCap className="text-primary size-10" />
        <h1 className="text-2xl font-black tracking-tight">
          行政書士 1年合格プラン
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          毎日30分。要点 → 一問一答 → 間隔反復の復習を積み上げ、
          週末の理解度チェックと模試で仕上がりを確かめます。
        </p>
      </header>
      <SettingsForm initial={DEFAULT_SETTINGS(today)} submitLabel="この計画ではじめる" />
      <p className="text-muted-foreground text-xs leading-relaxed">
        収録問題：一問一答 {STATEMENTS.length}問・記述式・多肢選択。学習記録はあなた専用で、他の人には見えません。
      </p>
    </div>
  )
}

export function SettingsScreen({
  settings,
  onSaved,
}: {
  settings: Settings
  onSaved: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const syncStatus = useSyncStatus()
  const [confirm, setConfirm] = useState<
    { kind: "import"; text: string } | { kind: "reset" } | null
  >(null)

  async function download() {
    const saved = await saveTextFile(
      `gyosei-study-${todayISO()}.json`,
      exportState(todayISO())
    )
    setMessage(saved ? "書き出しました" : "書き出せませんでした")
  }

  return (
    <div className="flex flex-col gap-5">
      <ScreenTitle title="設定" description={`試験日：${formatJP(settings.examDate)}`} />
      <SettingsForm
        key={JSON.stringify(settings)}
        initial={settings}
        submitLabel="保存する"
        onSaved={() => {
          setMessage("保存しました")
          onSaved()
        }}
      />

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">学習記録のバックアップ</h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {syncStatus === "cloud"
            ? "記録は claude.ai のあなた専用の領域に自動保存され、別の端末で開いても続きから学習できます。念のため月に1回は書き出しておくと安全です。"
            : syncStatus === "error"
              ? "claude.ai への保存に失敗しました。通信を確認してください。記録はこの端末には残っています。"
              : "記録はこのブラウザにだけ保存されています。機種変更やブラウザのデータ削除に備えて、月に1回は書き出しておくと安全です。"}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="rounded-xl" onClick={download}>
            <Download />
            書き出す
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => fileRef.current?.click()}
          >
            <Upload />
            読み込む
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (!file) return
            setConfirm({ kind: "import", text: await file.text() })
          }}
        />
        {confirm?.kind === "import" && (
          <InlineConfirm
            message="今の記録を、読み込むファイルの内容で置き換えます。よろしいですか？"
            confirmLabel="置き換える"
            destructive
            onCancel={() => setConfirm(null)}
            onConfirm={() => {
              setMessage(
                importState(confirm.text)
                  ? "読み込みました"
                  : "読み込めませんでした（形式が違います）"
              )
              setConfirm(null)
            }}
          />
        )}
        {message && <p className="text-sm font-bold">{message}</p>}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold">リセット</h2>
        {confirm?.kind === "reset" ? (
          <InlineConfirm
            message="すべての学習記録と設定を消去します。元に戻せません。よろしいですか？"
            confirmLabel="消去する"
            destructive
            onCancel={() => setConfirm(null)}
            onConfirm={() => {
              setConfirm(null)
              resetState()
            }}
          />
        ) : (
          <Button
            variant="outline"
            className="text-destructive rounded-xl"
            onClick={() => setConfirm({ kind: "reset" })}
          >
            <Trash2 />
            すべての記録を消去
          </Button>
        )}
      </section>
    </div>
  )
}
