import { SUBJECTS } from "@/lib/gyosei/content"
import { addDays, diffDays } from "@/lib/gyosei/dates"
import type { Settings } from "@/lib/gyosei/store"
import type { SubjectId } from "@/lib/gyosei/types"

export type TopicRef = { subject: SubjectId; topic: string }

export type PhaseMode = "learn" | "review" | "final"

type PhaseDef = {
  id: string
  name: string
  goal: string
  /** 52週で組んだときの週数。実際の期間に合わせて伸縮する */
  baseWeeks: number
  mode: PhaseMode
  topics: TopicRef[]
}

const t = (subject: SubjectId, ...topics: string[]): TopicRef[] =>
  topics.map((topic) => ({ subject, topic }))

/**
 * 配点（行政法112点・民法76点・基礎知識56点・憲法28点・商法20点・基礎法学8点）に
 * 比例するよう週数を割り振っている。行政法を先に置くのは、配点が最も大きく、
 * 早く始めるほど復習の回数を稼げるため。
 */
export const PHASES: PhaseDef[] = [
  {
    id: "intro",
    name: "導入・基礎法学",
    goal: "試験の全体像をつかみ、法令用語に慣れる",
    baseWeeks: 2,
    mode: "learn",
    topics: t("kiso", "hogaku", "saiban"),
  },
  {
    id: "kenpo",
    name: "憲法",
    goal: "主要判例の結論と理由を言える",
    baseWeeks: 6,
    mode: "learn",
    topics: t("kenpo", "jinken", "seishin", "keizai", "shakai", "tochi"),
  },
  {
    id: "gyosei1",
    name: "行政法① 総論・行政手続法",
    goal: "行政手続法の条文知識で正答率8割",
    baseWeeks: 5,
    mode: "learn",
    topics: t("gyosei", "soron", "tetsuzuki"),
  },
  {
    id: "gyosei2",
    name: "行政法② 行政不服審査法・行政事件訴訟法",
    goal: "期間・要件・訴訟類型を正確に区別できる",
    baseWeeks: 5,
    mode: "learn",
    topics: t("gyosei", "fufuku", "sosho"),
  },
  {
    id: "gyosei3",
    name: "行政法③ 国家賠償法・地方自治法",
    goal: "国賠の判例と直接請求の数字を押さえる",
    baseWeeks: 4,
    mode: "learn",
    topics: t("gyosei", "kokubai", "chiho"),
  },
  {
    id: "minpo1",
    name: "民法① 総則・物権・担保物権",
    goal: "意思表示・代理・時効・対抗要件を事例で判断できる",
    baseWeeks: 5,
    mode: "learn",
    topics: t("minpo", "sosoku", "bukken", "tanpo"),
  },
  {
    id: "minpo2",
    name: "民法② 債権",
    goal: "債務不履行・契約不適合・不法行為を整理する",
    baseWeeks: 5,
    mode: "learn",
    topics: t("minpo", "saiken", "keiyaku", "fuho"),
  },
  {
    id: "minpo3",
    name: "民法③ 親族・相続",
    goal: "相続分・代襲・承認放棄を正確に",
    baseWeeks: 2,
    mode: "learn",
    topics: t("minpo", "kazoku"),
  },
  {
    id: "shoho",
    name: "商法・会社法",
    goal: "頻出の機関・設立に絞って得点源を作る",
    baseWeeks: 4,
    mode: "learn",
    topics: t("shoho", "shoho", "setsuritsu", "kikan"),
  },
  {
    id: "chishiki",
    name: "基礎知識",
    goal: "足切り（24点）を確実に超える",
    baseWeeks: 4,
    mode: "learn",
    topics: t("chishiki", "shoshi", "joho", "ippan"),
  },
  {
    id: "review",
    name: "総復習・記述対策",
    goal: "全範囲の取りこぼしをなくし、記述式に慣れる",
    baseWeeks: 6,
    mode: "review",
    topics: [],
  },
  {
    id: "final",
    name: "直前期・模試",
    goal: "本試験形式で合格点（180点）を安定させる",
    baseWeeks: 4,
    mode: "final",
    topics: [],
  },
]

export const ALL_TOPICS: TopicRef[] = SUBJECTS.flatMap((subject) =>
  subject.topics.map((topic) => ({ subject: subject.id, topic: topic.id }))
)

export type PhaseSpan = PhaseDef & {
  startWeek: number
  weeks: number
  startDate: string
  endDate: string
}

export type Plan = {
  totalDays: number
  totalWeeks: number
  phases: PhaseSpan[]
}

/** 最大剰余法で total を weights の比に整数で配分する */
function apportion(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  const raw = weights.map((w) => (total * w) / sum)
  const result = raw.map(Math.floor)
  let rest = total - result.reduce((a, b) => a + b, 0)
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac)
  for (const { index } of order) {
    if (rest <= 0) break
    result[index] += 1
    rest -= 1
  }
  return result
}

export function buildPlan(settings: Settings): Plan {
  const totalDays = Math.max(diffDays(settings.startDate, settings.examDate), 7)
  const totalWeeks = Math.ceil(totalDays / 7)

  const finalWeeks = Math.min(4, Math.max(1, Math.round((totalWeeks * 4) / 52)))
  const body = PHASES.slice(0, -1)
  const bodyWeeks = apportion(
    Math.max(totalWeeks - finalWeeks, 0),
    body.map((phase) => phase.baseWeeks)
  )
  const weeks = [...bodyWeeks, finalWeeks]

  let cursor = 0
  const phases = PHASES.map((phase, index) => {
    const span: PhaseSpan = {
      ...phase,
      startWeek: cursor,
      weeks: weeks[index],
      startDate: addDays(settings.startDate, cursor * 7),
      endDate: addDays(settings.startDate, (cursor + weeks[index]) * 7 - 1),
    }
    cursor += weeks[index]
    return span
  })
  // 最後のフェーズは試験前日で終える
  phases[phases.length - 1].endDate = addDays(settings.examDate, -1)

  return { totalDays, totalWeeks, phases }
}

export type DayInfo = {
  /** 開始日を 0 とした通し日数 */
  dayNumber: number
  /** 0 始まりの週番号 */
  week: number
  /** 週の中の何日目か（0〜6）。6 日目が理解度チェックの日 */
  dayOfWeek: number
  phase: PhaseSpan | null
  /** 今日の要点に使う単元 */
  topic: TopicRef | null
  isCheckDay: boolean
  /** 4週ごとにミニ模試をすすめる */
  isMockDay: boolean
  daysLeft: number
  status: "before" | "studying" | "after"
}

function phaseAt(plan: Plan, week: number): PhaseSpan | null {
  return (
    plan.phases.find(
      (phase) =>
        phase.weeks > 0 &&
        week >= phase.startWeek &&
        week < phase.startWeek + phase.weeks
    ) ?? plan.phases[plan.phases.length - 1]
  )
}

export function topicOnDay(plan: Plan, dayNumber: number): TopicRef | null {
  const phase = phaseAt(plan, Math.floor(dayNumber / 7))
  if (!phase) return null
  if (phase.mode !== "learn" || phase.topics.length === 0) {
    return ALL_TOPICS[dayNumber % ALL_TOPICS.length]
  }
  const phaseDays = phase.weeks * 7
  const offset = dayNumber - phase.startWeek * 7
  const index = Math.min(
    Math.floor((offset * phase.topics.length) / phaseDays),
    phase.topics.length - 1
  )
  return phase.topics[index]
}

export function dayInfo(plan: Plan, settings: Settings, date: string): DayInfo {
  const dayNumber = diffDays(settings.startDate, date)
  const daysLeft = diffDays(date, settings.examDate)
  const status =
    dayNumber < 0 ? "before" : daysLeft <= 0 ? "after" : "studying"
  const clamped = Math.max(dayNumber, 0)
  const week = Math.floor(clamped / 7)
  const dayOfWeek = clamped % 7
  const phase = phaseAt(plan, week)
  return {
    dayNumber: clamped,
    week,
    dayOfWeek,
    phase,
    topic: topicOnDay(plan, clamped),
    isCheckDay: dayOfWeek === 6,
    isMockDay: dayOfWeek === 6 && week % 4 === 3,
    daysLeft,
    status,
  }
}

/** その週に扱う単元（理解度チェックの出題範囲） */
export function topicsOfWeek(plan: Plan, week: number): TopicRef[] {
  const seen = new Map<string, TopicRef>()
  for (let day = week * 7; day < week * 7 + 7; day++) {
    const topic = topicOnDay(plan, day)
    if (topic) seen.set(`${topic.subject}.${topic.topic}`, topic)
  }
  return [...seen.values()]
}

/** その日までに学習計画で一度は扱った単元 */
export function topicsUntil(plan: Plan, dayNumber: number): TopicRef[] {
  const phase = phaseAt(plan, Math.floor(dayNumber / 7))
  if (!phase || phase.mode !== "learn") return ALL_TOPICS
  const seen = new Map<string, TopicRef>()
  for (const earlier of plan.phases) {
    if (earlier.startWeek > phase.startWeek) break
    if (earlier === phase) {
      for (let day = phase.startWeek * 7; day <= dayNumber; day++) {
        const topic = topicOnDay(plan, day)
        if (topic) seen.set(`${topic.subject}.${topic.topic}`, topic)
      }
    } else {
      for (const topic of earlier.topics) {
        seen.set(`${topic.subject}.${topic.topic}`, topic)
      }
    }
  }
  return [...seen.values()]
}
