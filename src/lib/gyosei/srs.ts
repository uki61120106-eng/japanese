import { addDays } from "@/lib/gyosei/dates"

/**
 * ライトナー方式の間隔反復。正解するたびに箱が1つ進み、出題間隔が延びる。
 * 間違えたら箱 0 に戻り、翌日にもう一度出る。
 */
export const INTERVAL_DAYS = [1, 1, 3, 7, 14, 30, 60] as const
export const MAX_BOX = INTERVAL_DAYS.length - 1
/** この箱以上を「定着」とみなす（2週間以上空けても正解できた状態） */
export const MASTERED_BOX = 4

export type CardState = {
  box: number
  due: string
  seen: number
  correct: number
  last: string
  /** 直近の回答が正解か */
  lastCorrect: boolean
}

export function review(
  card: CardState | undefined,
  correct: boolean,
  today: string
): CardState {
  const box = correct ? Math.min((card?.box ?? 0) + 1, MAX_BOX) : 0
  return {
    box,
    due: addDays(today, INTERVAL_DAYS[box]),
    seen: (card?.seen ?? 0) + 1,
    correct: (card?.correct ?? 0) + (correct ? 1 : 0),
    last: today,
    lastCorrect: correct,
  }
}
