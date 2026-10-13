import {
  KIJUTSU,
  STATEMENTS,
  SUBJECTS,
} from "@/lib/gyosei/content"
import { addDays, diffDays } from "@/lib/gyosei/dates"
import {
  topicsOfWeek,
  topicsUntil,
  type DayInfo,
  type Plan,
  type TopicRef,
} from "@/lib/gyosei/plan"
import { MASTERED_BOX } from "@/lib/gyosei/srs"
import type { AppState } from "@/lib/gyosei/store"
import type { Kijutsu, Statement, SubjectId } from "@/lib/gyosei/types"

/** Fisher-Yates。元の配列は変更しない。 */
export function shuffled<T>(items: readonly T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

const key = (ref: TopicRef) => `${ref.subject}.${ref.topic}`

function inTopics(refs: TopicRef[]) {
  const set = new Set(refs.map(key))
  return (item: Statement) => set.has(`${item.subject}.${item.topic}`)
}

/** 配点の大きい科目を先に（総復習で未出題の問題を拾う順） */
const SUBJECT_PRIORITY: SubjectId[] = [
  "gyosei",
  "minpo",
  "chishiki",
  "kenpo",
  "shoho",
  "kiso",
]

export type SessionKind = "daily" | "check" | "weak" | "topic"

export type QuizItem = { statement: Statement; isNew: boolean }

export type Session = {
  kind: SessionKind
  title: string
  topic: TopicRef | null
  items: QuizItem[]
  kijutsu: Kijutsu | null
}

function unseen(state: AppState, items: Statement[]): Statement[] {
  return items.filter((item) => !state.cards[item.id])
}

function dueItems(state: AppState, today: string): Statement[] {
  return STATEMENTS.filter((item) => {
    const card = state.cards[item.id]
    return card && card.due <= today
  }).sort((a, b) => {
    const ca = state.cards[a.id]
    const cb = state.cards[b.id]
    return ca.due === cb.due ? ca.box - cb.box : ca.due < cb.due ? -1 : 1
  })
}

/** 1日の学習セット：要点 → 新しい問題 → 復習。30分に収まる量にする。 */
export function buildDailySession(
  state: AppState,
  plan: Plan,
  info: DayInfo,
  today: string
): Session {
  const settings = state.settings!
  const mode = info.phase?.mode ?? "learn"
  const newLimit =
    mode === "final" ? Math.ceil(settings.newPerDay / 2) : settings.newPerDay

  // 新しい問題：今日の単元 → 同じフェーズの単元 → これまでの単元 の順に拾う
  let fresh: Statement[] = []
  if (mode === "learn" && info.topic) {
    const pools = [
      [info.topic],
      info.phase?.topics ?? [],
      topicsUntil(plan, info.dayNumber),
    ]
    for (const refs of pools) {
      const picked = new Set(fresh.map((item) => item.id))
      fresh.push(
        ...unseen(state, STATEMENTS.filter(inTopics(refs))).filter(
          (item) => !picked.has(item.id)
        )
      )
      if (fresh.length >= newLimit) break
    }
  } else {
    fresh = SUBJECT_PRIORITY.flatMap((subject) =>
      shuffled(unseen(state, STATEMENTS.filter((s) => s.subject === subject)))
    )
  }
  fresh = fresh.slice(0, newLimit)

  let reviews = dueItems(state, today).slice(0, settings.reviewCap)

  // 新規も復習も少ない日は、次に期日が来る問題を前倒しで解いて時間を使い切る
  const minimum = 15
  if (fresh.length + reviews.length < minimum) {
    const taken = new Set([...fresh, ...reviews].map((item) => item.id))
    const ahead = STATEMENTS.filter(
      (item) => state.cards[item.id] && !taken.has(item.id)
    ).sort((a, b) => (state.cards[a.id].due < state.cards[b.id].due ? -1 : 1))
    reviews = [...reviews, ...ahead.slice(0, minimum - fresh.length - reviews.length)]
  }

  return {
    kind: "daily",
    title: "今日の学習",
    topic: info.topic,
    items: [
      ...fresh.map((statement) => ({ statement, isNew: true })),
      ...shuffled(reviews).map((statement) => ({ statement, isNew: false })),
    ],
    kijutsu: pickKijutsu(state, info, today),
  }
}

/** 学習期は今日の単元の記述式を（2週間に1回まで）、総復習・直前期は毎日1問 */
function pickKijutsu(
  state: AppState,
  info: DayInfo,
  today: string
): Kijutsu | null {
  const mode = info.phase?.mode ?? "learn"
  if (mode !== "learn") {
    return KIJUTSU[info.dayNumber % KIJUTSU.length]
  }
  if (!info.topic) return null
  const candidate = KIJUTSU.find(
    (item) =>
      item.subject === info.topic!.subject && item.topic === info.topic!.topic
  )
  if (!candidate) return null
  const log = state.kijutsu[candidate.id]
  if (log && diffDays(log.date, today) < 14) return null
  return candidate
}

/** 週末の理解度チェック：その週の単元から15問 */
export function buildCheckSession(
  state: AppState,
  plan: Plan,
  info: DayInfo
): Session {
  const refs =
    info.phase?.mode === "learn"
      ? topicsOfWeek(plan, info.week)
      : topicsUntil(plan, info.dayNumber)
  const pool = STATEMENTS.filter(inTopics(refs))
  return {
    kind: "check",
    title: `第${info.week + 1}週 理解度チェック`,
    topic: null,
    items: shuffled(pool)
      .slice(0, 15)
      .map((statement) => ({ statement, isNew: !state.cards[statement.id] })),
    kijutsu: null,
  }
}

/** 苦手克服：直近で間違えた問題と正答率の低い問題 */
export function weakItems(state: AppState): Statement[] {
  return STATEMENTS.filter((item) => {
    const card = state.cards[item.id]
    return card && (!card.lastCorrect || card.correct / card.seen < 0.6)
  }).sort((a, b) => {
    const ca = state.cards[a.id]
    const cb = state.cards[b.id]
    return ca.correct / ca.seen - cb.correct / cb.seen
  })
}

export function buildWeakSession(state: AppState): Session {
  return {
    kind: "weak",
    title: "苦手克服",
    topic: null,
    items: shuffled(weakItems(state).slice(0, 20)).map((statement) => ({
      statement,
      isNew: false,
    })),
    kijutsu: null,
  }
}

export function buildTopicSession(state: AppState, ref: TopicRef): Session {
  const pool = STATEMENTS.filter(inTopics([ref]))
  return {
    kind: "topic",
    title: "単元演習",
    topic: ref,
    items: shuffled(pool).map((statement) => ({
      statement,
      isNew: !state.cards[statement.id],
    })),
    kijutsu: null,
  }
}

export type Mastery = {
  total: number
  seen: number
  mastered: number
  answered: number
  correct: number
}

function mastery(state: AppState, items: Statement[]): Mastery {
  const result: Mastery = {
    total: items.length,
    seen: 0,
    mastered: 0,
    answered: 0,
    correct: 0,
  }
  for (const item of items) {
    const card = state.cards[item.id]
    if (!card) continue
    result.seen += 1
    result.answered += card.seen
    result.correct += card.correct
    if (card.box >= MASTERED_BOX) result.mastered += 1
  }
  return result
}

export function subjectMastery(state: AppState) {
  return SUBJECTS.map((subject) => ({
    subject,
    total: mastery(
      state,
      STATEMENTS.filter((item) => item.subject === subject.id)
    ),
    topics: subject.topics.map((topic) => ({
      topic,
      mastery: mastery(
        state,
        STATEMENTS.filter(
          (item) => item.subject === subject.id && item.topic === topic.id
        )
      ),
    })),
  }))
}

export function overallMastery(state: AppState): Mastery {
  return mastery(state, STATEMENTS)
}

/** 今日から遡って、学習セットをやり終えた日が何日続いているか */
export function streak(state: AppState, today: string): number {
  // 今日まだ終えていなくても、昨日までの連続は数える
  let date = state.days[today]?.done ? today : addDays(today, -1)
  let count = 0
  while (state.days[date]?.done) {
    count += 1
    date = addDays(date, -1)
  }
  return count
}
