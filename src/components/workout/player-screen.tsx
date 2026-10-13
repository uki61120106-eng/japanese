"use client"

import { useEffect, useReducer } from "react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ExerciseFigure } from "@/components/workout/exercise-figure"
import { ROUNDS, totalSeconds, type Segment } from "@/lib/workout/plan"
import { beep, speak, stopSpeaking } from "@/lib/workout/sound"
import { KIND_THEME } from "@/lib/workout/theme"
import { cn } from "@/lib/utils"

/** 始まる前の準備時間（秒） */
const READY_SECONDS = 5

type PlayerScreenProps = {
  segments: Segment[]
  /** スタートを押した時刻（Date.now()） */
  startedAt: number
  voice: boolean
  /** 実際に動いていた秒数を渡す */
  onFinish: (activeSeconds: number) => void
  onQuit: (activeSeconds: number) => void
}

type State = {
  /** 各区間の秒数。先頭は準備時間 */
  durations: number[]
  /** durations の位置。0 = 準備中 */
  index: number
  /** 動いている間は区間の終わる時刻。一時停止中は null */
  endAt: number | null
  pausedLeftMs: number
  now: number
  /** 準備時間と一時停止を除いた経過時間 */
  activeMs: number
  finished: boolean
}

type Action =
  | { type: "tick"; now: number }
  | { type: "pause"; now: number }
  | { type: "resume"; now: number }
  | { type: "skip"; now: number }
  | { type: "back"; now: number }

function advanceTime(state: State, now: number): State {
  if (state.finished || state.endAt === null) return { ...state, now }

  let { index, endAt, activeMs } = state
  let finished = false
  let cursor = state.now
  // 画面を閉じていた間に複数の区間が過ぎていても追いつく
  while (now >= endAt) {
    if (index > 0) activeMs += endAt - cursor
    cursor = endAt
    index++
    if (index >= state.durations.length) {
      finished = true
      break
    }
    endAt += state.durations[index] * 1000
  }
  if (!finished && index > 0) activeMs += now - cursor
  return { ...state, index, endAt, activeMs, finished, now }
}

function jumpTo(state: State, index: number, now: number): State {
  if (index >= state.durations.length) return { ...state, finished: true, now }
  const durationMs = state.durations[index] * 1000
  return {
    ...state,
    index,
    endAt: state.endAt === null ? null : now + durationMs,
    pausedLeftMs: durationMs,
    now,
  }
}

function reducer(state: State, action: Action): State {
  const next = advanceTime(state, action.now)
  if (next.finished) return next

  switch (action.type) {
    case "tick":
      return next
    case "pause":
      if (next.endAt === null) return next
      return { ...next, endAt: null, pausedLeftMs: next.endAt - action.now }
    case "resume":
      if (next.endAt !== null) return next
      return { ...next, endAt: action.now + next.pausedLeftMs }
    case "skip":
      return jumpTo(next, next.index + 1, action.now)
    case "back": {
      // 始まって3秒以内ならひとつ前へ、それ以降は今の区間を最初から
      const durationMs = next.durations[next.index] * 1000
      const leftMs =
        next.endAt === null ? next.pausedLeftMs : next.endAt - action.now
      const target =
        durationMs - leftMs < 3000 ? Math.max(next.index - 1, 0) : next.index
      return jumpTo(next, target, action.now)
    }
  }
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

function switchesSides(segment: Segment): boolean {
  return segment.exercise.cues.some(
    (cue) => cue.includes("交代") || cue.includes("逆回し")
  )
}

function phaseLabel(segments: Segment[], segment: Segment): string {
  if (segment.kind === "work" || segment.kind === "rest") {
    const perRound = segments.filter((s) => s.kind === "work").length / ROUNDS
    return `メイン ${segment.round}/${ROUNDS}周 · ${segment.slot}/${perRound}種目`
  }
  const same = segments.filter((s) => s.kind === segment.kind)
  return `${KIND_THEME[segment.kind].label} ${same.indexOf(segment) + 1}/${same.length}`
}

export function PlayerScreen({
  segments,
  startedAt,
  voice,
  onFinish,
  onQuit,
}: PlayerScreenProps) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    durations: [READY_SECONDS, ...segments.map((s) => s.seconds)],
    index: 0,
    endAt: startedAt + READY_SECONDS * 1000,
    pausedLeftMs: READY_SECONDS * 1000,
    now: startedAt,
    activeMs: 0,
    finished: false,
  }))

  const running = state.endAt !== null
  const durationSec = state.durations[Math.min(state.index, state.durations.length - 1)]
  const leftMs = running
    ? Math.max((state.endAt ?? 0) - state.now, 0)
    : state.pausedLeftMs
  const secondsLeft = Math.ceil(leftMs / 1000)
  const isReady = state.index === 0
  const segment =
    segments[Math.min(Math.max(state.index - 1, 0), segments.length - 1)]
  const nextSegment = isReady ? segments[0] : segments[state.index]
  const activeSeconds = Math.round(state.activeMs / 1000)

  const total = totalSeconds(segments)
  const doneBefore = segments
    .slice(0, Math.max(state.index - 1, 0))
    .reduce((sum, s) => sum + s.seconds, 0)
  const elapsedTotal = isReady ? 0 : doneBefore + (durationSec - leftMs / 1000)

  useEffect(() => {
    const id = window.setInterval(
      () => dispatch({ type: "tick", now: Date.now() }),
      200
    )
    return () => window.clearInterval(id)
  }, [])

  // 画面が暗くならないようにする（対応していない端末では何もしない）
  useEffect(() => {
    let lock: WakeLockSentinel | null = null
    const request = () => {
      navigator.wakeLock
        ?.request("screen")
        .then((sentinel) => {
          lock = sentinel
        })
        .catch(() => {})
    }
    const onVisible = () => {
      if (document.visibilityState === "visible") request()
    }
    request()
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      document.removeEventListener("visibilitychange", onVisible)
      void lock?.release().catch(() => {})
    }
  }, [])

  // 区間が変わったときの合図
  useEffect(() => {
    if (state.finished) return
    if (state.index === 0) {
      if (voice) speak(`準備してください。最初は${segments[0].exercise.name}です`)
      return
    }
    const current = segments[state.index - 1]
    const upcoming = segments[state.index]
    beep(current.kind === "rest" ? 660 : 1046, 300)
    if (!voice) return
    if (current.kind === "rest") {
      speak(upcoming ? `休憩。次は${upcoming.exercise.name}` : "休憩")
    } else {
      speak(current.exercise.name)
    }
  }, [state.index, state.finished, segments, voice])

  // 残り3秒のカウントと、左右を入れ替える種目の折り返し
  useEffect(() => {
    if (!running || state.finished) return
    if (secondsLeft >= 1 && secondsLeft <= 3) {
      beep(880, 120)
      return
    }
    if (
      voice &&
      !isReady &&
      segment.kind !== "rest" &&
      switchesSides(segment) &&
      secondsLeft === Math.floor(segment.seconds / 2)
    ) {
      speak("反対側へ")
    }
  }, [secondsLeft, running, state.finished, isReady, segment, voice])

  useEffect(() => {
    if (state.finished) {
      stopSpeaking()
      if (voice) speak("おつかれさまでした")
      onFinish(activeSeconds)
    }
    // 終わった瞬間に一度だけ呼ぶ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.finished])

  useEffect(() => stopSpeaking, [])

  const kind = isReady ? "warmup" : segment.kind
  const theme = KIND_THEME[kind]
  const shown = isReady || segment.kind === "rest" ? nextSegment : segment
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const ratio = durationSec > 0 ? leftMs / (durationSec * 1000) : 0

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold tabular-nums",
              theme.chip
            )}
          >
            {isReady ? "準備" : phaseLabel(segments, segment)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQuit(activeSeconds)}
            className="text-muted-foreground h-7 text-xs"
          >
            やめる
          </Button>
        </div>
        <Progress
          value={(elapsedTotal / total) * 100}
          className="bg-muted h-2.5"
          indicatorClassName={cn("transition-all duration-200", theme.fill)}
        />
        <div className="text-muted-foreground flex justify-between text-xs tabular-nums">
          <span>{formatClock(Math.floor(elapsedTotal))} 経過</span>
          <span>残り {formatClock(Math.ceil(total - elapsedTotal))}</span>
        </div>
      </header>

      <div className="relative mx-auto aspect-square w-full max-w-56">
        <svg viewBox="0 0 200 200" className="size-full -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="12"
            className="stroke-muted"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
            className={cn("transition-[stroke-dashoffset] duration-200 ease-linear", theme.ring)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-sm font-bold", theme.text)}>
            {isReady ? "まもなく開始" : theme.label}
          </span>
          <span className="text-7xl font-extrabold tabular-nums">
            {secondsLeft}
          </span>
          <span className="text-muted-foreground text-xs">秒</span>
        </div>
      </div>

      {shown && (
        <section className="bg-card flex flex-col gap-3 rounded-2xl border p-5 shadow-sm">
          {(isReady || segment.kind === "rest") && (
            <span className="text-muted-foreground text-xs font-bold">
              次の種目
            </span>
          )}
          <div className="flex items-center gap-4">
            <ExerciseFigure
              id={shown.exercise.id}
              accentClassName={theme.ring}
              className="bg-muted/60 size-28 shrink-0 rounded-2xl"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <h2 className="text-2xl font-extrabold text-balance">
                {shown.exercise.name}
              </h2>
              <span className="text-muted-foreground text-sm">
                {shown.exercise.target}
              </span>
            </div>
          </div>
          <ul className="flex flex-col gap-1.5">
            {shown.exercise.cues.map((cue) => (
              <li key={cue} className="flex gap-2 text-sm leading-relaxed">
                <span className={cn("mt-2 size-1.5 shrink-0 rounded-full", theme.fill)} />
                {cue}
              </li>
            ))}
          </ul>
          {shown.exercise.easier && (
            <p className="text-muted-foreground bg-muted rounded-lg px-3 py-2 text-xs">
              きついときは：{shown.exercise.easier}
            </p>
          )}
        </section>
      )}

      <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-3">
        <Button
          variant="outline"
          size="xl"
          onClick={() => dispatch({ type: "back", now: Date.now() })}
          aria-label="前へ"
        >
          <SkipBack />
        </Button>
        <Button
          size="xl"
          onClick={() =>
            dispatch({ type: running ? "pause" : "resume", now: Date.now() })
          }
        >
          {running ? <Pause /> : <Play />}
          {running ? "一時停止" : "再開"}
        </Button>
        <Button
          variant="outline"
          size="xl"
          onClick={() => dispatch({ type: "skip", now: Date.now() })}
          aria-label="次へ"
        >
          <SkipForward />
        </Button>
      </div>
    </div>
  )
}
