import { PART7_PASSAGES } from "@/lib/toeic/part7-passages"
import { allItems, recordFor, type StudyLog } from "@/lib/toeic/srs"
import type { Item, Part5Category } from "@/lib/toeic/types"

/** Fisher-Yates。元の配列は変更しない。 */
export function shuffled<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

/**
 * 出題の優先順位。小さいほど先に選ばれる。
 * 0: 復習期限が来ている  1: 未学習  2: まだ期限が来ていない
 */
function priority(log: StudyLog, id: string, now: number): number {
  const record = log.records[id]
  if (!record) return 1
  return record.due <= now ? 0 : 2
}

function pickItems(
  candidates: Item[],
  log: StudyLog,
  now: number,
  length: number
): Item[] {
  // 同順位の中では期限が古い順。未学習どうしはランダムに散らす。
  const ordered = shuffled(candidates).sort((a, b) => {
    const diff = priority(log, a.id, now) - priority(log, b.id, now)
    if (diff !== 0) return diff
    return recordFor(log, a.id).due - recordFor(log, b.id).due
  })

  return shuffled(ordered.slice(0, length))
}

export type Part5Config = {
  categories: Part5Category[]
  length: number
}

export function buildPart5Session(
  config: Part5Config,
  log: StudyLog,
  now: number
): Item[] {
  const selected = new Set(config.categories)
  const candidates = allItems().filter(
    (item) => item.kind === "part5" && selected.has(item.question.category)
  )
  return pickItems(candidates, log, now, config.length)
}

/**
 * Part 7 はパッセージ単位で選ぶ。
 * 復習期限が来ている設問・未学習の設問を多く含むパッセージを優先する。
 */
export function buildPart7Session(
  passageCount: number,
  log: StudyLog,
  now: number
): Item[] {
  const scored = shuffled(PART7_PASSAGES).map((passage) => ({
    passage,
    score: passage.questions.reduce(
      (sum, question) =>
        sum + (priority(log, question.id, now) === 2 ? 0 : 1),
      0
    ),
  }))

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, passageCount).flatMap(({ passage }) =>
    passage.questions.map((question, index) => ({
      kind: "part7" as const,
      id: question.id,
      passage,
      question,
      indexInPassage: index + 1,
      questionCount: passage.questions.length,
    }))
  )
}

/**
 * 復習セッション。Part 5 と Part 7 の区別なく、
 * 期限が来ている問題だけを古い順に集める。
 */
export function buildReviewSession(
  length: number,
  log: StudyLog,
  now: number
): Item[] {
  const due = allItems()
    .filter((item) => {
      const record = log.records[item.id]
      return record !== undefined && record.due <= now
    })
    .sort((a, b) => recordFor(log, a.id).due - recordFor(log, b.id).due)

  return shuffled(due.slice(0, length))
}

/** 復習メニュー1セットの上限問題数 */
export const REVIEW_LENGTH = 20
