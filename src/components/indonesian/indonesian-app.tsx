"use client"

import { useState } from "react"

import { SceneList } from "@/components/indonesian/scene-list"
import { SceneScreen } from "@/components/indonesian/scene-screen"
import type { Scene } from "@/lib/indonesian/scenes"
import { useIndonesianSpeech } from "@/lib/indonesian/use-speech"

export function IndonesianApp() {
  const speech = useIndonesianSpeech()
  const [scene, setScene] = useState<Scene | null>(null)

  function open(next: Scene | null) {
    speech.stop()
    setScene(next)
    window.scrollTo({ top: 0 })
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-8 sm:py-12">
      {scene ? (
        <SceneScreen
          key={scene.slug}
          scene={scene}
          speech={speech}
          onBack={() => open(null)}
        />
      ) : (
        <SceneList voiceState={speech.voiceState} onSelect={open} />
      )}
    </main>
  )
}
