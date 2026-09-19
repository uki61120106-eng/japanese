"use client"

import { useState } from "react"

import { HomeScreen } from "@/components/kana/home-screen"
import { ResultScreen } from "@/components/kana/result-screen"
import { StudyScreen } from "@/components/kana/study-screen"
import { ROWS, type Kana, type RowId, type Script } from "@/lib/kana"
import { shuffled } from "@/lib/shuffle"
import { buildDeck, wrongCards, type Answer } from "@/lib/study"

type Screen = "home" | "study" | "result"

export function KanaApp() {
  // ホームの設定。結果画面から戻っても保たれるようにここで持つ。
  const [script, setScript] = useState<Script>("hiragana")
  const [selectedRows, setSelectedRows] = useState<RowId[]>(
    ROWS.map((row) => row.id)
  )
  const [shuffle, setShuffle] = useState(true)

  const [screen, setScreen] = useState<Screen>("home")
  const [deck, setDeck] = useState<Kana[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  // 同じ設定でやり直すたびにカードの状態をリセットするための key
  const [round, setRound] = useState(0)

  function startNewDeck(cards: Kana[]) {
    setDeck(cards)
    setAnswers({})
    setRound((value) => value + 1)
    setScreen("study")
  }

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          script={script}
          onScriptChange={setScript}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          shuffle={shuffle}
          onShuffleChange={setShuffle}
          onStart={() =>
            startNewDeck(buildDeck({ script, rows: selectedRows, shuffle }))
          }
        />
      )}

      {screen === "study" && (
        <StudyScreen
          key={round}
          deck={deck}
          onFinish={(result) => {
            setAnswers(result)
            setScreen("result")
          }}
          onQuit={() => setScreen("home")}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          deck={deck}
          answers={answers}
          onRetryAll={() => startNewDeck(shuffle ? shuffled(deck) : deck)}
          onRetryWrong={() => {
            const wrong = wrongCards(deck, answers)
            startNewDeck(shuffle ? shuffled(wrong) : wrong)
          }}
          onHome={() => setScreen("home")}
        />
      )}
    </>
  )
}
