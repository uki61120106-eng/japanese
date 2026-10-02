"use client"

import { ChevronRight, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SCENE_THEME } from "@/lib/indonesian/scene-theme"
import { SCENES, type Scene } from "@/lib/indonesian/scenes"
import type { VoiceState } from "@/lib/indonesian/use-speech"
import { cn } from "@/lib/utils"

type SceneListProps = {
  voiceState: VoiceState
  onSelect: (scene: Scene) => void
}

export function SceneList({ voiceState, onSelect }: SceneListProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <Badge className="gap-1.5 bg-linear-to-r from-red-500 to-rose-500 px-3 py-1 text-[0.7rem] tracking-widest">
          <Sparkles className="size-3" />
          DEMO
        </Badge>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          <span lang="id">Ayo Bicara!</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          場面ごとの会話で、インドネシア語を話してみよう
        </p>
      </header>

      <VoiceNotice voiceState={voiceState} />

      <ul className="flex flex-col gap-3">
        {SCENES.map((scene) => {
          const theme = SCENE_THEME[scene.theme]
          return (
            <li key={scene.slug}>
              <button
                type="button"
                onClick={() => onSelect(scene)}
                className="bg-card focus-visible:ring-ring/60 flex w-full items-center gap-4 rounded-3xl border-2 p-4 text-left shadow-sm transition-all outline-none hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-4"
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl",
                    theme.badge
                  )}
                >
                  {scene.emoji}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-lg font-bold">{scene.title}</span>
                    <span
                      lang="id"
                      className={cn("text-xs font-bold", theme.text)}
                    >
                      {scene.titleId}
                    </span>
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {scene.description}
                  </span>
                </span>
                <ChevronRight className="text-muted-foreground size-5 shrink-0" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function VoiceNotice({ voiceState }: { voiceState: VoiceState }) {
  if (voiceState !== "unsupported" && voiceState !== "no-voice") return null
  return (
    <p className="rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
      {voiceState === "unsupported"
        ? "このブラウザは読み上げに対応していないため、音声なしで練習します。"
        : "この端末にインドネシア語の音声が見つかりませんでした。読み上げは別の言語の声になる場合があります（端末の設定で音声を追加できます）。"}
    </p>
  )
}
