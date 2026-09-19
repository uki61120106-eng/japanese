/**
 * TOEIC 学習パートの型定義。
 *
 * 問題文・選択肢・解説はすべてこのリポジトリ用に書き下ろした自作問題。
 * 公式問題集や市販教材からの転載はしていない。
 */

/** 問題文中の空所を表すトークン。表示時にこの文字列で分割する。 */
export const BLANK = "____"

/** Part 5 の文法・語彙カテゴリ */
export type Part5Category =
  | "word-form"
  | "verb-form"
  | "voice"
  | "preposition"
  | "conjunction"
  | "pronoun"
  | "relative"
  | "comparison"
  | "verbal"
  | "vocabulary"

export type Part5Question = {
  id: string
  category: Part5Category
  /** BLANK を1つ含む英文 */
  sentence: string
  /** 4つの選択肢（A〜D の順） */
  choices: [string, string, string, string]
  /** 正解の添字（0〜3） */
  answer: number
  /** なぜその答えになるかの日本語解説 */
  explanation: string
  /** 完成後の英文の和訳 */
  translation: string
}

/** Part 7 の文書種別 */
export type Part7DocType =
  | "email"
  | "notice"
  | "advertisement"
  | "article"
  | "text-message"
  | "form"

export type Part7Question = {
  id: string
  question: string
  choices: [string, string, string, string]
  answer: number
  explanation: string
}

/** Part 7 の1文書（シングルパッセージ）とその設問 */
export type Part7Passage = {
  id: string
  docType: Part7DocType
  /** 文書の見出し（件名や広告タイトルなど） */
  title: string
  /** 宛先・日付などのヘッダー行。無い文書では空配列 */
  meta: { label: string; value: string }[]
  /** 本文。空行で段落を区切る */
  body: string
  /** 本文の和訳 */
  translation: string
  questions: Part7Question[]
}

/** 出題1件分。Part 5 と Part 7 を同じ器で扱う。 */
export type Item =
  | { kind: "part5"; id: string; question: Part5Question }
  | {
      kind: "part7"
      id: string
      passage: Part7Passage
      question: Part7Question
      /** パッセージ内での設問番号（1始まり） */
      indexInPassage: number
      questionCount: number
    }

/** 1問への回答結果 */
export type ItemResult = {
  itemId: string
  /** 選んだ選択肢の添字。時間切れなどで未選択なら null */
  selected: number | null
  correct: boolean
  /** 解答にかかった秒数 */
  seconds: number
}
