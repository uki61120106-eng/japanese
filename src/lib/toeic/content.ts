import { PART5_ADVANCED } from "@/lib/toeic/part5-advanced"
import { PART5_QUESTIONS } from "@/lib/toeic/part5-questions"
import { PART7_ADVANCED } from "@/lib/toeic/part7-advanced"
import { PART7_SETS } from "@/lib/toeic/part7-sets"
import { PHRASE_CARDS } from "@/lib/toeic/phrases"
import type { Part5Question, Part7Set, PhraseCard } from "@/lib/toeic/types"

/**
 * 収録コンテンツのまとめ口。
 * 難易度帯ごとにファイルを分けているので、使う側はここから取る。
 */
export const ALL_PART5: Part5Question[] = [...PART5_QUESTIONS, ...PART5_ADVANCED]
export const ALL_PART7: Part7Set[] = [...PART7_SETS, ...PART7_ADVANCED]
export const ALL_PHRASES: PhraseCard[] = PHRASE_CARDS

export const CONTENT_COUNTS = {
  part5: ALL_PART5.length,
  part7Sets: ALL_PART7.length,
  part7Questions: ALL_PART7.reduce((sum, set) => sum + set.questions.length, 0),
  phrases: ALL_PHRASES.length,
}
