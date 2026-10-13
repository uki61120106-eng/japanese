import { addDays, daysBetween, type DateKey } from "@/lib/sharoushi/dates"
import { QUESTIONS, type Question } from "@/lib/sharoushi/questions"
import { MASTERED_BOX, isDue, type CardState } from "@/lib/sharoushi/srs"
import { SUBJECTS, type SubjectId } from "@/lib/sharoushi/subjects"

export type PhaseKind = "input" | "output" | "final"

export type PlanBlock = {
  kind: PhaseKind
  title: string
  description: string
  start: DateKey
  /** この日を含む */
  end: DateKey
  /** インプット期の重点科目 */
  focus?: SubjectId
}

export const PHASE_LABEL: Record<PhaseKind, string> = {
  input: "インプット期",
  output: "アウトプット期",
  final: "直前期",
}

/**
 * 学習開始日から試験前日までを3期に分ける。
 * - 直前期: 最後の約8週間。模試と総復習
 * - アウトプット期: その前の約12週間。全科目を横断して問題演習
 * - インプット期: 残り。科目を1つずつ、条文量に応じた日数で回す
 * 期間が短い場合は比率（15% / 25%）で縮める。
 */
export function buildPlan(startDate: DateKey, examDate: DateKey): PlanBlock[] {
  const total = daysBetween(startDate, examDate)
  if (total <= 0) return []

  const finalDays = Math.min(56, Math.round(total * 0.15))
  const outputDays = Math.min(84, Math.round(total * 0.25))
  const inputDays = total - finalDays - outputDays
  const lastDay = addDays(examDate, -1)

  const blocks: PlanBlock[] = []
  const weightSum = SUBJECTS.reduce((sum, s) => sum + s.weight, 0)
  let cursor = startDate
  let used = 0
  SUBJECTS.forEach((subject, i) => {
    const isLast = i === SUBJECTS.length - 1
    const days = isLast
      ? inputDays - used
      : Math.max(1, Math.round((inputDays * subject.weight) / weightSum))
    if (days <= 0) return
    blocks.push({
      kind: "input",
      title: subject.name,
      description: "新しい論点を毎日10問ずつ。前の科目は復習で回す",
      start: cursor,
      end: addDays(cursor, days - 1),
      focus: subject.id,
    })
    cursor = addDays(cursor, days)
    used += days
  })

  if (outputDays > 0) {
    blocks.push({
      kind: "output",
      title: "全科目の横断演習",
      description: "未着手・苦手な問題を優先し、科目をまたいで解く",
      start: cursor,
      end: addDays(cursor, outputDays - 1),
    })
    cursor = addDays(cursor, outputDays)
  }

  blocks.push({
    kind: "final",
    title: "模試と総仕上げ",
    description: "週1回のミニ模試と、間違えた問題のつぶし込み",
    start: cursor,
    end: lastDay,
  })
  return blocks
}

export function currentBlock(
  plan: PlanBlock[],
  today: DateKey
): PlanBlock | undefined {
  return plan.find((block) => block.start <= today && today <= block.end)
}

/** 1日の新規問題数と、復習の上限。合わせて30分に収まる量にしている。 */
export const NEW_PER_DAY = 10
export const REVIEW_CAP = 15
/** 1問あたりの目安（問題文・解説を読む時間を含む） */
export const MINUTES_PER_QUESTION = 1.2

export type DailyMenu = {
  review: Question[]
  fresh: Question[]
}

export function dueQuestions(
  cards: Record<string, CardState>,
  today: DateKey
): Question[] {
  return QUESTIONS.filter((q) => {
    const card = cards[q.id]
    return card !== undefined && isDue(card, today)
  }).sort((a, b) => {
    const ca = cards[a.id]
    const cb = cards[b.id]
    return ca.due.localeCompare(cb.due) || ca.box - cb.box
  })
}

export function freshCountOn(
  cards: Record<string, CardState>,
  day: DateKey
): number {
  return Object.values(cards).filter((card) => card.first === day).length
}

export function buildDailyMenu(
  cards: Record<string, CardState>,
  plan: PlanBlock[],
  today: DateKey
): DailyMenu {
  const freshDoneToday = freshCountOn(cards, today)
  const review = dueQuestions(cards, today).slice(0, REVIEW_CAP)
  const unseen = QUESTIONS.filter((q) => cards[q.id] === undefined)
  const block = currentBlock(plan, today)

  let ordered: Question[]
  if (block?.kind === "input" && block.focus) {
    // 重点科目 → すでに学んだ科目 → これからの科目 の順
    const order = SUBJECTS.map((s) => s.id)
    const focusIndex = order.indexOf(block.focus)
    const rank = (q: Question) => {
      const i = order.indexOf(q.subject)
      if (i === focusIndex) return 0
      return i < focusIndex ? 1 : 2
    }
    ordered = [...unseen].sort((a, b) => rank(a) - rank(b))
  } else {
    ordered = unseen
  }

  const remaining = Math.max(0, NEW_PER_DAY - freshDoneToday)
  let fresh = ordered.slice(0, remaining)

  // 全問に手を付けたら、定着していない問題を前倒しで出す
  if (fresh.length < remaining) {
    const reviewIds = new Set(review.map((q) => q.id))
    const weak = QUESTIONS.filter((q) => {
      const card = cards[q.id]
      return card && !reviewIds.has(q.id) && card.box < MASTERED_BOX && card.last !== today
    }).sort((a, b) => cards[a.id].box - cards[b.id].box)
    fresh = [...fresh, ...weak.slice(0, remaining - fresh.length)]
  }

  return { review, fresh }
}

export function estimateMinutes(count: number): number {
  return Math.ceil(count * MINUTES_PER_QUESTION)
}
