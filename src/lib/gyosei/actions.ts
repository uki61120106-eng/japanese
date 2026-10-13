import type { MockDraft, MockRecord } from "@/lib/gyosei/mock"
import { review } from "@/lib/gyosei/srs"
import { updateState, type DayLog, type Settings } from "@/lib/gyosei/store"

const emptyDay: DayLog = { answered: 0, correct: 0, seconds: 0, done: false }

export function saveSettings(settings: Settings) {
  updateState((state) => ({ ...state, settings }))
}

/** 一問一答の回答を間隔反復と日別の記録に反映する */
export function recordAnswer(
  statementId: string,
  correct: boolean,
  today: string,
  seconds: number
) {
  updateState((state) => {
    const day = state.days[today] ?? emptyDay
    return {
      ...state,
      cards: {
        ...state.cards,
        [statementId]: review(state.cards[statementId], correct, today),
      },
      days: {
        ...state.days,
        [today]: {
          ...day,
          answered: day.answered + 1,
          correct: day.correct + (correct ? 1 : 0),
          seconds: day.seconds + seconds,
        },
      },
    }
  })
}

export function addStudySeconds(today: string, seconds: number) {
  updateState((state) => {
    const day = state.days[today] ?? emptyDay
    return {
      ...state,
      days: { ...state.days, [today]: { ...day, seconds: day.seconds + seconds } },
    }
  })
}

export function markDayDone(today: string) {
  updateState((state) => ({
    ...state,
    days: {
      ...state.days,
      [today]: { ...(state.days[today] ?? emptyDay), done: true },
    },
  }))
}

export function recordCheck(week: number, today: string, correct: number, total: number) {
  updateState((state) => ({
    ...state,
    checks: [
      ...state.checks.filter((check) => check.week !== week),
      { week, date: today, correct, total },
    ].sort((a, b) => a.week - b.week),
  }))
}

export function recordKijutsu(id: string, score: number, today: string) {
  updateState((state) => ({
    ...state,
    kijutsu: {
      ...state.kijutsu,
      [id]: {
        last: score,
        best: Math.max(score, state.kijutsu[id]?.best ?? 0),
        date: today,
      },
    },
  }))
}

export function saveDraft(draft: MockDraft | null) {
  updateState((state) => ({ ...state, draft }))
}

/** 模試の結果を残し、間違えた肢を翌日の復習に回す */
export function finishMock(
  record: MockRecord,
  missed: string[],
  kijutsuScores: { id: string; score: number }[],
  today: string
) {
  updateState((state) => {
    const cards = { ...state.cards }
    for (const id of missed) cards[id] = review(cards[id], false, today)
    const kijutsu = { ...state.kijutsu }
    for (const { id, score } of kijutsuScores) {
      kijutsu[id] = {
        last: score,
        best: Math.max(score, kijutsu[id]?.best ?? 0),
        date: today,
      }
    }
    return {
      ...state,
      cards,
      kijutsu,
      draft: null,
      mocks: [...state.mocks, record],
    }
  })
}
