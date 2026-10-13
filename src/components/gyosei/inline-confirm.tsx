"use client"

import { Button } from "@/components/ui/button"

/**
 * window.confirm の代わりに画面内に出す確認。
 * アーティファクトとして埋め込むと confirm() は常に false を返すため使わない。
 */
export function InlineConfirm({
  message,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: {
  message: string
  confirmLabel: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      role="alertdialog"
      aria-label={message}
      className="flex flex-col gap-3 rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 p-3"
    >
      <p className="text-sm font-bold">{message}</p>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="rounded-xl" onClick={onCancel}>
          やめる
        </Button>
        <Button
          variant={destructive ? "destructive" : "default"}
          className="rounded-xl"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  )
}
