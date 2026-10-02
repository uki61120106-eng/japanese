import type { SceneTheme } from "@/lib/indonesian/scenes"

/**
 * 場面ごとの配色。Tailwind は静的なクラス名しか拾えないため、
 * 文字列を組み立てずに完全なクラス名をそのまま持たせている。
 */
export type SceneThemeClasses = {
  /** 場面カードのアイコン背景 */
  badge: string
  /** 相手の吹き出し */
  bubble: string
  /** ヘッダーなどのグラデーション */
  gradient: string
  /** 進捗バーなどの塗り */
  fill: string
  /** アクセントの文字色 */
  text: string
}

export const SCENE_THEME: Record<SceneTheme, SceneThemeClasses> = {
  rose: {
    badge: "bg-rose-100 dark:bg-rose-950/60",
    bubble:
      "border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40",
    gradient: "from-rose-400 to-pink-500 dark:from-rose-500 dark:to-pink-600",
    fill: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-300",
  },
  amber: {
    badge: "bg-amber-100 dark:bg-amber-950/60",
    bubble:
      "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40",
    gradient:
      "from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600",
    fill: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-300",
  },
  emerald: {
    badge: "bg-emerald-100 dark:bg-emerald-950/60",
    bubble:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40",
    gradient:
      "from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600",
    fill: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-300",
  },
  sky: {
    badge: "bg-sky-100 dark:bg-sky-950/60",
    bubble:
      "border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/40",
    gradient: "from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600",
    fill: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-300",
  },
  violet: {
    badge: "bg-violet-100 dark:bg-violet-950/60",
    bubble:
      "border-violet-200 bg-violet-50 dark:border-violet-900/60 dark:bg-violet-950/40",
    gradient:
      "from-violet-400 to-purple-500 dark:from-violet-500 dark:to-purple-600",
    fill: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-300",
  },
  teal: {
    badge: "bg-teal-100 dark:bg-teal-950/60",
    bubble:
      "border-teal-200 bg-teal-50 dark:border-teal-900/60 dark:bg-teal-950/40",
    gradient: "from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600",
    fill: "bg-teal-500",
    text: "text-teal-600 dark:text-teal-300",
  },
}
