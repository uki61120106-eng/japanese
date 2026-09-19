"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, CheckCircle2, Timer, XCircle } from "lucide-react"

import { ChoiceList } from "@/components/toeic/choice-list"
import { PassageView } from "@/components/toeic/passage-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { categoryMeta } from "@/lib/toeic/category"
import { BLANK, type Item, type ItemResult } from "@/lib/toeic/types"
import { cn } from "@/lib/utils"

/** 1問あたりの目標解答時間（秒）。超えると表示色が変わる。 */
const TARGET_SECONDS = { part5: 20, part7: 60 } as const

type ToeicStudyScreenProps = {
  deck: Item[]
  onFinish: (results: ItemResult[]) => void
  onQuit: () => void
}

export function ToeicStudyScreen({
  deck,
  onFinish,
  onQuit,
}: ToeicStudyScreenProps) {
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<ItemResult[]>([])
  // 本文をたたんだ文書の id。文書ごとに覚えるので、次の文書では開いた状態から始まる。
  const [collapsedPassages, setCollapsedPassages] = useState<string[]>([])

  const current = deck[index]
  const passageId = current.kind === "part7" ? current.passage.id : null
  const collapsed = passageId !== null && collapsedPassages.includes(passageId)

  function toggleCollapse() {
    if (passageId === null) return
    setCollapsedPassages(
      collapsed
        ? collapsedPassages.filter((id) => id !== passageId)
        : [...collapsedPassages, passageId]
    )
  }

  function handleNext() {
    if (index === deck.length - 1) {
      onFinish(results)
      return
    }
    setIndex(index + 1)
  }

  function handleQuit() {
    // 解答済みの分は結果画面に渡して記録に残す
    if (results.length > 0) onFinish(results)
    else onQuit()
  }

  return (
    // key を付けて、問題が変わるたびに解答状態と計測をまっさらにする
    <QuestionStage
      key={current.id}
      item={current}
      index={index}
      total={deck.length}
      isLast={index === deck.length - 1}
      collapsed={collapsed}
      onToggleCollapse={toggleCollapse}
      onAnswer={(result) => setResults([...results, result])}
      onNext={handleNext}
      onQuit={handleQuit}
    />
  )
}

type QuestionStageProps = {
  item: Item
  index: number
  total: number
  isLast: boolean
  collapsed: boolean
  onToggleCollapse: () => void
  onAnswer: (result: ItemResult) => void
  onNext: () => void
  onQuit: () => void
}

function QuestionStage({
  item,
  index,
  total,
  isLast,
  collapsed,
  onToggleCollapse,
  onAnswer,
  onNext,
  onQuit,
}: QuestionStageProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)

  const startedAtRef = useRef(0)

  // Part 5 / Part 7 のどちらでも、設問そのものは item.question で取り出せる
  const question = item.question
  const target = TARGET_SECONDS[item.kind]
  const answered = selected !== null
  const isCorrect = answered && selected === question.answer

  // 解答するまで経過秒数を更新し続ける
  useEffect(() => {
    if (selected !== null) return

    startedAtRef.current = Date.now()
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000))
    }, 250)
    return () => window.clearInterval(id)
  }, [selected])

  function handleSelect(choice: number) {
    if (selected !== null) return

    const seconds =
      startedAtRef.current === 0
        ? 0
        : Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000))

    setSelected(choice)
    setElapsed(seconds)
    onAnswer({
      itemId: item.id,
      selected: choice,
      correct: choice === question.answer,
      seconds,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm font-medium tabular-nums">
            {index + 1} / {total} 問
          </span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
                elapsed > target
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground"
              )}
            >
              <Timer className="size-3.5" />
              {elapsed}秒
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onQuit}
              className="text-muted-foreground h-7 text-xs"
            >
              やめる
            </Button>
          </div>
        </div>
        <Progress
          value={(index / total) * 100}
          className="bg-muted h-2"
          indicatorClassName="bg-indigo-600 transition-all duration-300"
        />
      </header>

      {item.kind === "part7" && (
        <PassageView
          passage={item.passage}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          showTranslation={showTranslation}
          onToggleTranslation={
            answered ? () => setShowTranslation(!showTranslation) : null
          }
        />
      )}

      <Card className="gap-4 rounded-3xl border-2 shadow-sm">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {item.kind === "part5" ? (
              <>
                <Badge variant="secondary" className="text-[0.65rem]">
                  Part 5
                </Badge>
                <span
                  className={cn(
                    "text-[0.7rem] font-bold",
                    categoryMeta(item.question.category).text
                  )}
                >
                  {categoryMeta(item.question.category).label}
                </span>
              </>
            ) : (
              <>
                <Badge variant="secondary" className="text-[0.65rem]">
                  Part 7
                </Badge>
                <span className="text-muted-foreground text-[0.7rem]">
                  設問 {item.indexInPassage} / {item.questionCount}
                </span>
              </>
            )}
          </div>

          {item.kind === "part5" ? (
            <SentenceWithBlank
              sentence={item.question.sentence}
              filled={answered ? item.question.choices[question.answer] : null}
            />
          ) : (
            <p className="font-english text-[1.05rem] leading-snug font-medium">
              {item.question.question}
            </p>
          )}

          <ChoiceList
            choices={question.choices}
            answer={question.answer}
            selected={selected}
            onSelect={handleSelect}
          />
        </CardContent>
      </Card>

      {answered && (
        <Card
          className={cn(
            "gap-3 rounded-3xl border-2 shadow-sm",
            isCorrect
              ? "border-emerald-300 dark:border-emerald-800"
              : "border-rose-300 dark:border-rose-800"
          )}
        >
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    正解
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="size-5 text-rose-600 dark:text-rose-400" />
                  <span className="font-bold text-rose-700 dark:text-rose-300">
                    不正解
                  </span>
                </>
              )}
              <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                {elapsed}秒 / 目安 {target}秒
              </span>
            </div>

            <p className="text-[0.9rem] leading-relaxed">
              {question.explanation}
            </p>

            {item.kind === "part5" && (
              <p className="text-muted-foreground border-border border-t pt-3 text-[0.85rem] leading-relaxed">
                {item.question.translation}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Button
        size="xl"
        disabled={!answered}
        onClick={onNext}
        className="w-full gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-sky-600 text-base font-bold shadow-lg hover:from-indigo-600/90 hover:to-sky-600/90"
      >
        {isLast ? "結果を見る" : "次の問題へ"}
        <ArrowRight className="size-5" />
      </Button>
    </div>
  )
}

/**
 * 空所つきの英文。答え合わせ後は正解の語を空所に入れて表示する。
 */
function SentenceWithBlank({
  sentence,
  filled,
}: {
  sentence: string
  filled: string | null
}) {
  const [before, after] = sentence.split(BLANK)

  return (
    <p className="font-english text-[1.05rem] leading-relaxed">
      {before}
      <span
        className={cn(
          "mx-0.5 inline-block border-b-2 px-1 font-bold",
          filled
            ? "border-emerald-500 text-emerald-700 dark:text-emerald-300"
            : "border-indigo-400 text-transparent"
        )}
      >
        {filled ?? "      "}
      </span>
      {after}
    </p>
  )
}
