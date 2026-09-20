"use client"

import { Home, RefreshCw, Timer } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { categoryMeta, phraseCategoryMeta } from "@/lib/toeic/category"
import { BLANK, type Item, type ItemResult } from "@/lib/toeic/types"
import { cn } from "@/lib/utils"

type ToeicResultScreenProps = {
  deck: Item[]
  results: ItemResult[]
  onRetryWrong: () => void
  onHome: () => void
}

export function ToeicResultScreen({
  deck,
  results,
  onRetryWrong,
  onHome,
}: ToeicResultScreenProps) {
  const answered = results.length
  const correct = results.filter((result) => result.correct).length
  const accuracy = answered === 0 ? 0 : Math.round((correct / answered) * 100)
  const totalSeconds = results.reduce((sum, result) => sum + result.seconds, 0)
  const averageSeconds =
    answered === 0 ? 0 : Math.round(totalSeconds / answered)

  const byId = new Map(deck.map((item) => [item.id, item]))
  const wrong = results
    .filter((result) => !result.correct)
    .map((result) => byId.get(result.itemId))
    .filter((item): item is Item => item !== undefined)

  // このセットに含まれていた Part 5 のカテゴリ別内訳
  const categoryRows = buildCategoryRows(deck, results)

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-black tracking-tight">おつかれさまでした</h1>
        <p className="text-muted-foreground text-sm">
          {answered} 問に解答しました
        </p>
      </header>

      <Card className="rounded-3xl border-2 shadow-sm">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-end justify-center gap-2">
            <span
              className={cn(
                "text-6xl font-black tabular-nums",
                accuracy >= 80
                  ? "text-emerald-600 dark:text-emerald-400"
                  : accuracy >= 60
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-rose-600 dark:text-rose-400"
              )}
            >
              {accuracy}
            </span>
            <span className="text-muted-foreground pb-2 text-xl font-bold">
              %
            </span>
          </div>

          <Progress
            value={accuracy}
            className="bg-muted h-2.5"
            indicatorClassName={cn(
              "transition-all duration-500",
              accuracy >= 80
                ? "bg-emerald-500"
                : accuracy >= 60
                  ? "bg-indigo-600"
                  : "bg-rose-500"
            )}
          />

          <div className="grid grid-cols-3 gap-3 text-center">
            <Figure label="正解" value={`${correct}`} unit="問" />
            <Figure label="不正解" value={`${answered - correct}`} unit="問" />
            <Figure
              label="1問あたり"
              value={`${averageSeconds}`}
              unit="秒"
              icon={<Timer className="size-3" />}
            />
          </div>
        </CardContent>
      </Card>

      {categoryRows.length > 0 && (
        <Card className="rounded-3xl border-2 shadow-sm">
          <CardContent className="flex flex-col gap-3">
            <h2 className="text-sm font-bold">カテゴリ別</h2>
            <div className="flex flex-col gap-2">
              {categoryRows.map((row) => {
                const meta = categoryMeta(row.category)
                const rate = Math.round((row.correct / row.total) * 100)
                return (
                  <div key={row.category} className="flex items-center gap-3">
                    <span
                      className={cn("w-16 shrink-0 text-xs font-bold", meta.text)}
                    >
                      {meta.label}
                    </span>
                    <Progress
                      value={rate}
                      className="bg-muted h-2 flex-1"
                      indicatorClassName={meta.fill}
                    />
                    <span className="text-muted-foreground w-14 shrink-0 text-right text-xs tabular-nums">
                      {row.correct} / {row.total}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {wrong.length > 0 && (
        <Card className="rounded-3xl border-2 shadow-sm">
          <CardContent className="flex flex-col gap-3">
            <h2 className="text-sm font-bold">見直したい問題</h2>
            <ul className="flex flex-col gap-3">
              {wrong.map((item) => (
                <li
                  key={item.id}
                  className="border-border flex flex-col gap-1 border-l-2 pl-3"
                >
                  {item.kind === "part5" && (
                    <>
                      <Badge
                        variant="secondary"
                        className="w-fit text-[0.6rem]"
                      >
                        {categoryMeta(item.question.category).label}
                      </Badge>
                      <p className="font-english text-[0.85rem] leading-snug">
                        {item.question.sentence.replace(
                          BLANK,
                          item.question.choices[item.question.answer]
                        )}
                      </p>
                    </>
                  )}

                  {item.kind === "part7" && (
                    <>
                      <Badge
                        variant="secondary"
                        className="w-fit text-[0.6rem]"
                      >
                        Part 7
                      </Badge>
                      <p className="font-english text-[0.85rem] leading-snug">
                        {item.question.question}
                      </p>
                      <p className="text-muted-foreground font-english text-[0.75rem]">
                        正解: {item.question.choices[item.question.answer]}
                      </p>
                    </>
                  )}

                  {item.kind === "phrase" && (
                    <>
                      <Badge
                        variant="secondary"
                        className="w-fit text-[0.6rem]"
                      >
                        {phraseCategoryMeta(item.card.category).label}
                      </Badge>
                      <p className="font-english text-[0.85rem] leading-snug font-bold">
                        {item.card.phrase}
                      </p>
                      <p className="text-muted-foreground text-[0.75rem]">
                        {item.card.meaning}
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs">
              ここに出たものは、次の「復習」メニューにそのまま並びます。
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2 pb-4">
        {wrong.length > 0 && (
          <Button
            size="xl"
            onClick={onRetryWrong}
            className="w-full gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-sky-600 text-base font-bold shadow-lg hover:from-indigo-600/90 hover:to-sky-600/90"
          >
            <RefreshCw className="size-5" />
            まちがえた {wrong.length} 問をもう一度
          </Button>
        )}
        <Button
          size="xl"
          variant="outline"
          onClick={onHome}
          className="w-full gap-2 rounded-2xl border-2 text-base font-bold"
        >
          <Home className="size-5" />
          ホームへもどる
        </Button>
      </div>
    </div>
  )
}

function Figure({
  label,
  value,
  unit,
  icon,
}: {
  label: string
  value: string
  unit: string
  icon?: React.ReactNode
}) {
  return (
    <div className="bg-muted/60 flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2.5">
      <span className="text-muted-foreground inline-flex items-center gap-1 text-[0.65rem] tracking-wider">
        {icon}
        {label}
      </span>
      <span className="flex items-baseline gap-0.5">
        <span className="text-2xl font-black tabular-nums">{value}</span>
        <span className="text-muted-foreground text-[0.65rem]">{unit}</span>
      </span>
    </div>
  )
}

type CategoryRow = {
  category: ReturnType<typeof categoryMeta>["id"]
  total: number
  correct: number
}

function buildCategoryRows(deck: Item[], results: ItemResult[]): CategoryRow[] {
  const byId = new Map(results.map((result) => [result.itemId, result]))
  const rows = new Map<CategoryRow["category"], CategoryRow>()

  for (const item of deck) {
    if (item.kind !== "part5") continue
    const result = byId.get(item.id)
    if (!result) continue

    const row = rows.get(item.question.category) ?? {
      category: item.question.category,
      total: 0,
      correct: 0,
    }
    row.total += 1
    if (result.correct) row.correct += 1
    rows.set(item.question.category, row)
  }

  return [...rows.values()]
}
