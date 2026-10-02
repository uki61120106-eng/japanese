"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowLeftRight,
  MessageCircleQuestion,
  PartyPopper,
  RotateCcw,
} from "lucide-react"

import { ChatBubble } from "@/components/indonesian/chat-bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { buildTurns, otherSpeaker, type Turn } from "@/lib/indonesian/roleplay"
import { SCENE_THEME } from "@/lib/indonesian/scene-theme"
import type { Scene, Speaker } from "@/lib/indonesian/scenes"
import type { IndonesianSpeech } from "@/lib/indonesian/use-speech"
import { cn } from "@/lib/utils"

type RoleplayViewProps = {
  scene: Scene
  speech: IndonesianSpeech
}

/** 次に自分が話す番の位置。なければ会話の終わり（turns.length）を返す */
function nextUserTurn(turns: Turn[], from: number): number {
  const index = turns.findIndex((turn, i) => i >= from && turn.choices)
  return index === -1 ? turns.length : index
}

/** 自分の役のセリフを選んで会話を進めるモード */
export function RoleplayView({ scene, speech }: RoleplayViewProps) {
  const [role, setRole] = useState<Speaker | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  // ここより前のセリフは表示済み。turns[position] が自分の番（または会話の終わり）
  const [position, setPosition] = useState(0)
  const [wrongPicks, setWrongPicks] = useState<string[]>([])
  const [missed, setMissed] = useState<number[]>([])
  const [showJa, setShowJa] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const theme = SCENE_THEME[scene.theme]
  const finished = role !== null && position >= turns.length
  const userTurnCount = turns.filter((turn) => turn.choices).length
  const answeredCount = turns
    .slice(0, position)
    .filter((turn) => turn.choices).length

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [position, wrongPicks.length])

  const keyOf = (index: number) => `roleplay-${scene.slug}-${index}`

  /** from から to の手前までのセリフを順に読み上げる */
  function speakRange(list: Turn[], from: number, to: number) {
    if (from >= to) return
    speech.speak(list[from].line.id, {
      key: keyOf(from),
      onEnd: () => speakRange(list, from + 1, to),
    })
  }

  function start(nextRole: Speaker) {
    const nextTurns = buildTurns(scene, nextRole)
    const first = nextUserTurn(nextTurns, 0)
    setRole(nextRole)
    setTurns(nextTurns)
    setPosition(first)
    setWrongPicks([])
    setMissed([])
    speakRange(nextTurns, 0, first)
  }

  function pick(choice: string) {
    const turn = turns[position]
    if (choice !== turn.line.id) {
      if (!wrongPicks.includes(choice)) setWrongPicks([...wrongPicks, choice])
      if (!missed.includes(position)) setMissed([...missed, position])
      return
    }
    // 正解: 自分のセリフと、その後の相手のセリフを読み上げて次の自分の番へ進む
    const next = nextUserTurn(turns, position + 1)
    setPosition(next)
    setWrongPicks([])
    speakRange(turns, position, next)
  }

  if (role === null) {
    return (
      <Card className="gap-4 rounded-3xl border-2 shadow-sm">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">どちらの役をやりますか？</h3>
            <p className="text-muted-foreground text-sm">
              自分の番になったら、日本語の意味に合うインドネシア語を3つの中から選びます。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["A", "B"] as const).map((speaker) => (
              <Button
                key={speaker}
                size="xl"
                variant={speaker === "A" ? "default" : "outline"}
                onClick={() => start(speaker)}
                className="h-16 rounded-2xl border-2 text-base font-bold"
              >
                {scene.roles[speaker]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const current = finished ? null : turns[position]
  const partnerName = scene.roles[otherSpeaker(role)]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm font-medium tabular-nums">
            {scene.roles[role]}の役 ・ {answeredCount} / {userTurnCount}
          </span>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="roleplay-ja"
              className="text-muted-foreground text-xs"
            >
              訳
            </Label>
            <Switch
              id="roleplay-ja"
              checked={showJa}
              onCheckedChange={setShowJa}
            />
          </div>
        </div>
        <Progress
          value={(answeredCount / userTurnCount) * 100}
          className="bg-muted h-2.5"
          indicatorClassName={cn("transition-all duration-300", theme.fill)}
        />
      </div>

      <div className="flex flex-col gap-3">
        {turns.slice(0, position).map((turn, index) => (
          <ChatBubble
            key={index}
            line={turn.line}
            name={turn.line.speaker === role ? scene.roles[role] : partnerName}
            side={turn.line.speaker === role ? "right" : "left"}
            partnerClassName={theme.bubble}
            showKana
            showJa={showJa}
            speech={speech}
            speakKey={keyOf(index)}
            active={speech.speakingKey === keyOf(index)}
          />
        ))}
      </div>

      {current?.choices && (
        <Card className="animate-in fade-in gap-3 rounded-3xl border-2 border-dashed shadow-sm duration-300">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <MessageCircleQuestion
                className={cn("mt-0.5 size-5 shrink-0", theme.text)}
              />
              <p className="font-bold">「{current.line.ja}」と言ってみよう</p>
            </div>
            <div className="flex flex-col gap-2">
              {current.choices.map((choice) => {
                const wrong = wrongPicks.includes(choice)
                return (
                  <Button
                    key={choice}
                    variant="outline"
                    disabled={wrong}
                    onClick={() => pick(choice)}
                    lang="id"
                    className={cn(
                      "h-auto min-h-12 justify-start rounded-2xl border-2 px-4 py-3 text-left text-base font-bold whitespace-normal",
                      wrong &&
                        "border-rose-300 bg-rose-50 text-rose-700 line-through disabled:opacity-80 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                    )}
                  >
                    {choice}
                  </Button>
                )
              })}
            </div>
            {wrongPicks.length > 0 && (
              <p className="text-muted-foreground text-xs">
                ちがうみたい。もう一度えらんでみよう
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {finished && (
        <RoleplayResult
          scene={scene}
          turns={turns}
          missed={missed}
          userTurnCount={userTurnCount}
          onRetry={() => start(role)}
          onSwap={() => start(otherSpeaker(role))}
        />
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function RoleplayResult({
  scene,
  turns,
  missed,
  userTurnCount,
  onRetry,
  onSwap,
}: {
  scene: Scene
  turns: Turn[]
  missed: number[]
  userTurnCount: number
  onRetry: () => void
  onSwap: () => void
}) {
  const correct = userTurnCount - missed.length
  const theme = SCENE_THEME[scene.theme]

  return (
    <Card className="animate-in fade-in zoom-in-95 items-center gap-4 rounded-3xl border-2 py-6 shadow-lg duration-300">
      <CardContent className="flex w-full flex-col items-center gap-4">
        <PartyPopper className="size-8 text-amber-500" />
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-xl font-black">会話できました！</h3>
          <p className="text-muted-foreground text-sm">
            1回で正解:{" "}
            <span className={cn("font-bold", theme.text)}>{correct}</span> /{" "}
            {userTurnCount}
          </p>
        </div>

        {missed.length > 0 && (
          <div className="flex w-full flex-col gap-2">
            <div className="text-muted-foreground text-xs tracking-widest">
              まちがえたセリフ
            </div>
            <ul className="flex flex-col gap-2">
              {missed.map((index) => (
                <li key={index} className="bg-muted/60 rounded-2xl px-4 py-2">
                  <p lang="id" className="font-bold">
                    {turns[index].line.id}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {turns[index].line.ja}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid w-full grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={onRetry}
            className="h-12 gap-2 rounded-2xl border-2 font-bold"
          >
            <RotateCcw className="size-4" />
            もう一回
          </Button>
          <Button
            size="lg"
            onClick={onSwap}
            className="h-12 gap-2 rounded-2xl font-bold"
          >
            <ArrowLeftRight className="size-4" />
            役を交代
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
