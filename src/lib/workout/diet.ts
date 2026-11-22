/**
 * 食事の工夫。運動だけでは1日約59kcalに少し届かないため、
 * 「減らした分」をワンタップで記録して合わせて見られるようにする。
 *
 * kcal は一般的な量で見積もった目安（日本食品標準成分表などの代表的な値から概算）。
 */
export type DietId = "snack" | "drink" | "rice" | "fried" | "alcohol" | "late"

export type DietItem = {
  id: DietId
  label: string
  /** どのくらいの量を想定しているか */
  basis: string
  kcal: number
}

export const DIET_ITEMS: DietItem[] = [
  { id: "snack", label: "間食を1回やめた", basis: "お菓子1回分", kcal: 150 },
  { id: "drink", label: "甘い飲み物をお茶・水にした", basis: "清涼飲料 350ml", kcal: 140 },
  { id: "rice", label: "ご飯を小盛りにした", basis: "150g → 100g", kcal: 80 },
  { id: "fried", label: "揚げ物を焼き・蒸しにした", basis: "おかず1品", kcal: 100 },
  { id: "alcohol", label: "お酒を1杯減らした", basis: "ビール 350ml", kcal: 140 },
  { id: "late", label: "夜食をやめた", basis: "軽食1回分", kcal: 200 },
]

const BY_ID = Object.fromEntries(DIET_ITEMS.map((item) => [item.id, item])) as Record<
  DietId,
  DietItem
>

export function dietKcal(ids: DietId[] | undefined): number {
  return (ids ?? []).reduce((sum, id) => sum + (BY_ID[id]?.kcal ?? 0), 0)
}

/** since（YYYY-MM-DD）以降の合計 */
export function totalDietKcal(diet: Record<string, DietId[]>, since?: string): number {
  return Object.entries(diet)
    .filter(([date]) => !since || date >= since)
    .reduce((sum, [, ids]) => sum + dietKcal(ids), 0)
}
