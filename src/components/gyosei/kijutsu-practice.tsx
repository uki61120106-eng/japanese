"use client"

import { useState } from "react"
import { Check, PenLine } from "lucide-react"

import { SubjectBadge } from "@/components/gyosei/common"
import { Button } from "@/components/ui/button"
import { topicName } from "@/lib/gyosei/content"
import type { Kijutsu } from "@/lib/gyosei/types"
import { cn } from "@/lib/utils"

/** 記述式の答案欄。書いた字数を数え、40字の目安を示す。 */
export function KijutsuAnswerBox({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const length = [...value.replace(/\s/g, "")].length
  return (
    <div className="flex flex-col gap-1">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        rows={3}
        placeholder="45字以内を目安に書いてみよう"
        className="bg-background focus-visible:ring-ring/50 w-full resize-none rounded-xl border p-3 text-base leading-relaxed outline-none focus-visible:ring-[3px] disabled:opacity-70"
      />
      <span
        className={cn(
          "text-right text-xs tabular-nums",
          length > 45 ? "text-destructive font-bold" : "text-muted-foreground"
        )}
      >
        {length} 字
      </span>
    </div>
  )
}

/** キーワードごとに自分の答案に含まれているかチェックして自己採点する */
export function KijutsuGrader({
  kijutsu,
  checked,
  onCheckedChange,
}: {
  kijutsu: Kijutsu
  checked: number[]
  onCheckedChange: (checked: number[]) => void
}) {
  const score = checked.reduce(
    (sum, index) => sum + kijutsu.keywords[index].points,
    0
  )
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-3">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
          解答例
        </p>
        <p className="mt-1 leading-relaxed">{kijutsu.modelAnswer}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs">
          自分の答案に含まれている要素にチェック（部分点の目安）
        </p>
        {kijutsu.keywords.map((keyword, index) => {
          const on = checked.includes(index)
          return (
            <button
              key={keyword.text}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() =>
                onCheckedChange(
                  on ? checked.filter((i) => i !== index) : [...checked, index]
                )
              }
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border-2 px-3 py-2 text-left text-sm transition-colors",
                on
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border-2",
                    on ? "border-emerald-500 bg-emerald-500 text-white" : "border-border"
                  )}
                >
                  {on && <Check className="size-3.5" />}
                </span>
                {keyword.text}
              </span>
              <span className="text-muted-foreground shrink-0 tabular-nums">
                {keyword.points}点
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-right text-lg font-extrabold tabular-nums">
        自己採点 {score} / 20 点
      </p>
    </div>
  )
}

/** 学習セットや理解度画面から使う、記述式1問の練習 */
export function KijutsuPractice({
  kijutsu,
  onDone,
  doneLabel = "記録して次へ",
}: {
  kijutsu: Kijutsu
  onDone: (score: number) => void
  doneLabel?: string
}) {
  const [text, setText] = useState("")
  const [revealed, setRevealed] = useState(false)
  const [checked, setChecked] = useState<number[]>([])
  const score = checked.reduce(
    (sum, index) => sum + kijutsu.keywords[index].points,
    0
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <PenLine className="text-primary size-4" />
        <span className="text-sm font-bold">記述式</span>
        <SubjectBadge subject={kijutsu.subject} />
        <span className="text-muted-foreground truncate text-xs">
          {topicName(kijutsu.subject, kijutsu.topic)}
        </span>
      </div>
      <p className="leading-relaxed">{kijutsu.prompt}</p>
      <KijutsuAnswerBox value={text} onChange={setText} disabled={revealed} />
      {revealed ? (
        <>
          <KijutsuGrader
            kijutsu={kijutsu}
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Button size="lg" className="rounded-xl" onClick={() => onDone(score)}>
            {doneLabel}
          </Button>
        </>
      ) : (
        <Button size="lg" className="rounded-xl" onClick={() => setRevealed(true)}>
          解答例を見る
        </Button>
      )}
    </div>
  )
}
