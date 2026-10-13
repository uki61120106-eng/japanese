export type SubjectId = "kiso" | "kenpo" | "gyosei" | "minpo" | "shoho" | "chishiki"

/** ○×で答える一問一答。5肢択一の選択肢としても使い回す。 */
export type Statement = {
  id: string
  subject: SubjectId
  topic: string
  text: string
  /** 記述が正しければ true */
  answer: boolean
  explanation: string
}

/** 記述式（40字程度）。採点はキーワードの自己チェックで行う。 */
export type Kijutsu = {
  id: string
  subject: SubjectId
  topic: string
  prompt: string
  modelAnswer: string
  /** 配点の合計は 20 点 */
  keywords: { text: string; points: number }[]
}

export const BLANKS = ["ア", "イ", "ウ", "エ"] as const
export type Blank = (typeof BLANKS)[number]

/** 多肢選択式。本文中の {ア}〜{エ} を 20 個の語群から埋める。 */
export type Tashi = {
  id: string
  subject: SubjectId
  topic: string
  title: string
  passage: string
  answers: Record<Blank, string>
  /** 正解以外の語（正解と合わせて 20 個になるようにする） */
  distractors: string[]
}

export type Topic = {
  id: string
  name: string
  /** 学習の入口に読む要点 */
  points: string[]
}

export type Subject = {
  id: SubjectId
  name: string
  short: string
  topics: Topic[]
}
