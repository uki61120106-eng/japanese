import { SUBJECT_MAP, SUBJECT_THEME } from "@/lib/gyosei/content"
import type { SubjectId } from "@/lib/gyosei/types"
import { cn } from "@/lib/utils"

export function pct(numerator: number, denominator: number): number {
  return denominator ? Math.round((numerator / denominator) * 100) : 0
}

export function SubjectBadge({
  subject,
  className,
}: {
  subject: SubjectId
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-bold",
        SUBJECT_THEME[subject].badge,
        className
      )}
    >
      {SUBJECT_MAP[subject].name}
    </span>
  )
}

export function Meter({
  value,
  className,
  fillClassName,
}: {
  value: number
  className?: string
  fillClassName?: string
}) {
  return (
    <div
      className={cn("bg-muted h-2 w-full overflow-hidden rounded-full", className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <div
        className={cn("bg-primary h-full rounded-full transition-all", fillClassName)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function StatTile({
  label,
  value,
  unit,
  hint,
}: {
  label: string
  value: string | number
  unit?: string
  hint?: string
}) {
  return (
    <div className="bg-card flex flex-col gap-1 rounded-2xl border p-3">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-2xl font-extrabold tabular-nums">
        {value}
        {unit && <span className="ml-0.5 text-sm font-bold">{unit}</span>}
      </span>
      {hint && <span className="text-muted-foreground text-[0.7rem]">{hint}</span>}
    </div>
  )
}

export function ScreenTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-2xl font-black tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </header>
  )
}

export function formatMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}分`
  return `${Math.floor(minutes / 60)}時間${minutes % 60}分`
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(2, "0")
  const ss = String(sec).padStart(2, "0")
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
