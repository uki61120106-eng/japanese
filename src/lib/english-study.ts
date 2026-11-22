import { PHRASES, type Phrase, type SceneId } from "@/lib/phrases"
import { shuffled } from "@/lib/shuffle"

/**
 * 練習モード。
 * - stream: 手を使わず、英語と訳を続けて読み上げ続ける（聞き流し）
 * - listen: カードをめくって、読み上げを聞きながら覚える
 * - speak:  カードに加えて、音声認識で発音をチェックする
 */
export type Mode = "stream" | "listen" | "speak"

export type Answer = "known" | "unknown"

export type StudyConfig = {
  scenes: SceneId[]
  shuffle: boolean
}

export function buildDeck(config: StudyConfig): Phrase[] {
  const scenes = new Set(config.scenes)
  const deck = PHRASES.filter((phrase) => scenes.has(phrase.scene))
  return config.shuffle ? shuffled(deck) : deck
}

export function countKnown(answers: Record<string, Answer>): number {
  return Object.values(answers).filter((a) => a === "known").length
}

export function wrongPhrases(
  deck: Phrase[],
  answers: Record<string, Answer>
): Phrase[] {
  return deck.filter((phrase) => answers[phrase.id] === "unknown")
}
