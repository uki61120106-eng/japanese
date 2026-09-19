"use client"

import { useState, useSyncExternalStore } from "react"

import { HomeScreen } from "@/components/english/home-screen"
import { PracticeScreen } from "@/components/english/practice-screen"
import { ResultScreen } from "@/components/english/result-screen"
import { buildDeck, type Answer, type Mode } from "@/lib/english-study"
import { SCENES, type Phrase, type SceneId } from "@/lib/phrases"
import { shuffled } from "@/lib/shuffle"
import { getServerSupport, getSupport, subscribeSupport } from "@/lib/speech"

type Screen = "home" | "practice" | "result"

export function EnglishApp() {
  // ホームの設定。結果画面から戻っても保たれるようにここで持つ。
  const [mode, setMode] = useState<Mode>("listen")
  const [selectedScenes, setSelectedScenes] = useState<SceneId[]>([
    "greeting",
    "self",
  ])
  const [shuffle, setShuffle] = useState(true)

  const [screen, setScreen] = useState<Screen>("home")
  const [deck, setDeck] = useState<Phrase[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  // 同じ設定でやり直すたびにカードの状態をリセットするための key
  const [round, setRound] = useState(0)

  /**
   * 音声の対応状況。サーバー側では判定できないため、まず「対応なし」で描画し、
   * マウント後にブラウザの実際の対応状況へ差し替える（hydration を合わせる）。
   */
  const support = useSyncExternalStore(
    subscribeSupport,
    getSupport,
    getServerSupport
  )

  function startNewDeck(phrases: Phrase[]) {
    setDeck(phrases)
    setAnswers({})
    setRound((value) => value + 1)
    setScreen("practice")
  }

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          mode={mode}
          onModeChange={setMode}
          selectedScenes={selectedScenes}
          onSelectedScenesChange={(scenes) =>
            // ホームの並び順を保ったまま持ち、出題順と設定順を切り離す
            setSelectedScenes(
              SCENES.map((scene) => scene.id).filter((id) =>
                scenes.includes(id)
              )
            )
          }
          shuffle={shuffle}
          onShuffleChange={setShuffle}
          support={support}
          onStart={() =>
            startNewDeck(buildDeck({ scenes: selectedScenes, shuffle }))
          }
        />
      )}

      {screen === "practice" && (
        <PracticeScreen
          key={round}
          deck={deck}
          mode={mode}
          support={support}
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
            const wrong = deck.filter((p) => answers[p.id] === "unknown")
            startNewDeck(shuffle ? shuffled(wrong) : wrong)
          }}
          onHome={() => setScreen("home")}
        />
      )}
    </>
  )
}
