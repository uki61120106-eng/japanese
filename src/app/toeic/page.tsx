"use client"

import { useState } from "react"

import {
  ToeicHomeScreen,
  type StudyMode,
} from "@/components/toeic/toeic-home-screen"
import { ToeicResultScreen } from "@/components/toeic/toeic-result-screen"
import { ToeicStudyScreen } from "@/components/toeic/toeic-study-screen"
import { PART5_CATEGORIES, PHRASE_CATEGORIES } from "@/lib/toeic/category"
import {
  REVIEW_LENGTH,
  buildPart5Session,
  buildPart7Session,
  buildPhraseSession,
  buildReviewSession,
  shuffled,
} from "@/lib/toeic/session"
import { mergeResults } from "@/lib/toeic/srs"
import { resetLog, useStudyLog, writeLog } from "@/lib/toeic/storage"
import type {
  Item,
  ItemResult,
  Level,
  Part5Category,
  PhraseCategory,
} from "@/lib/toeic/types"

type Screen = "home" | "study" | "result"

export default function ToeicPage() {
  // 学習ログは localStorage にある。サーバー描画時は空のログが返り、
  // ハイドレーション後に本物へ差し替わる（at が 0 でなくなる）。
  const { log, at } = useStudyLog()

  const [mode, setMode] = useState<StudyMode>("phrase")
  const [categories, setCategories] = useState<Part5Category[]>(
    PART5_CATEGORIES.map((category) => category.id)
  )
  const [levels, setLevels] = useState<Level[]>(["core", "advanced"])
  const [part5Length, setPart5Length] = useState(10)
  const [part7Count, setPart7Count] = useState(1)
  const [phraseCategories, setPhraseCategories] = useState<PhraseCategory[]>(
    PHRASE_CATEGORIES.map((category) => category.id)
  )
  const [phraseLength, setPhraseLength] = useState(20)

  const [screen, setScreen] = useState<Screen>("home")
  const [deck, setDeck] = useState<Item[]>([])
  const [results, setResults] = useState<ItemResult[]>([])
  // 同じ設定でやり直すたびに出題画面の状態をリセットするための key
  const [round, setRound] = useState(0)

  function startDeck(cards: Item[]) {
    if (cards.length === 0) return
    setDeck(cards)
    setResults([])
    setRound((value) => value + 1)
    setScreen("study")
  }

  function handleStart() {
    const now = Date.now()

    if (mode === "review") {
      startDeck(buildReviewSession(REVIEW_LENGTH, log, now))
      return
    }
    if (mode === "phrase") {
      startDeck(
        buildPhraseSession(
          { categories: phraseCategories, length: phraseLength },
          log,
          now
        )
      )
      return
    }
    if (mode === "part5") {
      startDeck(
        buildPart5Session(
          { categories, levels, length: part5Length },
          log,
          now
        )
      )
      return
    }
    startDeck(buildPart7Session(levels, part7Count, log, now))
  }

  function handleFinish(sessionResults: ItemResult[]) {
    const now = Date.now()
    writeLog(mergeResults(log, sessionResults, now), now)
    setResults(sessionResults)
    setScreen("result")
  }

  function handleRetryWrong() {
    const byId = new Map(deck.map((item) => [item.id, item]))
    const wrong = results
      .filter((result) => !result.correct)
      .map((result) => byId.get(result.itemId))
      .filter((item): item is Item => item !== undefined)

    startDeck(shuffled(wrong))
  }

  function handleResetLog() {
    const ok = window.confirm(
      "このブラウザに保存した学習記録をすべて消します。元に戻せません。よろしいですか。"
    )
    if (!ok) return

    resetLog(Date.now())
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8 sm:py-12">
      {screen === "home" && (
        <ToeicHomeScreen
          log={log}
          now={at}
          ready={at > 0}
          mode={mode}
          onModeChange={setMode}
          categories={categories}
          onCategoriesChange={setCategories}
          levels={levels}
          onLevelsChange={setLevels}
          part5Length={part5Length}
          onPart5LengthChange={setPart5Length}
          part7Count={part7Count}
          onPart7CountChange={setPart7Count}
          phraseCategories={phraseCategories}
          onPhraseCategoriesChange={setPhraseCategories}
          phraseLength={phraseLength}
          onPhraseLengthChange={setPhraseLength}
          onStart={handleStart}
          onResetLog={handleResetLog}
        />
      )}

      {screen === "study" && (
        <ToeicStudyScreen
          key={round}
          deck={deck}
          onFinish={handleFinish}
          onQuit={() => setScreen("home")}
        />
      )}

      {screen === "result" && (
        <ToeicResultScreen
          deck={deck}
          results={results}
          onRetryWrong={handleRetryWrong}
          onHome={() => setScreen("home")}
        />
      )}
    </main>
  )
}
