import type { Part5Category, Part7DocType } from "@/lib/toeic/types"

/**
 * カテゴリの表示名と配色。
 * Tailwind は静的なクラス名しか拾えないため、完全なクラス名を持たせている。
 */
export type CategoryMeta = {
  id: Part5Category
  label: string
  /** ホーム画面のチップなどに出す一言 */
  hint: string
  chip: string
  chipActive: string
  text: string
  fill: string
}

export const PART5_CATEGORIES: CategoryMeta[] = [
  {
    id: "word-form",
    label: "品詞",
    hint: "名詞・形容詞・副詞の使い分け",
    chip: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-950/70",
    chipActive: "border-sky-500 bg-sky-600 text-white dark:border-sky-400 dark:bg-sky-500",
    text: "text-sky-700 dark:text-sky-300",
    fill: "bg-sky-600",
  },
  {
    id: "verb-form",
    label: "動詞の形",
    hint: "時制・主語との一致",
    chip: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200 dark:hover:bg-indigo-950/70",
    chipActive: "border-indigo-500 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-300",
    fill: "bg-indigo-600",
  },
  {
    id: "voice",
    label: "態",
    hint: "能動態と受動態",
    chip: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-950/70",
    chipActive: "border-violet-500 bg-violet-600 text-white dark:border-violet-400 dark:bg-violet-500",
    text: "text-violet-700 dark:text-violet-300",
    fill: "bg-violet-600",
  },
  {
    id: "preposition",
    label: "前置詞",
    hint: "in / on / by / within など",
    chip: "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200 dark:hover:bg-teal-950/70",
    chipActive: "border-teal-500 bg-teal-600 text-white dark:border-teal-400 dark:bg-teal-500",
    text: "text-teal-700 dark:text-teal-300",
    fill: "bg-teal-600",
  },
  {
    id: "conjunction",
    label: "接続詞",
    hint: "接続詞と接続副詞の区別",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/70",
    chipActive: "border-emerald-500 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    fill: "bg-emerald-600",
  },
  {
    id: "pronoun",
    label: "代名詞",
    hint: "格の使い分け・再帰代名詞",
    chip: "border-lime-200 bg-lime-50 text-lime-700 hover:bg-lime-100 dark:border-lime-900/60 dark:bg-lime-950/40 dark:text-lime-200 dark:hover:bg-lime-950/70",
    chipActive: "border-lime-600 bg-lime-600 text-white dark:border-lime-400 dark:bg-lime-500",
    text: "text-lime-700 dark:text-lime-300",
    fill: "bg-lime-600",
  },
  {
    id: "relative",
    label: "関係詞",
    hint: "who / which / whose など",
    chip: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/70",
    chipActive: "border-amber-500 bg-amber-600 text-white dark:border-amber-400 dark:bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    fill: "bg-amber-600",
  },
  {
    id: "comparison",
    label: "比較",
    hint: "原級・比較級・最上級",
    chip: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200 dark:hover:bg-orange-950/70",
    chipActive: "border-orange-500 bg-orange-600 text-white dark:border-orange-400 dark:bg-orange-500",
    text: "text-orange-700 dark:text-orange-300",
    fill: "bg-orange-600",
  },
  {
    id: "verbal",
    label: "準動詞",
    hint: "不定詞・動名詞・分詞",
    chip: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/70",
    chipActive: "border-rose-500 bg-rose-600 text-white dark:border-rose-400 dark:bg-rose-500",
    text: "text-rose-700 dark:text-rose-300",
    fill: "bg-rose-600",
  },
  {
    id: "vocabulary",
    label: "語彙",
    hint: "TOEIC 頻出の単語選択",
    chip: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100 dark:border-fuchsia-900/60 dark:bg-fuchsia-950/40 dark:text-fuchsia-200 dark:hover:bg-fuchsia-950/70",
    chipActive: "border-fuchsia-500 bg-fuchsia-600 text-white dark:border-fuchsia-400 dark:bg-fuchsia-500",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    fill: "bg-fuchsia-600",
  },
]

const CATEGORY_BY_ID = new Map(PART5_CATEGORIES.map((c) => [c.id, c]))

export function categoryMeta(id: Part5Category): CategoryMeta {
  const meta = CATEGORY_BY_ID.get(id)
  if (!meta) throw new Error(`未定義のカテゴリ: ${id}`)
  return meta
}

export const DOC_TYPE_LABEL: Record<Part7DocType, string> = {
  email: "Eメール",
  notice: "お知らせ・社内通知",
  advertisement: "広告",
  article: "記事",
  "text-message": "チャット",
  form: "申込書・帳票",
}
