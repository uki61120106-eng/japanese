"use client"

import { useState } from "react"
import { Play, Square } from "lucide-react"

import { ChatBubble } from "@/components/indonesian/chat-bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SCENE_THEME } from "@/lib/indonesian/scene-theme"
import type { Scene } from "@/lib/indonesian/scenes"
import type { IndonesianSpeech } from "@/lib/indonesian/use-speech"

type DialogueViewProps = {
  scene: Scene
  speech: IndonesianSpeech
}

/** 会話全体を読んで・聞いて覚えるモード */
export function DialogueView({ scene, speech }: DialogueViewProps) {
  const [showKana, setShowKana] = useState(true)
  const [showJa, setShowJa] = useState(true)
  const theme = SCENE_THEME[scene.theme]

  const keyOf = (index: number) => `dialogue-${scene.slug}-${index}`
  const playingIndex = scene.lines.findIndex(
    (_, index) => speech.speakingKey === keyOf(index)
  )
  const playing = playingIndex !== -1

  function playFrom(index: number) {
    if (index >= scene.lines.length) return
    speech.speak(scene.lines[index].id, {
      key: keyOf(index),
      onEnd: () => playFrom(index + 1),
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="gap-0 rounded-3xl border-2 py-3 shadow-sm">
        <CardContent className="flex flex-col gap-1 px-4">
          <ToggleRow
            id="show-kana"
            label="カタカナ読みを表示"
            checked={showKana}
            onChange={setShowKana}
          />
          <ToggleRow
            id="show-ja"
            label="日本語訳を表示"
            checked={showJa}
            onChange={setShowJa}
          />
          {speech.canSpeak && (
            <ToggleRow
              id="slow"
              label="ゆっくり読み上げる"
              checked={speech.slow}
              onChange={speech.setSlow}
            />
          )}
        </CardContent>
      </Card>

      {speech.canSpeak && (
        <Button
          size="lg"
          variant="outline"
          onClick={() => (playing ? speech.stop() : playFrom(0))}
          className="h-12 gap-2 rounded-2xl border-2 font-bold"
        >
          {playing ? (
            <>
              <Square className="size-4" />
              とめる
            </>
          ) : (
            <>
              <Play className="size-4" />
              会話をとおして聞く
            </>
          )}
        </Button>
      )}

      <div className="flex flex-col gap-3">
        {scene.lines.map((line, index) => (
          <ChatBubble
            key={index}
            line={line}
            name={scene.roles[line.speaker]}
            side={line.speaker === "A" ? "right" : "left"}
            partnerClassName={theme.bubble}
            showKana={showKana}
            showJa={showJa}
            speech={speech}
            speakKey={keyOf(index)}
            active={playingIndex === index}
          />
        ))}
      </div>

      <Card className="gap-3 rounded-3xl border-2 shadow-sm">
        <CardContent className="flex flex-col gap-3">
          <h3 className={`text-xs font-bold tracking-widest ${theme.text}`}>
            この場面のことば
          </h3>
          <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
            {scene.words.map((word) => (
              <div key={word.id} className="contents">
                <dt lang="id" className="font-bold">
                  {word.id}
                </dt>
                <dd className="text-muted-foreground text-sm">{word.ja}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

function ToggleRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
