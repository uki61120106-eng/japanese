"use client"

import { Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  GRADES,
  KIND_LABEL,
  describeLevel,
  type Grade,
  type KindChoice,
} from "@/lib/soroban"
import { cn } from "@/lib/utils"

const KINDS: KindChoice[] = ["mix", "mul", "div", "mitori"]
const COUNTS = [5, 10, 20]

/** 級ごとの色。Tailwind が拾えるように完全なクラス名で持つ。 */
export const GRADE_THEME: Record<Grade, { active: string; fill: string }> = {
  6: {
    active: "border-emerald-400 bg-emerald-500 text-white shadow-emerald-300/60",
    fill: "bg-emerald-500",
  },
  5: {
    active: "border-sky-400 bg-sky-500 text-white shadow-sky-300/60",
    fill: "bg-sky-500",
  },
  4: {
    active: "border-violet-400 bg-violet-500 text-white shadow-violet-300/60",
    fill: "bg-violet-500",
  },
}

type SorobanHomeProps = {
  grade: Grade
  onGradeChange: (grade: Grade) => void
  kind: KindChoice
  onKindChange: (kind: KindChoice) => void
  count: number
  onCountChange: (count: number) => void
  onStart: () => void
}

function ChoiceButton({
  selected,
  activeClass,
  onClick,
  children,
  className,
}: {
  selected: boolean
  activeClass?: string
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 px-2 py-3 font-bold whitespace-nowrap transition-all active:scale-95",
        selected
          ? cn(
              "shadow-md",
              activeClass ??
                "border-amber-400 bg-amber-500 text-white shadow-amber-300/60"
            )
          : "border-border bg-card hover:bg-muted",
        className
      )}
    >
      {children}
    </button>
  )
}

export function SorobanHome({
  grade,
  onGradeChange,
  kind,
  onKindChange,
  count,
  onCountChange,
  onStart,
}: SorobanHomeProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="text-5xl" aria-hidden>
          🧮
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          そろばん ドリル
        </h1>
        <p className="text-muted-foreground text-sm">
          4きゅう〜6きゅうの もんだいに チャレンジしよう
        </p>
      </header>

      <Card className="gap-5 rounded-3xl border-2 shadow-lg">
        <CardContent className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              なんきゅう？
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map((value) => (
                <ChoiceButton
                  key={value}
                  selected={grade === value}
                  activeClass={GRADE_THEME[value].active}
                  onClick={() => onGradeChange(value)}
                  className="text-lg"
                >
                  {value}きゅう
                </ChoiceButton>
              ))}
            </div>
            <ul className="bg-muted/60 text-muted-foreground mt-1 flex flex-col gap-1 rounded-xl px-3 py-2 text-xs leading-relaxed">
              {describeLevel(grade).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              どの もんだい？
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {KINDS.map((value) => (
                <ChoiceButton
                  key={value}
                  selected={kind === value}
                  onClick={() => onKindChange(value)}
                >
                  {KIND_LABEL[value]}
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              なんもん？
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {COUNTS.map((value) => (
                <ChoiceButton
                  key={value}
                  selected={count === value}
                  onClick={() => onCountChange(value)}
                >
                  {value}もん
                </ChoiceButton>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>

      <Button
        size="xl"
        onClick={onStart}
        className="w-full gap-2 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 text-lg font-bold text-white shadow-lg hover:from-amber-500/90 hover:to-orange-500/90"
      >
        <Play className="size-5" />
        スタート
      </Button>
    </div>
  )
}
