"use client"

import { useState, useSyncExternalStore } from "react"

import { BattleScreen } from "@/components/puzzle/battle-screen"
import { MonsterScreen } from "@/components/puzzle/monster-screen"
import { QuestHome } from "@/components/puzzle/quest-home"
import { QuestResult } from "@/components/puzzle/quest-result"
import { partyMembers } from "@/lib/puzzle/party"
import { applyClearRewards, type ClearRewards } from "@/lib/puzzle/save"
import {
  getSaveSnapshot,
  getServerSaveSnapshot,
  subscribeSave,
  updateSave,
} from "@/lib/puzzle/save-store"
import type { Dungeon } from "@/lib/puzzle/types"

type Screen = "home" | "battle" | "result" | "monsters"

export default function PuzzlePage() {
  // localStorage はサーバー描画では読めないので、外部ストアとして購読する
  const save = useSyncExternalStore(
    subscribeSave,
    getSaveSnapshot,
    getServerSaveSnapshot
  )
  const [screen, setScreen] = useState<Screen>("home")
  const [dungeon, setDungeon] = useState<Dungeon | null>(null)
  const [outcome, setOutcome] = useState<"win" | "lose">("win")
  const [rewards, setRewards] = useState<ClearRewards | null>(null)
  const [turns, setTurns] = useState(0)
  // 同じダンジョンに挑み直すたびにバトルの状態を作り直すための key
  const [round, setRound] = useState(0)

  if (!save) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-8">
        <div className="bg-muted/50 h-64 w-full animate-pulse rounded-3xl" />
      </main>
    )
  }

  const members = partyMembers(save)

  function startBattle(next: Dungeon) {
    setDungeon(next)
    setRound((value) => value + 1)
    setScreen("battle")
  }

  function finishBattle(result: "win" | "lose", playedTurns: number) {
    if (!dungeon || !save) return
    setOutcome(result)
    setTurns(playedTurns)
    if (result === "win") {
      const earned = applyClearRewards(save, dungeon)
      updateSave(earned.save)
      setRewards(earned)
    } else {
      setRewards(null)
    }
    setScreen("result")
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-6 sm:py-10">
      {screen === "home" && (
        <QuestHome
          save={save}
          members={members}
          onStart={startBattle}
          onOpenMonsters={() => setScreen("monsters")}
          onChangeTimeLimit={(seconds) =>
            updateSave({ ...save, settings: { ...save.settings, timeLimitSec: seconds } })
          }
        />
      )}

      {screen === "battle" && dungeon && (
        <BattleScreen
          key={`${dungeon.id}-${round}`}
          dungeon={dungeon}
          members={members}
          timeLimitSec={save.settings.timeLimitSec}
          onFinish={finishBattle}
          onQuit={() => setScreen("home")}
        />
      )}

      {screen === "result" && dungeon && (
        <QuestResult
          dungeon={dungeon}
          outcome={outcome}
          turns={turns}
          rewards={rewards}
          onRetry={() => startBattle(dungeon)}
          onHome={() => setScreen("home")}
        />
      )}

      {screen === "monsters" && (
        <MonsterScreen
          save={save}
          onChange={updateSave}
          onBack={() => setScreen("home")}
        />
      )}
    </main>
  )
}
