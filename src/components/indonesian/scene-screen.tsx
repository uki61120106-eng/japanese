"use client"

import { ChevronLeft } from "lucide-react"

import { DialogueView } from "@/components/indonesian/dialogue-view"
import { RoleplayView } from "@/components/indonesian/roleplay-view"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SCENE_THEME } from "@/lib/indonesian/scene-theme"
import type { Scene } from "@/lib/indonesian/scenes"
import type { IndonesianSpeech } from "@/lib/indonesian/use-speech"
import { cn } from "@/lib/utils"

type SceneScreenProps = {
  scene: Scene
  speech: IndonesianSpeech
  onBack: () => void
}

export function SceneScreen({ scene, speech, onBack }: SceneScreenProps) {
  const theme = SCENE_THEME[scene.theme]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground -ml-2 gap-1"
        >
          <ChevronLeft className="size-4" />
          場面をえらぶ
        </Button>
      </div>

      <header
        className={cn(
          "flex items-center gap-4 rounded-3xl bg-linear-to-br p-5 text-white shadow-lg",
          theme.gradient
        )}
      >
        <span aria-hidden className="text-5xl">
          {scene.emoji}
        </span>
        <div className="flex flex-col">
          <span
            lang="id"
            className="text-xs font-bold tracking-widest opacity-90"
          >
            {scene.titleId}
          </span>
          <h1 className="text-2xl font-black">{scene.title}</h1>
          <p className="text-sm opacity-90">{scene.description}</p>
        </div>
      </header>

      {/* タブを切り替えると読み上げが残らないように止める */}
      <Tabs
        defaultValue="dialogue"
        onValueChange={() => speech.stop()}
        className="gap-4"
      >
        <TabsList className="h-11 w-full rounded-xl p-1">
          <TabsTrigger value="dialogue" className="rounded-lg text-base">
            会話を見る
          </TabsTrigger>
          <TabsTrigger value="roleplay" className="rounded-lg text-base">
            ロールプレイ
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dialogue">
          <DialogueView scene={scene} speech={speech} />
        </TabsContent>
        <TabsContent value="roleplay">
          <RoleplayView scene={scene} speech={speech} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
