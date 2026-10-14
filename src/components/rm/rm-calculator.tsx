"use client"

import { useEffect, useState } from "react"
import { Calculator, Info, Minus, Plus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ACCURATE_REPS,
  FORMULAS,
  GOAL_ZONES,
  MAX_REPS,
  estimateOneRm,
  roundToStep,
  weightForReps,
  type FormulaId,
} from "@/lib/rm/formulas"
import { DEFAULT_INPUT, loadInput, saveInput, type RmInput } from "@/lib/rm/storage"

/** 換算表に並べる回数 */
const TABLE_REPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]
const STEPS = [0.5, 1.25, 2.5, 5]
const MAX_WEIGHT_KG = 1000

const inputClass =
  "border-input bg-background focus-visible:ring-ring/50 h-12 w-full rounded-xl border px-3 text-xl font-bold tabular-nums outline-none focus-visible:ring-[3px]"

function formatKg(kg: number): string {
  // 刻みが 1.25 のときに 2 桁目まで見せ、それ以外は余分な 0 を出さない
  return Number.isInteger(kg) ? kg.toString() : kg.toFixed(2).replace(/0$/, "")
}

function clampReps(reps: number): number {
  return Math.min(MAX_REPS, Math.max(1, Math.round(reps)))
}

export function RmCalculator() {
  const [input, setInput] = useState<RmInput>(DEFAULT_INPUT)
  const [loaded, setLoaded] = useState(false)

  // localStorage はサーバー描画時に無いので、表示後に読み込む
  useEffect(() => {
    const saved = loadInput()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 端末の保存値は描画後にしか読めない
    setInput({ ...saved, reps: clampReps(saved.reps) })
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) saveInput(input)
  }, [input, loaded])

  const update = (patch: Partial<RmInput>) => setInput((prev) => ({ ...prev, ...patch }))

  const weight = Number(input.weight)
  const valid = input.weight !== "" && weight > 0 && weight <= MAX_WEIGHT_KG
  const oneRm = valid ? estimateOneRm(weight, input.reps, input.formula) : null

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <p className="text-primary flex items-center gap-1.5 text-sm font-bold">
          <Calculator className="size-4" aria-hidden />
          RM 計算機
        </p>
        <h1 className="text-2xl font-extrabold">最大挙上重量（1RM）を推定する</h1>
        <p className="text-muted-foreground text-sm">
          挙げた重量と回数から、1回だけ挙げられる重さ（1RM）と、回数ごとの目安の重量を計算します。
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rm-weight" className="text-sm font-bold">
                重量
              </label>
              <div className="relative">
                <input
                  id="rm-weight"
                  type="number"
                  inputMode="decimal"
                  step="0.25"
                  min="0"
                  max={MAX_WEIGHT_KG}
                  placeholder="60"
                  value={input.weight}
                  aria-invalid={input.weight !== "" && !valid}
                  onChange={(event) => update({ weight: event.target.value })}
                  className={cn(inputClass, "pr-10")}
                />
                <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                  kg
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rm-reps" className="text-sm font-bold">
                回数
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="回数を減らす"
                  disabled={input.reps <= 1}
                  onClick={() => update({ reps: clampReps(input.reps - 1) })}
                  className="bg-secondary text-secondary-foreground grid size-12 shrink-0 place-items-center rounded-xl disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <input
                  id="rm-reps"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max={MAX_REPS}
                  value={input.reps}
                  onChange={(event) => {
                    const next = Number(event.target.value)
                    if (Number.isFinite(next) && event.target.value !== "") {
                      update({ reps: clampReps(next) })
                    }
                  }}
                  className={cn(inputClass, "min-w-0 px-1 text-center")}
                />
                <button
                  type="button"
                  aria-label="回数を増やす"
                  disabled={input.reps >= MAX_REPS}
                  onClick={() => update({ reps: clampReps(input.reps + 1) })}
                  className="bg-secondary text-secondary-foreground grid size-12 shrink-0 place-items-center rounded-xl disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {input.weight !== "" && !valid && (
            <p className="text-destructive text-sm" role="alert">
              重量は 0 より大きく {MAX_WEIGHT_KG} kg 以下で入力してください。
            </p>
          )}
          {input.reps > ACCURATE_REPS && (
            <p className="flex gap-1.5 rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/60 dark:text-amber-100">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              {ACCURATE_REPS}回を超えると推定のずれが大きくなります。重めの重量（{ACCURATE_REPS}
              回以下で限界になる重さ）で測ると正確です。
            </p>
          )}

          <div className="bg-primary/10 flex flex-col items-center gap-1 rounded-2xl py-5" aria-live="polite">
            <p className="text-sm font-bold">推定 1RM</p>
            <p className="text-primary text-5xl font-extrabold tabular-nums">
              {oneRm === null ? "—" : formatKg(roundToStep(oneRm, 0.5))}
              <span className="ml-1 text-xl">kg</span>
            </p>
            {oneRm !== null && (
              <p className="text-muted-foreground text-xs tabular-nums">
                計算値 {oneRm.toFixed(1)} kg（0.5 kg 単位で表示）
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>計算に使う式</CardTitle>
          <CardDescription>
            式によって数 kg の差が出ます。迷ったら「平均」のままで構いません。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div role="radiogroup" aria-label="計算に使う式" className="flex flex-col gap-1.5">
            <FormulaRow
              id="average"
              name="平均（おすすめ）"
              expression="下の7式の平均"
              selected={input.formula === "average"}
              value={valid ? estimateOneRm(weight, input.reps, "average") : null}
              onSelect={(formula) => update({ formula })}
            />
            {FORMULAS.map((f) => (
              <FormulaRow
                key={f.id}
                id={f.id}
                name={f.name}
                expression={f.expression}
                selected={input.formula === f.id}
                value={valid ? estimateOneRm(weight, input.reps, f.id) : null}
                onSelect={(formula) => update({ formula })}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>回数ごとの重量（RM 換算表）</CardTitle>
          <CardDescription>
            「n RM」は n 回までなら挙げられる重さ。プレートの刻みに合わせて丸めています。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">刻み</span>
            <div className="flex gap-1" role="radiogroup" aria-label="重量の刻み">
              {STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  role="radio"
                  aria-checked={input.step === step}
                  onClick={() => update({ step })}
                  className={cn(
                    "rounded-full px-3 py-1 font-bold tabular-nums",
                    input.step === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {step}
                </button>
              ))}
            </div>
            <span className="text-muted-foreground">kg</span>
          </div>

          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-muted-foreground border-b text-left text-xs">
                <th className="py-2 font-medium">回数</th>
                <th className="py-2 text-right font-medium">1RM 比</th>
                <th className="py-2 text-right font-medium">重量</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_REPS.map((reps) => {
                const kg = oneRm === null ? null : weightForReps(oneRm, reps, input.formula)
                const pct = oneRm === null || kg === null ? null : (kg / oneRm) * 100
                const current = reps === input.reps
                return (
                  <tr
                    key={reps}
                    className={cn("border-b last:border-0", current && "bg-primary/10 font-bold")}
                  >
                    <td className="py-2 pl-1">
                      {reps} RM{current && <span className="text-primary ml-1 text-xs">入力</span>}
                    </td>
                    <td className="py-2 text-right">{pct === null ? "—" : `${Math.round(pct)}%`}</td>
                    <td className="py-2 pr-1 text-right font-bold">
                      {kg === null ? "—" : `${formatKg(roundToStep(kg, input.step))} kg`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>目的別の重量の目安</CardTitle>
          <CardDescription>1RM に対する割合（%1RM）からの目安です。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {GOAL_ZONES.map((zone) => (
            <div key={zone.id} className="bg-secondary/60 flex flex-col gap-1 rounded-xl px-4 py-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-bold">{zone.label}</p>
                <p className="text-primary text-lg font-extrabold tabular-nums">
                  {oneRm === null
                    ? "—"
                    : `${formatKg(roundToStep((oneRm * zone.minPct) / 100, input.step))}〜${formatKg(
                        roundToStep((oneRm * zone.maxPct) / 100, input.step)
                      )} kg`}
                </p>
              </div>
              <p className="text-muted-foreground text-xs">
                {zone.minPct}〜{zone.maxPct}%1RM ・ {zone.reps} ・ {zone.sets}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <section className="text-muted-foreground flex flex-col gap-1 text-xs leading-relaxed">
        <p className="text-foreground font-bold">使うときの注意</p>
        <p>・計算結果は推定値です。種目・経験・疲れ具合によって実際の 1RM とは差が出ます。</p>
        <p>・実際に 1RM を測るときは、十分なウォームアップをし、補助者やセーフティバーを付けてください。</p>
        <p>・入力した値はこの端末のブラウザにだけ保存され、外部には送信されません。</p>
      </section>
    </div>
  )
}

function FormulaRow({
  id,
  name,
  expression,
  selected,
  value,
  onSelect,
}: {
  id: FormulaId
  name: string
  expression: string
  selected: boolean
  value: number | null
  onSelect: (id: FormulaId) => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(id)}
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
        selected ? "border-primary bg-primary/10" : "hover:bg-secondary/60 border-transparent"
      )}
    >
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-bold">{name}</span>
        <span className="text-muted-foreground truncate text-xs">{expression}</span>
      </span>
      <span className="shrink-0 font-bold tabular-nums">
        {value === null ? "—" : `${value.toFixed(1)} kg`}
      </span>
    </button>
  )
}
