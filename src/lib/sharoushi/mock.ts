import { QUESTIONS, type Question } from "@/lib/sharoushi/questions"
import { EXAM_GROUPS, type ExamGroupId } from "@/lib/sharoushi/subjects"
import { shuffled } from "@/lib/study"

export type MockQuestion = {
  group: ExamGroupId
  /** 5つの記述。誤っているものが1つだけ含まれる。 */
  options: Question[]
  /** 正解（誤っている記述）の位置 */
  answerIndex: number
}

export const MOCK_PER_GROUP = 2
/** 本試験の択一式は70問210分で、1問あたり3分 */
export const MOCK_MINUTES_PER_QUESTION = 3

/**
 * 合否の目安。本試験の択一式は例年、総得点がおおむね6割強、各科目区分が
 * 10問中4問以上（4割）が基準とされる。ここでは余裕を見て総得点7割を目標にする。
 */
export const MOCK_PASS_RATE = 0.7
export const MOCK_GROUP_MIN_RATE = 0.4

/**
 * 一問一答の記述を5つ束ねて「誤っているものはどれか」形式の問題を作る。
 * 同じ記述は1回の模試の中で2度使わない。
 */
export function buildMock(perGroup = MOCK_PER_GROUP): MockQuestion[] {
  const used = new Set<string>()
  const result: MockQuestion[] = []

  for (const group of EXAM_GROUPS) {
    const pool = QUESTIONS.filter((q) => group.subjects.includes(q.subject))
    for (let n = 0; n < perGroup; n++) {
      const falses = shuffled(pool.filter((q) => !q.answer && !used.has(q.id)))
      const trues = shuffled(pool.filter((q) => q.answer && !used.has(q.id)))
      if (falses.length < 1 || trues.length < 4) break

      const options = shuffled([falses[0], ...trues.slice(0, 4)])
      options.forEach((q) => used.add(q.id))
      result.push({
        group: group.id,
        options,
        answerIndex: options.findIndex((q) => !q.answer),
      })
    }
  }
  return result
}

export type MockScore = {
  correct: number
  total: number
  byGroup: Partial<Record<ExamGroupId, { correct: number; total: number }>>
  passed: boolean
  /** 足切りにかかった科目区分 */
  failedGroups: ExamGroupId[]
}

export function scoreMock(
  questions: MockQuestion[],
  picks: (number | null)[]
): MockScore {
  const byGroup: MockScore["byGroup"] = {}
  let correct = 0
  questions.forEach((q, i) => {
    const ok = picks[i] === q.answerIndex
    if (ok) correct++
    const g = byGroup[q.group] ?? { correct: 0, total: 0 }
    byGroup[q.group] = { correct: g.correct + (ok ? 1 : 0), total: g.total + 1 }
  })
  const failedGroups = (Object.keys(byGroup) as ExamGroupId[]).filter((id) => {
    const g = byGroup[id]!
    return g.correct / g.total < MOCK_GROUP_MIN_RATE
  })
  const total = questions.length
  return {
    correct,
    total,
    byGroup,
    failedGroups,
    passed: total > 0 && correct / total >= MOCK_PASS_RATE && failedGroups.length === 0,
  }
}
