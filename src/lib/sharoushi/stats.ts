import { addDays, type DateKey } from "@/lib/sharoushi/dates"
import { QUESTIONS, type Question } from "@/lib/sharoushi/questions"
import { MASTERED_BOX, type CardState } from "@/lib/sharoushi/srs"
import type { DayLog } from "@/lib/sharoushi/store"
import { SUBJECTS, type SubjectId } from "@/lib/sharoushi/subjects"

/** 今日まで（今日がまだなら昨日まで）続けて学習した日数 */
export function streakDays(log: Record<DateKey, DayLog>, today: DateKey): number {
  const studied = (day: DateKey) => (log[day]?.answered ?? 0) > 0
  let day = studied(today) ? today : addDays(today, -1)
  let count = 0
  while (studied(day)) {
    count++
    day = addDays(day, -1)
  }
  return count
}

export type SubjectStats = {
  subject: SubjectId
  total: number
  seen: number
  mastered: number
  correct: number
  wrong: number
}

export function subjectStats(cards: Record<string, CardState>): SubjectStats[] {
  return SUBJECTS.map((subject) => {
    const questions = QUESTIONS.filter((q) => q.subject === subject.id)
    const stats: SubjectStats = {
      subject: subject.id,
      total: questions.length,
      seen: 0,
      mastered: 0,
      correct: 0,
      wrong: 0,
    }
    for (const q of questions) {
      const card = cards[q.id]
      if (!card) continue
      stats.seen++
      if (card.box >= MASTERED_BOX) stats.mastered++
      stats.correct += card.correct
      stats.wrong += card.wrong
    }
    return stats
  })
}

/** 間違えた回数が多く、まだ定着していない問題 */
export function weakQuestions(
  cards: Record<string, CardState>,
  limit = 10
): Question[] {
  return QUESTIONS.filter((q) => {
    const card = cards[q.id]
    return card && card.wrong > 0 && card.box < MASTERED_BOX
  })
    .sort((a, b) => {
      const ca = cards[a.id]
      const cb = cards[b.id]
      return cb.wrong - ca.wrong || ca.box - cb.box
    })
    .slice(0, limit)
}

/** 直近の回答で間違えた問題 */
export function lastWrongQuestions(cards: Record<string, CardState>): Question[] {
  return QUESTIONS.filter((q) => cards[q.id]?.lastWrong)
}
