/**
 * そろばん（珠算）4〜6級レベルの問題をつくる。
 *
 * 桁数・口数は検定の出題をもとにした「目安」で、主催団体ごとに細かい規定は異なる。
 * レベルを調整するときは LEVELS の数字だけを書きかえればよい。
 */

export type Grade = 6 | 5 | 4
export type Kind = "mul" | "div" | "mitori"
/** 出題の種目。mix はかけ算・わり算・見取算をまぜる。 */
export type KindChoice = Kind | "mix"

/** [左の数の桁数, 右の数の桁数] */
type DigitPair = [number, number]

type LevelSpec = {
  /** かけ算: [かけられる数, かける数] の桁数の組み合わせ */
  mul: DigitPair[]
  /** わり算: [わる数, 商] の桁数の組み合わせ。わられる数は わる数×商 */
  div: DigitPair[]
  /** 見取算: 1口あたりの桁数の範囲 */
  mitoriDigits: DigitPair
  /** 見取算: 口数 */
  mitoriRows: number
  /** 見取算: ひき算の口数の上限（0 ならたし算だけ） */
  mitoriMaxMinus: number
}

export const LEVELS: Record<Grade, LevelSpec> = {
  6: {
    mul: [
      [2, 1],
      [3, 1],
    ],
    div: [[1, 2]],
    mitoriDigits: [2, 3],
    mitoriRows: 5,
    mitoriMaxMinus: 0,
  },
  5: {
    mul: [
      [3, 2],
      [4, 1],
      [2, 2],
    ],
    div: [
      [1, 3],
      [2, 2],
    ],
    mitoriDigits: [3, 3],
    mitoriRows: 7,
    mitoriMaxMinus: 2,
  },
  4: {
    mul: [
      [4, 2],
      [3, 3],
    ],
    div: [
      [2, 3],
      [3, 2],
    ],
    mitoriDigits: [3, 4],
    mitoriRows: 10,
    mitoriMaxMinus: 3,
  },
}

export const GRADES: Grade[] = [6, 5, 4]

export const KIND_LABEL: Record<KindChoice, string> = {
  mul: "かけざん",
  div: "わりざん",
  mitori: "みとりざん",
  mix: "ぜんぶ まぜる",
}

/** 小学生向けに、各級でどんな問題が出るかをひらがなで説明する */
export function describeLevel(grade: Grade): string[] {
  const spec = LEVELS[grade]
  const pairs = (list: DigitPair[], sign: string) =>
    list.map(([a, b]) => `${a}けた${sign}${b}けた`).join("、")
  const [lo, hi] = spec.mitoriDigits
  const digits = lo === hi ? `${lo}けた` : `${lo}〜${hi}けた`
  return [
    `かけざん：${pairs(spec.mul, "×")}`,
    `わりざん：${spec.div.map(([d, q]) => `${d}けたで わって こたえ${q}けた`).join("、")}`,
    `みとりざん：${digits}の かずを ${spec.mitoriRows}こ${
      spec.mitoriMaxMinus > 0 ? "（ひきざん あり）" : ""
    }`,
  ]
}

export type MulProblem = { kind: "mul"; a: number; b: number }
export type DivProblem = { kind: "div"; a: number; b: number }
/** 見取算は上から順にたす。ひく口はマイナスの数で持つ。 */
export type MitoriProblem = { kind: "mitori"; rows: number[] }
export type Problem = (MulProblem | DivProblem | MitoriProblem) & {
  id: string
}

export function answerOf(problem: Problem): number {
  switch (problem.kind) {
    case "mul":
      return problem.a * problem.b
    case "div":
      return problem.a / problem.b
    case "mitori":
      return problem.rows.reduce((sum, value) => sum + value, 0)
  }
}

type Random = () => number

function randInt(min: number, max: number, random: Random): number {
  return min + Math.floor(random() * (max - min + 1))
}

function pick<T>(items: T[], random: Random): T {
  return items[Math.floor(random() * items.length)]
}

/**
 * digits 桁の数。1桁のときは 0 と 1 をのぞく（×1・÷1 は練習にならない）。
 * 2桁以上は末尾が 0 にならないようにして、そろばんで置く玉を増やす。
 */
function numberWithDigits(digits: number, random: Random): number {
  if (digits === 1) return randInt(2, 9, random)
  const head = randInt(1, 9, random)
  let value = head
  for (let i = 1; i < digits; i++) {
    const isLast = i === digits - 1
    value = value * 10 + randInt(isLast ? 1 : 0, 9, random)
  }
  return value
}

function makeMul(spec: LevelSpec, random: Random): Omit<MulProblem, "id"> {
  const [da, db] = pick(spec.mul, random)
  return {
    kind: "mul",
    a: numberWithDigits(da, random),
    b: numberWithDigits(db, random),
  }
}

/** わりきれる問題だけをつくる。商の桁数は指定どおりになる。 */
function makeDiv(spec: LevelSpec, random: Random): Omit<DivProblem, "id"> {
  const [dd, dq] = pick(spec.div, random)
  const divisor = numberWithDigits(dd, random)
  const quotient = numberWithDigits(dq, random)
  return { kind: "div", a: divisor * quotient, b: divisor }
}

/**
 * ひき算の口は、とちゅうの合計がマイナスにならないときだけ入れる。
 * 1口目はかならずたし算。
 */
function makeMitori(
  spec: LevelSpec,
  random: Random
): Omit<MitoriProblem, "id"> {
  const [lo, hi] = spec.mitoriDigits
  const rows: number[] = []
  let total = 0
  let minusLeft = spec.mitoriMaxMinus

  for (let i = 0; i < spec.mitoriRows; i++) {
    const value = numberWithDigits(randInt(lo, hi, random), random)
    const wantMinus = i > 0 && minusLeft > 0 && random() < 0.35
    if (wantMinus && total - value > 0) {
      rows.push(-value)
      total -= value
      minusLeft--
    } else {
      rows.push(value)
      total += value
    }
  }
  return { kind: "mitori", rows }
}

export type QuizConfig = {
  grade: Grade
  kind: KindChoice
  count: number
}

export function buildQuiz(
  config: QuizConfig,
  random: Random = Math.random
): Problem[] {
  const spec = LEVELS[config.grade]
  const kinds: Kind[] = ["mul", "div", "mitori"]
  return Array.from({ length: config.count }, (_, index) => {
    // まぜるときは かけ算 → わり算 → 見取算 の順にくりかえす
    const kind = config.kind === "mix" ? kinds[index % 3] : config.kind
    const body =
      kind === "mul"
        ? makeMul(spec, random)
        : kind === "div"
          ? makeDiv(spec, random)
          : makeMitori(spec, random)
    return { ...body, id: `${index}-${kind}` } as Problem
  })
}

/** 3桁ごとにカンマを入れる（検定の問題用紙と同じ書き方） */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US")
}
