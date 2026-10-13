"use client"

import { Ear, Mic, Play, Shuffle, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Mode } from "@/lib/english-study"
import { GROUPS, SCENES, sceneCount, type SceneId } from "@/lib/phrases"
import { SCENE_THEME } from "@/lib/scene-theme"
import type { SpeechSupport } from "@/lib/speech"
import { cn } from "@/lib/utils"

type HomeScreenProps = {
  mode: Mode
  onModeChange: (mode: Mode) => void
  selectedScenes: SceneId[]
  onSelectedScenesChange: (scenes: SceneId[]) => void
  shuffle: boolean
  onShuffleChange: (shuffle: boolean) => void
  support: SpeechSupport
  onStart: () => void
}

export function HomeScreen({
  mode,
  onModeChange,
  selectedScenes,
  onSelectedScenesChange,
  shuffle,
  onShuffleChange,
  support,
  onStart,
}: HomeScreenProps) {
  const selected = new Set(selectedScenes)
  const total = selectedScenes.reduce((sum, id) => sum + sceneCount(id), 0)
  const allSelected = selectedScenes.length === SCENES.length

  function toggleScene(sceneId: SceneId) {
    onSelectedScenesChange(
      selected.has(sceneId)
        ? selectedScenes.filter((id) => id !== sceneId)
        : [...selectedScenes, sceneId]
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <Badge className="gap-1.5 bg-linear-to-r from-sky-500 to-indigo-500 px-3 py-1 text-[0.7rem] tracking-widest">
          <Sparkles className="size-3" />
          DEMO
        </Badge>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          えいかいわフラッシュ
        </h1>
        <p className="text-muted-foreground text-sm">
          場面ごとの決まり文句を、聞いて・声に出して覚えよう
        </p>
      </header>

      <Card className="gap-5 rounded-3xl border-2 shadow-lg">
        <CardContent className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              れんしゅうの しかた
            </Label>
            <Tabs
              value={mode}
              onValueChange={(value) => onModeChange(value as Mode)}
            >
              <TabsList className="h-11 w-full rounded-xl p-1">
                <TabsTrigger value="listen" className="gap-1.5 rounded-lg">
                  <Ear className="size-4" />
                  聞いて覚える
                </TabsTrigger>
                <TabsTrigger
                  value="speak"
                  disabled={!support.listen}
                  className="gap-1.5 rounded-lg"
                >
                  <Mic className="size-4" />
                  声に出す
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {mode === "speak"
                ? "マイクで発音をチェックします。ブラウザにマイクの使用を許可してください。"
                : support.listen
                  ? "英語を読み上げて聞くモードです。発音チェックを使うなら「声に出す」を選んでください。"
                  : "このブラウザは音声の聞き取りに対応していないため、「声に出す」は選べません（Chrome や Edge で使えます）。"}
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-muted-foreground text-xs tracking-widest">
                れんしゅうする ばめん
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  onSelectedScenesChange(
                    allSelected ? [] : SCENES.map((scene) => scene.id)
                  )
                }
              >
                {allSelected ? "すべて外す" : "すべて選ぶ"}
              </Button>
            </div>

            {GROUPS.map((group) => (
              <div key={group.id} className="flex flex-col gap-2">
                <div className="text-muted-foreground/80 text-[0.7rem] font-medium">
                  {group.label}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SCENES.filter((scene) => scene.group === group.id).map(
                    (scene) => {
                      const theme = SCENE_THEME[scene.id]
                      const isOn = selected.has(scene.id)
                      return (
                        <button
                          key={scene.id}
                          type="button"
                          role="checkbox"
                          aria-checked={isOn}
                          onClick={() => toggleScene(scene.id)}
                          className={cn(
                            "focus-visible:ring-ring/60 flex flex-col gap-0.5 rounded-2xl border-2 px-3 py-2.5 text-left transition-all outline-none focus-visible:ring-4",
                            isOn
                              ? cn("shadow-md", theme.chipActive)
                              : theme.chip
                          )}
                        >
                          <span className="text-base font-bold">
                            {scene.label}
                          </span>
                          <span className="text-[0.7rem] leading-tight opacity-80">
                            {scene.description}
                          </span>
                        </button>
                      )
                    }
                  )}
                </div>
              </div>
            ))}
          </section>

          <section className="bg-muted/60 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <Label htmlFor="shuffle" className="gap-2 text-sm font-medium">
              <Shuffle className="text-muted-foreground size-4" />
              じゅんばんを シャッフル
            </Label>
            <Switch
              id="shuffle"
              checked={shuffle}
              onCheckedChange={onShuffleChange}
            />
          </section>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button
          size="xl"
          disabled={total === 0}
          onClick={onStart}
          className="w-full gap-2 rounded-2xl bg-linear-to-r from-sky-500 to-indigo-500 text-lg font-bold shadow-lg hover:from-sky-500/90 hover:to-indigo-500/90"
        >
          <Play className="size-5" />
          スタート
        </Button>
        <p className="text-muted-foreground text-sm">
          {total === 0
            ? "ばめんをひとつ以上えらんでください"
            : `ぜんぶで ${total} フレーズ`}
        </p>
      </div>
    </div>
  )
}
