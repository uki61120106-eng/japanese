import type { SegmentKind } from "@/lib/workout/plan"

/**
 * 区間ごとの配色。Tailwind は静的なクラス名しか拾えないため、
 * 完全なクラス名をそのまま持たせている。
 */
export const KIND_THEME: Record<
  SegmentKind,
  { label: string; chip: string; ring: string; fill: string; text: string }
> = {
  warmup: {
    label: "ウォームアップ",
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
    ring: "stroke-amber-500",
    fill: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-300",
  },
  work: {
    label: "運動",
    chip: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200",
    ring: "stroke-orange-500",
    fill: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-300",
  },
  rest: {
    label: "休憩",
    chip: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200",
    ring: "stroke-sky-500",
    fill: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-300",
  },
  cooldown: {
    label: "クールダウン",
    chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
    ring: "stroke-emerald-500",
    fill: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-300",
  },
}
