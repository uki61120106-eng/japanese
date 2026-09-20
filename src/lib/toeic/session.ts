import { ALL_PART7 } from "@/lib/toeic/content"
import { allItems, recordFor, type StudyLog } from "@/lib/toeic/srs"
import type { Item, Level, Part5Category, PhraseCategory } from "@/lib/toeic/types"

/** 復習メニュー1セットの上限問題数 */
export const REVIEW_LENGTH = 20

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
  levels: Level[]
  length: number
}

export function buildPart5Session(
  config: Part5Config,
  log: StudyLog,
  now: number
): Item[] {
  const categories = new Set(config.categories)
  const levels = new Set(config.levels)
  const candidates = allItems().filter(
    (item) =>
      item.kind === "part5" &&
      categories.has(item.question.category) &&
      levels.has(item.question.level)
  )
  return pickItems(candidates, log, now, config.length)
}

/**
 * Part 7 はセット単位で選ぶ。
 * 復習期限が来ている設問・未学習の設問を多く含むセットを優先する。
 */
export function buildPart7Session(
  levels: Level[],
  setCount: number,
  log: StudyLog,
  now: number
): Item[] {
  const wanted = new Set(levels)
  const scored = shuffled(ALL_PART7.filter((set) => wanted.has(set.level))).map(
    (set) => ({
      set,
      score: set.questions.reduce(
        (sum, question) =>
          sum + (priority(log, question.id, now) === 2 ? 0 : 1),
        0
      ),
    })
  )

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, setCount).flatMap(({ set }) =>
    set.questions.map((question, index) => ({
      kind: "part7" as const,
      id: question.id,
      set,
      question,
      indexInSet: index + 1,
      questionCount: set.questions.length,
    }))
  )
}

export type PhraseConfig = {
  categories: PhraseCategory[]
  length: number
}

export function buildPhraseSession(
  config: PhraseConfig,
  log: StudyLog,
  now: number
): Item[] {
  const categories = new Set(config.categories)
  const candidates = allItems().filter(
    (item) => item.kind === "phrase" && categories.has(item.card.category)
  )
  return pickItems(candidates, log, now, config.length)
}

/**
 * 復習セッション。Part 5・Part 7・フレーズの区別なく、
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
