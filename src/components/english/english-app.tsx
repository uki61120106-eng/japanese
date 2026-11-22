"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { HomeScreen } from "@/components/english/home-screen"
import { InstallHint } from "@/components/install-hint"
import { PracticeScreen } from "@/components/english/practice-screen"
import { StreamScreen } from "@/components/english/stream-screen"
import { ResultScreen } from "@/components/english/result-screen"
import { buildDeck, type Answer, type Mode } from "@/lib/english-study"
import { SCENES, type Phrase, type SceneId } from "@/lib/phrases"
import {
  buildStream,
  type StreamItem,
  type StreamSource,
} from "@/lib/stream"
import { registerServiceWorker } from "@/lib/pwa"
import { shuffled } from "@/lib/shuffle"
import { getServerSupport, getSupport, subscribeSupport } from "@/lib/speech"

type Screen = "home" | "practice" | "stream" | "result"

export function EnglishApp() {
  // ホームの設定。結果画面から戻っても保たれるようにここで持つ。
  const [mode, setMode] = useState<Mode>("listen")
  const [selectedScenes, setSelectedScenes] = useState<SceneId[]>([
    "greeting",
    "self",
  ])
  const [streamSource, setStreamSource] = useState<StreamSource>("dialogue")
  const [shuffle, setShuffle] = useState(true)

  const [screen, setScreen] = useState<Screen>("home")
  const [deck, setDeck] = useState<Phrase[]>([])
  const [streamItems, setStreamItems] = useState<StreamItem[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  // 同じ設定でやり直すたびにカードの状態をリセットするための key
  const [round, setRound] = useState(0)

  /**
   * 音声の対応状況。サーバー側では判定できないため、まず「対応なし」で描画し、
   * マウント後にブラウザの実際の対応状況へ差し替える（hydration を合わせる）。
   */
  /**
   * マイクが実際に使えなかったことを覚えておく。API が存在していても、
   * 許可されない環境（アーティファクトへの埋め込みなど）では使えないため、
   * 一度失敗したらボタンを出さずに理由を出す。
   */
  const [micBlocked, setMicBlocked] = useState(false)

  // ホーム画面に追加する案内。保存はしないので、開き直すとまた出る
  const [installHintHidden, setInstallHintHidden] = useState(false)

  // ホーム画面から開けるようにする。/english 以外（1枚 HTML 版）では何もしない
  useEffect(() => {
    registerServiceWorker("/english-sw.js", "/english")
  }, [])

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

  function start() {
    // 聞き流しは採点しないので、結果画面を持たない別の画面に進む
    if (mode === "stream") {
      setStreamItems(
        buildStream({ source: streamSource, scenes: selectedScenes, shuffle })
      )
      setRound((value) => value + 1)
      setScreen("stream")
      return
    }
    startNewDeck(buildDeck({ scenes: selectedScenes, shuffle }))
  }

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          mode={mode}
          onModeChange={setMode}
          streamSource={streamSource}
          onStreamSourceChange={setStreamSource}
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
          onStart={start}
        />
      )}

      {screen === "home" && (
        <div className="mt-6">
          <InstallHint
            scope="/english"
            icon="/english/icons/icon-192.png"
            hidden={installHintHidden}
            onDismiss={() => setInstallHintHidden(true)}
            iosNote="追加したアイコンから開くと、ブラウザのバーが消えて画面を広く使えます"
          />
        </div>
      )}

      {screen === "stream" && (
        <StreamScreen
          key={round}
          items={streamItems}
          support={support}
          onQuit={() => setScreen("home")}
        />
      )}

      {screen === "practice" && (
        <PracticeScreen
          key={round}
          deck={deck}
          mode={mode}
          support={support}
          micBlocked={micBlocked}
          onMicBlocked={() => setMicBlocked(true)}
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
