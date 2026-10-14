import type { FormulaId } from "@/lib/rm/formulas"

/** 前回の入力。次に開いたときに同じ値から始められるようにする（端末内だけに保存） */
export type RmInput = {
  weight: string
  reps: number
  formula: FormulaId
  step: number
  /** 「ホーム画面に追加」の案内を閉じた */
  hideInstallHint: boolean
}

const KEY = "rm-calculator:v1"

export const DEFAULT_INPUT: RmInput = {
  weight: "60",
  reps: 8,
  formula: "average",
  step: 2.5,
  hideInstallHint: false,
}

export function loadInput(): RmInput {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return DEFAULT_INPUT
    return { ...DEFAULT_INPUT, ...(JSON.parse(raw) as Partial<RmInput>) }
  } catch {
    // プライベートモードなどで読めない場合は初期値で動かす
    return DEFAULT_INPUT
  }
}

export function saveInput(input: RmInput): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(input))
  } catch {
    // 保存できなくても計算はできるので黙って続ける
  }
}
