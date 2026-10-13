/**
 * TOEIC 学習パートの型定義。
 *
 * 問題文・選択肢・解説はすべてこのリポジトリ用に書き下ろした自作問題。
 * 公式問題集や市販教材からの転載はしていない。
 */

/** 問題文中の空所を表すトークン。表示時にこの文字列で分割する。 */
export const BLANK = "____"

/**
 * 難易度帯。
 * core     … 600〜730 点帯。土台づくり
 * advanced … 730〜860 点帯。800 点をねらうための上積み
 */
export type Level = "core" | "advanced"

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
  level: Level
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
  | "schedule"
  | "review"

/** Part 7 の文書1通 */
export type Part7Document = {
  docType: Part7DocType
  /** 文書の見出し（件名や広告タイトルなど） */
  title: string
  /** 宛先・日付などのヘッダー行。無い文書では空配列 */
  meta: { label: string; value: string }[]
  /** 本文。空行で段落を区切る */
  body: string
  /** 本文の和訳 */
  translation: string
}

export type Part7Question = {
  id: string
  question: string
  choices: [string, string, string, string]
  answer: number
  explanation: string
}

/**
 * Part 7 の1セット。
 * documents が1通ならシングルパッセージ、2通以上ならマルチプルパッセージ。
 * 後者は2通の情報を突き合わせないと解けない設問を含み、800 点帯の要になる。
 */
export type Part7Set = {
  id: string
  level: Level
  documents: Part7Document[]
  questions: Part7Question[]
}

/** フレーズカードの分類 */
export type PhraseCategory =
  | "verb-noun"
  | "verb-prep"
  | "adj-prep"
  | "prep-phrase"
  | "business"
  | "noun-phrase"

/** 覚えるフレーズ1枚分 */
export type PhraseCard = {
  id: string
  category: PhraseCategory
  /** カードの表に出すフレーズ */
  phrase: string
  /** 日本語の意味 */
  meaning: string
  /** 使い方が分かる例文 */
  example: string
  /** 例文の和訳 */
  exampleTranslation: string
  /** 紛らわしい語との違いなど。無い場合もある */
  note?: string
}

/** 出題1件分。4択問題とフレーズカードを同じ器で扱う。 */
export type Item =
  | { kind: "part5"; id: string; question: Part5Question }
  | {
      kind: "part7"
      id: string
      set: Part7Set
      question: Part7Question
      /** セット内での設問番号（1始まり） */
      indexInSet: number
      questionCount: number
    }
  | { kind: "phrase"; id: string; card: PhraseCard }

/** 1問への回答結果 */
export type ItemResult = {
  itemId: string
  /**
   * 選んだ選択肢の添字。
   * フレーズカードでは「おぼえてた」を1、「あやふや」を0として記録する。
   */
  selected: number | null
  correct: boolean
  /** 解答にかかった秒数 */
  seconds: number
}
