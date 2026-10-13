import type { CardState } from "@/lib/sharoushi/srs"
import type { StudyData } from "@/lib/sharoushi/store"

/**
 * 端末間同期のための、記録の符号化と統合。
 *
 * スマホと PC で別々に解いた記録を、どちらも失わないように統合する。
 * - 問題ごとの記録: 解いた回数が多い方（同じなら最後に解いた日が新しい方）
 * - 日ごとの学習時間・問題数: それぞれ大きい方
 * - 模試の記録: 両方を合わせる（同じ記録は1つに）
 * - 確認状況・設定: 最後に更新した端末の方
 * - 記録の消去: 消去より前の記録は統合しない
 */
export function mergeStudyData(a: StudyData, b: StudyData): StudyData {
  const resetAt = Math.max(a.resetAt, b.resetAt)
  // 消去より前に更新が止まっている側は捨てる
  if (a.updatedAt < resetAt && b.updatedAt >= resetAt) return b
  if (b.updatedAt < resetAt && a.updatedAt >= resetAt) return a

  const newer = a.updatedAt >= b.updatedAt ? a : b
  const older = newer === a ? b : a

  const cards: Record<string, CardState> = {}
  for (const id of new Set([...Object.keys(a.cards), ...Object.keys(b.cards)])) {
    cards[id] = pickCard(newer.cards[id], older.cards[id])
  }

  const log: StudyData["log"] = {}
  for (const day of new Set([...Object.keys(a.log), ...Object.keys(b.log)])) {
    const x = a.log[day]
    const y = b.log[day]
    if (!x || !y) {
      log[day] = (x ?? y)!
      continue
    }
    const more = x.answered >= y.answered ? x : y
    log[day] = {
      seconds: Math.max(x.seconds, y.seconds),
      answered: more.answered,
      correct: more.correct,
    }
  }

  const mocks = new Map<string, StudyData["mocks"][number]>()
  for (const m of [...older.mocks, ...newer.mocks]) {
    mocks.set(`${m.date}|${m.seconds}|${m.correct}|${m.total}`, m)
  }

  return {
    ...newer,
    cards,
    log,
    mocks: [...mocks.values()].sort((x, y) => x.date.localeCompare(y.date)),
    checks: { ...older.checks, ...newer.checks },
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
    resetAt,
  }
}

function pickCard(x: CardState | undefined, y: CardState | undefined): CardState {
  if (!x || !y) return (x ?? y)!
  const ax = x.correct + x.wrong
  const ay = y.correct + y.wrong
  if (ax !== ay) return ax > ay ? x : y
  return y.last > x.last ? y : x
}

/** キーの順番をそろえて文字列にする。同じ内容なら必ず同じ文字列になる。 */
export function encodeStudyData(data: StudyData): string {
  return JSON.stringify(sortKeys(data))
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])])
    )
  }
  return value
}
