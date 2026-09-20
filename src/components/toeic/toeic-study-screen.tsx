"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Check, CheckCircle2, Timer, X, XCircle } from "lucide-react"

import { ChoiceList } from "@/components/toeic/choice-list"
import { DocumentView } from "@/components/toeic/document-view"
import { PhraseView } from "@/components/toeic/phrase-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LEVEL_SHORT, categoryMeta } from "@/lib/toeic/category"
import { BLANK, type Item, type ItemResult } from "@/lib/toeic/types"
import { cn } from "@/lib/utils"

/** 1問あたりの目標解答時間（秒）。超えると表示色が変わる。 */
const TARGET_SECONDS = { part5: 20, part7: 60, phrase: 15 } as const

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
  // 本文をたたんだセットの id。セットごとに覚えるので、次のセットでは開いた状態から始まる。
  const [collapsedSets, setCollapsedSets] = useState<string[]>([])

  const current = deck[index]
  const setId = current.kind === "part7" ? current.set.id : null
  const collapsed = setId !== null && collapsedSets.includes(setId)
  const isLast = index === deck.length - 1

  function toggleCollapse() {
    if (setId === null) return
    setCollapsedSets(
      collapsed
        ? collapsedSets.filter((id) => id !== setId)
        : [...collapsedSets, setId]
    )
  }

  /**
   * 解答を記録する。advance が true ならそのまま次へ進む
   * （フレーズカードは1タップで次に行きたいので、記録と前進をまとめて行う）。
   */
  function commit(result: ItemResult, advance: boolean) {
    const next = [...results, result]
    setResults(next)
    if (!advance) return
    if (isLast) onFinish(next)
    else setIndex(index + 1)
  }

  function handleNext() {
    if (isLast) onFinish(results)
    else setIndex(index + 1)
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
      isLast={isLast}
      collapsed={collapsed}
      onToggleCollapse={toggleCollapse}
      onCommit={commit}
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
  onCommit: (result: ItemResult, advance: boolean) => void
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
  onCommit,
  onNext,
  onQuit,
}: QuestionStageProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const startedAtRef = useRef(0)

  const target = TARGET_SECONDS[item.kind]
  const answered = selected !== null

  // 解答するまで経過秒数を更新し続ける
  useEffect(() => {
    if (selected !== null) return

    startedAtRef.current = Date.now()
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000))
    }, 250)
    return () => window.clearInterval(id)
  }, [selected])

  function seconds() {
    if (startedAtRef.current === 0) return 0
    return Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000))
  }

  function handleSelect(choice: number) {
    if (selected !== null || item.kind === "phrase") return

    const taken = seconds()
    setSelected(choice)
    setElapsed(taken)
    onCommit(
      {
        itemId: item.id,
        selected: choice,
        correct: choice === item.question.answer,
        seconds: taken,
      },
      false
    )
  }

  /** フレーズカードは「おぼえてた / あやふや」でそのまま次へ進む */
  function handlePhraseAnswer(known: boolean) {
    if (selected !== null) return

    const taken = seconds()
    setSelected(known ? 1 : 0)
    onCommit(
      {
        itemId: item.id,
        selected: known ? 1 : 0,
        correct: known,
        seconds: taken,
      },
      true
    )
  }

  const isCorrect =
    answered && item.kind !== "phrase" && selected === item.question.answer

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

      {item.kind === "phrase" ? (
        <>
          <PhraseView
            card={item.card}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
          />

          {revealed && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="xl"
                variant="outline"
                onClick={() => handlePhraseAnswer(false)}
                className="h-16 gap-2 rounded-2xl border-2 border-slate-300 text-base font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="size-5" />
                あやふや
              </Button>
              <Button
                size="xl"
                onClick={() => handlePhraseAnswer(true)}
                className="h-16 gap-2 rounded-2xl bg-emerald-500 text-base font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500/90"
              >
                <Check className="size-5" />
                おぼえてた
              </Button>
            </div>
          )}

          {!revealed && (
            <p className="text-muted-foreground text-center text-xs">
              意味と使い方を思い出してから、めくってください
            </p>
          )}
        </>
      ) : (
        <>
          {item.kind === "part7" && (
            <DocumentView
              set={item.set}
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
              <div className="flex flex-wrap items-center gap-2">
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
                    <span className="text-muted-foreground text-[0.65rem]">
                      {LEVEL_SHORT[item.question.level]}
                    </span>
                  </>
                ) : (
                  <>
                    <Badge variant="secondary" className="text-[0.65rem]">
                      Part 7
                    </Badge>
                    <span className="text-muted-foreground text-[0.7rem]">
                      設問 {item.indexInSet} / {item.questionCount}
                    </span>
                    <span className="text-muted-foreground text-[0.65rem]">
                      {LEVEL_SHORT[item.set.level]}
                    </span>
                  </>
                )}
              </div>

              {item.kind === "part5" ? (
                <SentenceWithBlank
                  sentence={item.question.sentence}
                  filled={
                    answered
                      ? item.question.choices[item.question.answer]
                      : null
                  }
                />
              ) : (
                <p className="font-english text-[1.05rem] leading-snug font-medium">
                  {item.question.question}
                </p>
              )}

              <ChoiceList
                choices={item.question.choices}
                answer={item.question.answer}
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
                  {item.question.explanation}
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
        </>
      )}
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
