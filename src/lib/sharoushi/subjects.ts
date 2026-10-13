export type SubjectId =
  | "rouki"
  | "anei"
  | "rousai"
  | "koyou"
  | "choshu"
  | "roiti"
  | "shaiti"
  | "kenpo"
  | "kounen"
  | "kokunen"

export type Subject = {
  id: SubjectId
  /** 画面に出す正式名に近い名前 */
  name: string
  /** チップなど狭い場所に出す略称 */
  short: string
  /** 年間計画のインプット期に割り当てる重み（条文量の多さの目安） */
  weight: number
}

/** インプット期に学ぶ順番に並べている。 */
export const SUBJECTS: Subject[] = [
  { id: "rouki", name: "労働基準法", short: "労基", weight: 3 },
  { id: "anei", name: "労働安全衛生法", short: "安衛", weight: 1 },
  { id: "rousai", name: "労災保険法", short: "労災", weight: 2 },
  { id: "koyou", name: "雇用保険法", short: "雇用", weight: 2 },
  { id: "choshu", name: "労働保険徴収法", short: "徴収", weight: 1 },
  { id: "kenpo", name: "健康保険法", short: "健保", weight: 3 },
  { id: "kokunen", name: "国民年金法", short: "国年", weight: 3 },
  { id: "kounen", name: "厚生年金保険法", short: "厚年", weight: 3 },
  { id: "roiti", name: "労働に関する一般常識", short: "労一", weight: 2 },
  { id: "shaiti", name: "社会保険に関する一般常識", short: "社一", weight: 2 },
]

export function getSubject(id: SubjectId): Subject {
  const subject = SUBJECTS.find((s) => s.id === id)
  if (!subject) throw new Error(`未知の科目: ${id}`)
  return subject
}

export type ExamGroupId =
  | "rouki-anei"
  | "rousai"
  | "koyou"
  | "ippan"
  | "kenpo"
  | "kounen"
  | "kokunen"

export type ExamGroup = {
  id: ExamGroupId
  name: string
  /** この区分の問題を作るときに使う科目 */
  subjects: SubjectId[]
}

/**
 * 本試験（択一式）の科目区分。労災・雇用の区分には徴収法の問題も混ざる。
 * 合否は総得点と区分ごとの得点（足切り）の両方で判定される。
 */
export const EXAM_GROUPS: ExamGroup[] = [
  { id: "rouki-anei", name: "労働基準法及び労働安全衛生法", subjects: ["rouki", "anei"] },
  { id: "rousai", name: "労災保険法（徴収法を含む）", subjects: ["rousai", "choshu"] },
  { id: "koyou", name: "雇用保険法（徴収法を含む）", subjects: ["koyou", "choshu"] },
  { id: "ippan", name: "労務管理・社会保険の一般常識", subjects: ["roiti", "shaiti"] },
  { id: "kenpo", name: "健康保険法", subjects: ["kenpo"] },
  { id: "kounen", name: "厚生年金保険法", subjects: ["kounen"] },
  { id: "kokunen", name: "国民年金法", subjects: ["kokunen"] },
]
