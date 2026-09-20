import type { CategoryId } from "@/lib/korean"

/**
 * カテゴリごとの配色。row-theme.ts と同じ考え方で、Tailwind が拾えるように
 * 文字列を組み立てずに完全なクラス名をそのまま持たせている。
 */
export type CategoryTheme = {
  /** カテゴリチップ（未選択） */
  chip: string
  /** カテゴリチップ（選択中） */
  chipActive: string
  /** カード表面のグラデーション */
  cardFace: string
  /** カード枠とアクセント */
  ring: string
  /** 進捗バーなどの塗り */
  fill: string
  /** カテゴリ名の文字色 */
  text: string
}

export const CATEGORY_THEME: Record<CategoryId, CategoryTheme> = {
  greeting: {
    chip: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/70",
    chipActive:
      "border-rose-400 bg-rose-500 text-white shadow-rose-300/60 dark:border-rose-400 dark:bg-rose-500",
    cardFace: "from-rose-400 to-pink-500 dark:from-rose-500 dark:to-pink-600",
    ring: "ring-rose-300 dark:ring-rose-700",
    fill: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-300",
  },
  thanks: {
    chip: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200 dark:hover:bg-orange-950/70",
    chipActive:
      "border-orange-400 bg-orange-500 text-white shadow-orange-300/60 dark:border-orange-400 dark:bg-orange-500",
    cardFace:
      "from-orange-400 to-amber-500 dark:from-orange-500 dark:to-amber-600",
    ring: "ring-orange-300 dark:ring-orange-700",
    fill: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-300",
  },
  intro: {
    chip: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/70",
    chipActive:
      "border-amber-400 bg-amber-500 text-white shadow-amber-300/60 dark:border-amber-400 dark:bg-amber-500",
    cardFace:
      "from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-600",
    ring: "ring-amber-300 dark:ring-amber-700",
    fill: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-300",
  },
  number: {
    chip: "border-lime-200 bg-lime-50 text-lime-700 hover:bg-lime-100 dark:border-lime-900/60 dark:bg-lime-950/40 dark:text-lime-200 dark:hover:bg-lime-950/70",
    chipActive:
      "border-lime-400 bg-lime-500 text-white shadow-lime-300/60 dark:border-lime-400 dark:bg-lime-500",
    cardFace: "from-lime-400 to-green-500 dark:from-lime-500 dark:to-green-600",
    ring: "ring-lime-300 dark:ring-lime-700",
    fill: "bg-lime-500",
    text: "text-lime-700 dark:text-lime-300",
  },
  food: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/70",
    chipActive:
      "border-emerald-400 bg-emerald-500 text-white shadow-emerald-300/60 dark:border-emerald-400 dark:bg-emerald-500",
    cardFace:
      "from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600",
    ring: "ring-emerald-300 dark:ring-emerald-700",
    fill: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-300",
  },
  shop: {
    chip: "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200 dark:hover:bg-cyan-950/70",
    chipActive:
      "border-cyan-400 bg-cyan-500 text-white shadow-cyan-300/60 dark:border-cyan-400 dark:bg-cyan-500",
    cardFace: "from-cyan-400 to-sky-500 dark:from-cyan-500 dark:to-sky-600",
    ring: "ring-cyan-300 dark:ring-cyan-700",
    fill: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-300",
  },
  travel: {
    chip: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-950/70",
    chipActive:
      "border-sky-400 bg-sky-500 text-white shadow-sky-300/60 dark:border-sky-400 dark:bg-sky-500",
    cardFace: "from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600",
    ring: "ring-sky-300 dark:ring-sky-700",
    fill: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-300",
  },
  daily: {
    chip: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-950/70",
    chipActive:
      "border-violet-400 bg-violet-500 text-white shadow-violet-300/60 dark:border-violet-400 dark:bg-violet-500",
    cardFace:
      "from-violet-400 to-purple-500 dark:from-violet-500 dark:to-purple-600",
    ring: "ring-violet-300 dark:ring-violet-700",
    fill: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-300",
  },
  trouble: {
    chip: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100 dark:border-fuchsia-900/60 dark:bg-fuchsia-950/40 dark:text-fuchsia-200 dark:hover:bg-fuchsia-950/70",
    chipActive:
      "border-fuchsia-400 bg-fuchsia-500 text-white shadow-fuchsia-300/60 dark:border-fuchsia-400 dark:bg-fuchsia-500",
    cardFace:
      "from-fuchsia-400 to-purple-500 dark:from-fuchsia-500 dark:to-purple-600",
    ring: "ring-fuchsia-300 dark:ring-fuchsia-700",
    fill: "bg-fuchsia-500",
    text: "text-fuchsia-600 dark:text-fuchsia-300",
  },
}
