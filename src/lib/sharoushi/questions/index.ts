import type { SubjectId } from "@/lib/sharoushi/subjects"

import { anei } from "./anei"
import { choshu } from "./choshu"
import { kenpo } from "./kenpo"
import { kokunen } from "./kokunen"
import { kounen } from "./kounen"
import { koyou } from "./koyou"
import { roiti } from "./roiti"
import { rouki } from "./rouki"
import { rousai } from "./rousai"
import { shaiti } from "./shaiti"
import type { Entry } from "./types"

export type Question = {
  /** 学習記録のキー。内容を書き換えても ID は変えないこと。 */
  id: string
  subject: SubjectId
  /** 一問一答の問題文。○か×で答える。 */
  statement: string
  /** 問題文が正しければ true */
  answer: boolean
  explanation: string
  /** 根拠条文など */
  basis: string
}

/**
 * 収録問題の前提とした法令の時点。
 * 改正があったら問題文・解説を見直してこの日付を更新する。
 */
export const LAW_AS_OF = "2026年4月1日"

const BANK: Record<SubjectId, Entry[]> = {
  rouki,
  anei,
  rousai,
  koyou,
  choshu,
  roiti,
  shaiti,
  kenpo,
  kounen,
  kokunen,
}

export const QUESTIONS: Question[] = Object.entries(BANK).flatMap(
  ([subject, entries]) =>
    entries.map(([id, answer, statement, explanation, basis]) => ({
      id,
      subject: subject as SubjectId,
      statement,
      answer,
      explanation,
      basis,
    }))
)

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]))

export function getQuestion(id: string): Question | undefined {
  return BY_ID.get(id)
}
