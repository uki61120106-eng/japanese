import { addDays, type DateKey } from "@/lib/sharoushi/dates"

/**
 * 間隔反復（ライトナー方式）。正解するたびに箱が1つ進み、次に出す日が延びる。
 * 間違えたら箱0に戻して翌日に出し直す。
 */
export const INTERVAL_DAYS = [1, 3, 7, 14, 30, 60] as const

/** 最後の箱まで進んだ問題を「定着」とみなす */
export const MASTERED_BOX = INTERVAL_DAYS.length - 1

export type CardState = {
  box: number
  due: DateKey
  correct: number
  wrong: number
  /** 初めて解いた日 */
  first: DateKey
  /** 最後に解いた日 */
  last: DateKey
  /** 直近の回答が不正解だったか */
  lastWrong: boolean
}

export function nextCardState(
  prev: CardState | undefined,
  isCorrect: boolean,
  today: DateKey
): CardState {
  const box = isCorrect
    ? Math.min((prev?.box ?? -1) + 1, MASTERED_BOX)
    : 0
  return {
    box,
    due: addDays(today, isCorrect ? INTERVAL_DAYS[box] : 1),
    correct: (prev?.correct ?? 0) + (isCorrect ? 1 : 0),
    wrong: (prev?.wrong ?? 0) + (isCorrect ? 0 : 1),
    first: prev?.first ?? today,
    last: today,
    lastWrong: !isCorrect,
  }
}

export function isDue(card: CardState, today: DateKey): boolean {
  return card.due <= today
}
