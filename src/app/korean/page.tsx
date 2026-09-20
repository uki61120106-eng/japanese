"use client"

import { useState } from "react"

import { CardScreen } from "@/components/korean/card-screen"
import { HomeScreen } from "@/components/korean/home-screen"
import { QuizScreen } from "@/components/korean/quiz-screen"
import { ResultScreen } from "@/components/korean/result-screen"
import { CATEGORIES, type CategoryId, type Word } from "@/lib/korean"
import {
  buildDeck,
  buildQuiz,
  type Direction,
  type Mode,
  type QuizQuestion,
} from "@/lib/korean-study"
import { shuffled, wrongCards, type Answer } from "@/lib/study"

type Screen = "home" | "study" | "result"

export default function Page() {
  // ホームの設定。結果画面から戻っても保たれるようにここで持つ。
  const [mode, setMode] = useState<Mode>("card")
  const [direction, setDirection] = useState<Direction>("ko-ja")
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(
    CATEGORIES.map((category) => category.id)
  )
  const [shuffle, setShuffle] = useState(true)

  const [screen, setScreen] = useState<Screen>("home")
  const [deck, setDeck] = useState<Word[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  // 同じ設定でやり直すたびにカードや選択肢の状態をリセットするための key
  const [round, setRound] = useState(0)

  function startNewDeck(words: Word[]) {
    setDeck(words)
    // クイズの選択肢は出題ごとに引き直す
    setQuestions(mode === "quiz" ? buildQuiz(words) : [])
    setAnswers({})
    setRound((value) => value + 1)
    setScreen("study")
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-8 sm:py-12">
      {screen === "home" && (
        <HomeScreen
          mode={mode}
          onModeChange={setMode}
          direction={direction}
          onDirectionChange={setDirection}
          selectedCategories={selectedCategories}
          onSelectedCategoriesChange={setSelectedCategories}
          shuffle={shuffle}
          onShuffleChange={setShuffle}
          onStart={() =>
            startNewDeck(buildDeck({ categories: selectedCategories, shuffle }))
          }
        />
      )}

      {screen === "study" &&
        (mode === "card" ? (
          <CardScreen
            key={round}
            deck={deck}
            direction={direction}
            onFinish={(result) => {
              setAnswers(result)
              setScreen("result")
            }}
            onQuit={() => setScreen("home")}
          />
        ) : (
          <QuizScreen
            key={round}
            questions={questions}
            direction={direction}
            onFinish={(result) => {
              setAnswers(result)
              setScreen("result")
            }}
            onQuit={() => setScreen("home")}
          />
        ))}

      {screen === "result" && (
        <ResultScreen
          deck={deck}
          answers={answers}
          mode={mode}
          onRetryAll={() => startNewDeck(shuffle ? shuffled(deck) : deck)}
          onRetryWrong={() => {
            const wrong = wrongCards(deck, answers)
            startNewDeck(shuffle ? shuffled(wrong) : wrong)
          }}
          onHome={() => setScreen("home")}
        />
      )}
    </main>
  )
}
