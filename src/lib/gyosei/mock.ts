import {
  KIJUTSU,
  STATEMENTS,
  STATEMENT_MAP,
  SUBJECT_MAP,
  TASHI,
  topicName,
} from "@/lib/gyosei/content"
import {
  EXAM_MINUTES,
  EXAM_SECTIONS,
  PASS_LINE,
  POINTS,
} from "@/lib/gyosei/exam"
import { shuffled } from "@/lib/gyosei/session"
import {
  BLANKS,
  type Blank,
  type Statement,
  type SubjectId,
} from "@/lib/gyosei/types"

export type MockKind = "mini" | "full"

export type Choice5Question = {
  kind: "choice5"
  subject: SubjectId
  /** 「正しいもの」を選ぶか「誤っているもの」を選ぶか */
  polarity: "correct" | "wrong"
  header: string
  options: string[]
  answerIndex: number
}

export type TashiQuestion = {
  kind: "tashi"
  subject: SubjectId
  id: string
  /** 20語を並べ替えたもの */
  choices: string[]
}

export type KijutsuQuestion = { kind: "kijutsu"; subject: SubjectId; id: string }

export type MockQuestion = Choice5Question | TashiQuestion | KijutsuQuestion

export type MockAnswer = {
  choice?: number
  blanks?: Partial<Record<Blank, string>>
  text?: string
  /** 記述式で自己採点したキーワードの番号 */
  checked?: number[]
}

export type MockDraft = {
  id: string
  kind: MockKind
  startedAt: string
  questions: MockQuestion[]
  answers: MockAnswer[]
  elapsedSec: number
  limitSec: number
}

export type MockRecord = {
  id: string
  kind: MockKind
  date: string
  seconds: number
  law: number
  lawMax: number
  general: number
  generalMax: number
  bySubject: Partial<Record<SubjectId, { score: number; max: number }>>
  /** 300点満点に換算した点数（ミニ模試は目安） */
  scaledTotal: number
  passed: boolean
}

const MINI_CHOICE5: Partial<Record<SubjectId, number>> = {
  kiso: 1,
  kenpo: 2,
  gyosei: 5,
  minpo: 3,
  shoho: 1,
  chishiki: 3,
}
export const MINI_MINUTES = 30

function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * 一問一答から5肢択一を組み立てる。
 * 「正しいもの」なら正しい記述1つ＋誤った記述4つ、「誤っているもの」はその逆。
 * できるだけ同じ単元から、まだこの模試で使っていない記述を選ぶ。
 */
function makeChoice5(
  subject: SubjectId,
  used: Set<string>
): Choice5Question | null {
  const pool = STATEMENTS.filter((item) => item.subject === subject)
  const fresh = pool.filter((item) => !used.has(item.id))

  for (const polarity of shuffled(["correct", "wrong"] as const)) {
    const oddAnswer = polarity === "correct"
    const groups = new Map<string, Statement[]>()
    for (const item of fresh) {
      groups.set(item.topic, [...(groups.get(item.topic) ?? []), item])
    }
    const candidates: { items: Statement[]; topic: string | null }[] = [
      ...shuffled([...groups.entries()]).map(([topic, items]) => ({
        items,
        topic,
      })),
      { items: fresh, topic: null },
      { items: pool, topic: null },
    ]
    for (const { items, topic } of candidates) {
      const odd = items.filter((item) => item.answer === oddAnswer)
      const rest = items.filter((item) => item.answer !== oddAnswer)
      if (odd.length < 1 || rest.length < 4) continue

      const answer = pickOne(odd)
      const options = shuffled([answer, ...shuffled(rest).slice(0, 4)])
      options.forEach((item) => used.add(item.id))
      const about = topic ? topicName(subject, topic) : SUBJECT_MAP[subject].name
      return {
        kind: "choice5",
        subject,
        polarity,
        header: `${about}に関する次の記述のうち、${
          polarity === "correct" ? "正しいもの" : "誤っているもの"
        }はどれか。`,
        options: options.map((item) => item.id),
        answerIndex: options.indexOf(answer),
      }
    }
  }
  return null
}

function makeTashi(subject: SubjectId, count: number): TashiQuestion[] {
  return shuffled(TASHI.filter((item) => item.subject === subject))
    .slice(0, count)
    .map((item) => ({
      kind: "tashi",
      subject,
      id: item.id,
      choices: shuffled([...Object.values(item.answers), ...item.distractors]),
    }))
}

function makeKijutsu(subject: SubjectId, count: number): KijutsuQuestion[] {
  return shuffled(KIJUTSU.filter((item) => item.subject === subject))
    .slice(0, count)
    .map((item) => ({ kind: "kijutsu", subject, id: item.id }))
}

export function buildMock(kind: MockKind, today: string): MockDraft {
  const used = new Set<string>()
  const choice5: MockQuestion[] = []
  const tashi: MockQuestion[] = []
  const kijutsu: MockQuestion[] = []

  for (const section of EXAM_SECTIONS) {
    const count =
      kind === "full" ? section.choice5 : (MINI_CHOICE5[section.subject] ?? 0)
    for (let i = 0; i < count; i++) {
      const question = makeChoice5(section.subject, used)
      if (question) choice5.push(question)
    }
    if (kind === "full") {
      tashi.push(...makeTashi(section.subject, section.tashi))
      kijutsu.push(...makeKijutsu(section.subject, section.kijutsu))
    }
  }

  // 本試験と同じく、法令の5肢択一 → 多肢選択 → 記述式 → 基礎知識 の順に並べる
  const law = choice5.filter((q) => q.subject !== "chishiki")
  const general = choice5.filter((q) => q.subject === "chishiki")
  const questions = [...law, ...tashi, ...kijutsu, ...general]

  return {
    id: `${kind}-${Date.now()}`,
    kind,
    startedAt: today,
    questions,
    answers: questions.map(() => ({})),
    elapsedSec: 0,
    limitSec: (kind === "full" ? EXAM_MINUTES : MINI_MINUTES) * 60,
  }
}

export function questionScore(
  question: MockQuestion,
  answer: MockAnswer
): { score: number; max: number } {
  if (question.kind === "choice5") {
    return {
      score: answer.choice === question.answerIndex ? POINTS.choice5 : 0,
      max: POINTS.choice5,
    }
  }
  if (question.kind === "tashi") {
    const data = TASHI.find((item) => item.id === question.id)!
    const hits = BLANKS.filter(
      (blank) => answer.blanks?.[blank] === data.answers[blank]
    ).length
    return {
      score: hits * POINTS.tashiBlank,
      max: BLANKS.length * POINTS.tashiBlank,
    }
  }
  const data = KIJUTSU.find((item) => item.id === question.id)!
  const score = (answer.checked ?? []).reduce(
    (sum, index) => sum + (data.keywords[index]?.points ?? 0),
    0
  )
  return { score: Math.min(score, POINTS.kijutsu), max: POINTS.kijutsu }
}

export function scoreMock(draft: MockDraft, date: string): MockRecord {
  const bySubject: MockRecord["bySubject"] = {}
  let law = 0
  let lawMax = 0
  let general = 0
  let generalMax = 0

  draft.questions.forEach((question, index) => {
    const { score, max } = questionScore(question, draft.answers[index])
    const entry = bySubject[question.subject] ?? { score: 0, max: 0 }
    entry.score += score
    entry.max += max
    bySubject[question.subject] = entry
    if (question.subject === "chishiki") {
      general += score
      generalMax += max
    } else {
      law += score
      lawMax += max
    }
  })

  // ミニ模試は問題数が少ないので、正答率を本試験の配点に当てはめて換算する
  const lawScaled = lawMax ? (law / lawMax) * PASS_LINE.lawMax : 0
  const generalScaled = generalMax
    ? (general / generalMax) * PASS_LINE.generalMax
    : 0
  const scaledTotal = Math.round(lawScaled + generalScaled)
  const passed =
    lawScaled >= PASS_LINE.law &&
    generalScaled >= PASS_LINE.general &&
    scaledTotal >= PASS_LINE.total

  return {
    id: draft.id,
    kind: draft.kind,
    date,
    seconds: draft.elapsedSec,
    law,
    lawMax,
    general,
    generalMax,
    bySubject,
    scaledTotal,
    passed,
  }
}

/** 5肢択一で間違えた問題の、正解肢と選んだ肢（復習に回す記述） */
export function missedStatements(draft: MockDraft): string[] {
  const ids = new Set<string>()
  draft.questions.forEach((question, index) => {
    if (question.kind !== "choice5") return
    const choice = draft.answers[index].choice
    if (choice === question.answerIndex) return
    ids.add(question.options[question.answerIndex])
    if (choice !== undefined) ids.add(question.options[choice])
  })
  return [...ids].filter((id) => STATEMENT_MAP.has(id))
}
