import type { Element } from "@/lib/puzzle/types"

/**
 * 属性ごとの表示。Tailwind は静的なクラス名しか拾えないため、
 * 文字列を組み立てずに完全なクラス名をそのまま持たせている。
 * 色だけに頼らず形でも区別できるよう、属性ごとに記号を変えている。
 */
export type ElementTheme = {
  label: string
  /** ドロップに載せる記号 */
  symbol: string
  /** ドロップ本体のグラデーション */
  orb: string
  /** バッジやチップ */
  chip: string
  /** 文字色 */
  text: string
  /** HP バーなどの塗り */
  fill: string
  /** カードの縁取り */
  ring: string
  /** 画面の淡い背景 */
  soft: string
}

export const ELEMENT_THEME: Record<Element, ElementTheme> = {
  fire: {
    label: "火",
    symbol: "◆",
    orb: "from-rose-400 to-red-600",
    chip: "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200",
    text: "text-rose-600 dark:text-rose-300",
    fill: "bg-rose-500",
    ring: "ring-rose-400/70",
    soft: "bg-rose-50 dark:bg-rose-950/40",
  },
  water: {
    label: "水",
    symbol: "●",
    orb: "from-sky-400 to-blue-600",
    chip: "border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-200",
    text: "text-sky-600 dark:text-sky-300",
    fill: "bg-sky-500",
    ring: "ring-sky-400/70",
    soft: "bg-sky-50 dark:bg-sky-950/40",
  },
  wood: {
    label: "木",
    symbol: "▲",
    orb: "from-lime-400 to-emerald-600",
    chip: "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
    text: "text-emerald-600 dark:text-emerald-300",
    fill: "bg-emerald-500",
    ring: "ring-emerald-400/70",
    soft: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  light: {
    label: "光",
    symbol: "★",
    orb: "from-amber-300 to-yellow-500",
    chip: "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
    text: "text-amber-600 dark:text-amber-300",
    fill: "bg-amber-500",
    ring: "ring-amber-400/70",
    soft: "bg-amber-50 dark:bg-amber-950/40",
  },
  dark: {
    label: "闇",
    symbol: "■",
    orb: "from-violet-500 to-purple-800",
    chip: "border-violet-300 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-200",
    text: "text-violet-600 dark:text-violet-300",
    fill: "bg-violet-500",
    ring: "ring-violet-400/70",
    soft: "bg-violet-50 dark:bg-violet-950/40",
  },
  heart: {
    label: "回復",
    symbol: "♥",
    orb: "from-pink-300 to-fuchsia-500",
    chip: "border-pink-300 bg-pink-100 text-pink-700 dark:border-pink-800 dark:bg-pink-950/60 dark:text-pink-200",
    text: "text-pink-600 dark:text-pink-300",
    fill: "bg-pink-500",
    ring: "ring-pink-400/70",
    soft: "bg-pink-50 dark:bg-pink-950/40",
  },
}
