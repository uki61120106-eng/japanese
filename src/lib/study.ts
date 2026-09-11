import { getKana, type Kana, type RowId, type Script } from "@/lib/kana"

export type Answer = "known" | "unknown"

export type StudyConfig = {
  script: Script
  rows: RowId[]
  shuffle: boolean
}

/** Fisher-Yates。元の配列は変更しない。 */
export function shuffled<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function buildDeck(config: StudyConfig): Kana[] {
  const rows = new Set(config.rows)
  const deck = getKana(config.script).filter((kana) => rows.has(kana.row))
  return config.shuffle ? shuffled(deck) : deck
}

export function countKnown(answers: Record<string, Answer>): number {
  return Object.values(answers).filter((a) => a === "known").length
}

export function wrongCards(
  deck: Kana[],
  answers: Record<string, Answer>
): Kana[] {
  return deck.filter((kana) => answers[kana.id] === "unknown")
}
