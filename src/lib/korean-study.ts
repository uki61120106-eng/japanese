import { WORDS, type CategoryId, type Word } from "@/lib/korean"
import { shuffled } from "@/lib/study"

/** カード（めくって覚える）か、クイズ（4択で答える）か */
export type Mode = "card" | "quiz"

/** 出題の向き。ko-ja はハングルを見て意味を答える、ja-ko はその逆 */
export type Direction = "ko-ja" | "ja-ko"

export type WordStudyConfig = {
  categories: CategoryId[]
  shuffle: boolean
}

export type QuizQuestion = {
  word: Word
  /** 4つの選択肢。正解は必ず1つだけ入っている */
  choices: Word[]
}

export function buildDeck(config: WordStudyConfig): Word[] {
  const categories = new Set(config.categories)
  const deck = WORDS.filter((word) => categories.has(word.category))
  return config.shuffle ? shuffled(deck) : deck
}

/**
 * 各語に選択肢を割り当てる。まぎらわしいダミーを出したいので、同じカテゴリの語を
 * 優先して選ぶ。意味が重なる語（감사합니다 と 고맙습니다 など）は、正解がふたつに
 * なってしまうため候補から外す。
 */
export function buildQuiz(deck: Word[], size = 4): QuizQuestion[] {
  return deck.map((word) => {
    const candidates = WORDS.filter(
      (other) => other.id !== word.id && other.meaning !== word.meaning
    )
    const ordered = [
      ...shuffled(candidates.filter((other) => other.category === word.category)),
      ...shuffled(candidates.filter((other) => other.category !== word.category)),
    ]

    const distractors: Word[] = []
    const usedMeanings = new Set([word.meaning])
    for (const candidate of ordered) {
      if (distractors.length === size - 1) break
      if (usedMeanings.has(candidate.meaning)) continue
      usedMeanings.add(candidate.meaning)
      distractors.push(candidate)
    }

    return { word, choices: shuffled([word, ...distractors]) }
  })
}

/** 出題の向きに応じて、問題として見せる文字列を返す */
export function questionText(word: Word, direction: Direction): string {
  return direction === "ko-ja" ? word.hangul : word.meaning
}

/** 出題の向きに応じて、答えとして見せる文字列を返す */
export function answerText(word: Word, direction: Direction): string {
  return direction === "ko-ja" ? word.meaning : word.hangul
}
