import { resolveExercise, type Exercise, type ExerciseId } from "@/lib/workout/exercises"

/**
 * 1回 = 20分（1200秒）の組み立て。
 *   ウォームアップ 45秒 × 4種目 = 3分
 *   メイン         60秒 × 7種目 × 2周 = 14分（60秒 = 運動 + 休憩。比率はレベルで変わる）
 *   クールダウン   45秒 × 4種目 = 3分
 */
export const WARMUP_SECONDS = 45
export const SLOT_SECONDS = 60
export const ROUNDS = 2
export const COOLDOWN_SECONDS = 45

export type Level = "easy" | "normal" | "hard"

export const LEVELS: Record<
  Level,
  { label: string; work: number; note: string }
> = {
  easy: { label: "初級", work: 30, note: "30秒運動 / 30秒休憩" },
  normal: { label: "中級", work: 40, note: "40秒運動 / 20秒休憩" },
  hard: { label: "上級", work: 45, note: "45秒運動 / 15秒休憩" },
}

export type DayPlan = {
  theme: string
  summary: string
  main: ExerciseId[]
}

const WARMUP: ExerciseId[] = ["march", "arm-circle", "hip-circle", "torso-twist"]
const COOLDOWN: ExerciseId[] = [
  "stretch-quad",
  "stretch-hamstring",
  "stretch-glute",
  "stretch-chest",
]

/** 曜日（Date#getDay: 0 = 日曜）ごとのメニュー。毎日続けるため日曜は軽めにする。 */
export const WEEK: DayPlan[] = [
  {
    theme: "回復の日",
    summary: "軽い動きで体をほぐす日。疲れを残さず翌週へ",
    main: ["march", "cat-cow", "glute-bridge", "bird-dog", "squat", "step-jack", "dead-bug"],
  },
  {
    theme: "下半身",
    summary: "大きな筋肉を使って消費を上げる",
    main: ["squat", "reverse-lunge", "glute-bridge", "wide-squat", "squat-jump", "calf-raise", "wall-sit"],
  },
  {
    theme: "上半身と体幹",
    summary: "胸・肩・背中と姿勢を支える筋肉",
    main: ["push-up", "plank", "pike-push-up", "plank-shoulder-tap", "superman", "side-plank", "mountain-climber"],
  },
  {
    theme: "全身の有酸素",
    summary: "心拍を上げて脂肪を燃やす日",
    main: ["jumping-jack", "squat", "mountain-climber", "reverse-lunge", "burpee", "high-knees", "plank"],
  },
  {
    theme: "お尻と脚",
    summary: "横の動きを入れて下半身を引きしめる",
    main: ["side-lunge", "glute-bridge", "skater", "squat", "bird-dog", "calf-raise", "wide-squat"],
  },
  {
    theme: "体幹",
    summary: "おなか・わき腹・背中をまんべんなく",
    main: ["dead-bug", "plank", "crunch", "bird-dog", "side-plank", "superman", "mountain-climber"],
  },
  {
    theme: "全身ミックス",
    summary: "1週間のまとめ。全身を順番に使う",
    main: ["burpee", "squat", "push-up", "reverse-lunge", "plank-shoulder-tap", "squat-jump", "crunch"],
  },
]

export const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"]

export type SegmentKind = "warmup" | "work" | "rest" | "cooldown"

export type Segment = {
  kind: SegmentKind
  exercise: Exercise
  seconds: number
  /** メインの何周目か（1始まり） */
  round?: number
  /** その周の何種目目か（1始まり） */
  slot?: number
}

export function dayPlanFor(date: Date): DayPlan {
  return WEEK[date.getDay()]
}

export function buildSession(
  plan: DayPlan,
  options: { level: Level; quiet: boolean }
): Segment[] {
  const resolve = (id: ExerciseId) => resolveExercise(id, options.quiet)
  const work = LEVELS[options.level].work
  const segments: Segment[] = []

  for (const id of WARMUP) {
    segments.push({ kind: "warmup", exercise: resolve(id), seconds: WARMUP_SECONDS })
  }

  for (let round = 1; round <= ROUNDS; round++) {
    plan.main.forEach((id, index) => {
      const exercise = resolve(id)
      segments.push({ kind: "work", exercise, seconds: work, round, slot: index + 1 })
      segments.push({
        kind: "rest",
        exercise,
        seconds: SLOT_SECONDS - work,
        round,
        slot: index + 1,
      })
    })
  }

  for (const id of COOLDOWN) {
    segments.push({ kind: "cooldown", exercise: resolve(id), seconds: COOLDOWN_SECONDS })
  }

  return segments
}

export function totalSeconds(segments: Segment[]): number {
  return segments.reduce((sum, segment) => sum + segment.seconds, 0)
}

/** 休憩中の強度（立って息を整える程度） */
const REST_MET = 1.5

/**
 * 消費カロリーの推定（kcal）。安静にしていても使う分（1 MET）は差し引き、
 * 「運動したことで上乗せされた分」だけを返す。体重を減らす計算にはこちらを使う。
 *   kcal = (MET - 1) × 体重kg × 時間h × 1.05
 */
export function estimateKcal(
  segments: Segment[],
  weightKg: number,
  elapsedSeconds = Infinity
): number {
  let remaining = elapsedSeconds
  let kcal = 0
  for (const segment of segments) {
    if (remaining <= 0) break
    const seconds = Math.min(segment.seconds, remaining)
    const met = segment.kind === "rest" ? REST_MET : segment.exercise.met
    kcal += (met - 1) * weightKg * (seconds / 3600) * 1.05
    remaining -= seconds
  }
  return kcal
}
