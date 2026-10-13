"use client"

import { Cloud, CloudOff, LoaderCircle, Smartphone } from "lucide-react"

import { useSyncStatus } from "@/lib/sharoushi/store"
import { cn } from "@/lib/utils"

const LABEL = {
  local: "この端末に保存",
  connecting: "同期先に接続中",
  synced: "スマホ・PCで同期済み",
  error: "同期できていません",
} as const

/** 記録がどこに保存されているかを示す小さな表示 */
export function SyncBadge({ detailed = false }: { detailed?: boolean }) {
  const { status, message } = useSyncStatus()
  const Icon =
    status === "synced"
      ? Cloud
      : status === "connecting"
        ? LoaderCircle
        : status === "error"
          ? CloudOff
          : Smartphone

  return (
    <div className="flex flex-col gap-1">
      <span
        role="status"
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          status === "synced" && "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
          status === "connecting" && "bg-muted text-muted-foreground",
          status === "error" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
          status === "local" && "bg-muted text-muted-foreground"
        )}
      >
        <Icon className={cn("size-3.5", status === "connecting" && "animate-spin")} />
        {LABEL[status]}
      </span>
      {detailed && message && (
        <span className="text-muted-foreground text-xs">{message}</span>
      )}
    </div>
  )
}
