"use client"

import { useSyncExternalStore } from "react"

import type { ExerciseId } from "@/lib/workout/exercises"
import { MOTIONS, type Point, type Pose } from "@/lib/workout/poses"
import { cn } from "@/lib/utils"

const SPLINE = "0.45 0 0.55 1"

function mid(a: Point, b: Point): Point {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

function points(...list: Point[]): string {
  return list.map(([x, y]) => `${x},${y}`).join(" ")
}

/** 体の各パーツの線（ポーズごとに同じ順番で並べ、アニメーションで補間する） */
function limbs(pose: Pose) {
  return {
    backLeg: points(pose.p, pose.kb, pose.fb),
    backArm: points(pose.n, pose.eb, pose.hb),
    torso: points(pose.n, pose.b ?? mid(pose.n, pose.p), pose.p),
    frontLeg: points(pose.p, pose.kf, pose.ff),
    frontArm: points(pose.n, pose.ef, pose.hf),
  }
}

type Limb = keyof ReturnType<typeof limbs>

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true
  )
}

/** 種目の動きを棒人間で見せる。動きを減らす設定の端末では止めた図にする */
export function ExerciseFigure({
  id,
  className,
  accentClassName = "stroke-orange-500",
  still = false,
}: {
  id: ExerciseId
  className?: string
  /** 一覧の小さな図など、動かさずに見せる */
  still?: boolean
  /** 手前の手足の色 */
  accentClassName?: string
}) {
  const reduced = useReducedMotion()
  const motion = MOTIONS[id]
  // 最初のポーズに戻って1周させる
  const frames = [...motion.frames, motion.frames[0]]
  const animate = !still && !reduced && motion.frames.length > 1
  const keyPose = motion.frames[Math.min(1, motion.frames.length - 1)]
  const shown = animate ? motion.frames[0] : keyPose
  const keyTimes = frames.map((_, i) => (i / (frames.length - 1)).toFixed(3)).join(";")
  const keySplines = Array(frames.length - 1).fill(SPLINE).join(";")
  const dur = `${motion.seconds}s`

  const allLimbs = frames.map(limbs)

  function animation(attributeName: string, values: string[]) {
    if (!animate) return null
    return (
      <animate
        attributeName={attributeName}
        values={values.join(";")}
        keyTimes={keyTimes}
        keySplines={keySplines}
        calcMode="spline"
        dur={dur}
        repeatCount="indefinite"
      />
    )
  }

  function limb(name: Limb, strokeClass: string) {
    return (
      <polyline
        points={limbs(shown)[name]}
        fill="none"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={strokeClass}
      >
        {animation(
          "points",
          allLimbs.map((l) => l[name])
        )}
      </polyline>
    )
  }

  return (
    <svg
      key={id}
      viewBox="0 0 100 100"
      className={cn("block", className)}
      role="img"
      aria-label="動きの図"
    >
      <line x1="4" x2="96" y1="91.5" y2="91.5" strokeWidth="1.5" strokeLinecap="round" className="stroke-border" />
      {limb("backLeg", "stroke-muted-foreground/45")}
      {limb("backArm", "stroke-muted-foreground/45")}
      {limb("torso", "stroke-foreground")}
      {limb("frontLeg", accentClassName)}
      {limb("frontArm", accentClassName)}
      <circle cx={shown.h[0]} cy={shown.h[1]} r="6" className="fill-foreground">
        {animation(
          "cx",
          frames.map((f) => String(f.h[0]))
        )}
        {animation(
          "cy",
          frames.map((f) => String(f.h[1]))
        )}
      </circle>
    </svg>
  )
}
