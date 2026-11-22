/**
 * 最大挙上重量（1RM）の推定式。
 *
 * どの式も「1RM = 使った重量 × 係数(回数)」の形をしているので、係数だけを持たせる。
 * 逆向き（1RM から n 回できる重量）は 1RM ÷ 係数(n) で求まる。
 */
export type FormulaId =
  | "average"
  | "epley"
  | "brzycki"
  | "lander"
  | "lombardi"
  | "mayhew"
  | "oconner"
  | "wathan"

type Formula = {
  id: Exclude<FormulaId, "average">
  name: string
  /** 式の見た目（w = 重量, r = 回数） */
  expression: string
  factor: (reps: number) => number
}

export const FORMULAS: Formula[] = [
  {
    id: "epley",
    name: "Epley",
    expression: "w × (1 + r / 30)",
    factor: (r) => 1 + r / 30,
  },
  {
    id: "brzycki",
    name: "Brzycki",
    expression: "w × 36 / (37 − r)",
    factor: (r) => 36 / (37 - r),
  },
  {
    id: "lander",
    name: "Lander",
    expression: "100w / (101.3 − 2.67123r)",
    factor: (r) => 100 / (101.3 - 2.67123 * r),
  },
  {
    id: "lombardi",
    name: "Lombardi",
    expression: "w × r^0.1",
    factor: (r) => r ** 0.1,
  },
  {
    id: "mayhew",
    name: "Mayhew",
    expression: "100w / (52.2 + 41.9e^(−0.055r))",
    factor: (r) => 100 / (52.2 + 41.9 * Math.exp(-0.055 * r)),
  },
  {
    id: "oconner",
    name: "O'Conner",
    expression: "w × (1 + 0.025r)",
    factor: (r) => 1 + 0.025 * r,
  },
  {
    id: "wathan",
    name: "Wathan",
    expression: "100w / (48.8 + 53.8e^(−0.075r))",
    factor: (r) => 100 / (48.8 + 53.8 * Math.exp(-0.075 * r)),
  },
]

/** 入力できる回数の上限。Brzycki は 37 回で発散するため、余裕をもって 20 回までにする */
export const MAX_REPS = 20
/** これを超える回数では推定のずれが大きくなる */
export const ACCURATE_REPS = 10

/** 係数。1回なら式によらず 1（その重量がそのまま 1RM） */
export function factorFor(id: FormulaId, reps: number): number {
  if (reps <= 1) return 1
  if (id === "average") {
    return FORMULAS.reduce((sum, f) => sum + f.factor(reps), 0) / FORMULAS.length
  }
  const formula = FORMULAS.find((f) => f.id === id)
  if (!formula) throw new Error(`未知の推定式: ${id}`)
  return formula.factor(reps)
}

/** w kg を r 回挙げられたときの 1RM */
export function estimateOneRm(weight: number, reps: number, id: FormulaId = "average"): number {
  return weight * factorFor(id, reps)
}

/** 1RM から、r 回挙げられる重量 */
export function weightForReps(oneRm: number, reps: number, id: FormulaId = "average"): number {
  return oneRm / factorFor(id, reps)
}

/** プレートの刻み（kg）に合わせて丸める。小数の誤差が出ないよう最後に整える */
export function roundToStep(kg: number, step: number): number {
  if (step <= 0) return kg
  return Math.round(Math.round(kg / step) * step * 100) / 100
}

/** 目的ごとの負荷の目安（NSCA の区分に沿った一般的な値） */
export const GOAL_ZONES = [
  {
    id: "strength",
    label: "筋力アップ",
    reps: "1〜5回",
    minPct: 85,
    maxPct: 100,
    sets: "2〜6セット / 休憩 2〜5分",
  },
  {
    id: "hypertrophy",
    label: "筋肥大",
    reps: "6〜12回",
    minPct: 67,
    maxPct: 85,
    sets: "3〜6セット / 休憩 30秒〜1分半",
  },
  {
    id: "endurance",
    label: "筋持久力",
    reps: "12回以上",
    minPct: 50,
    maxPct: 67,
    sets: "2〜3セット / 休憩 30秒以内",
  },
] as const
