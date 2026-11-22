"use client"

import { useEffect, useState } from "react"
import {
  Languages,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Turtle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { getScene, type Phrase } from "@/lib/phrases"
import { SCENE_THEME } from "@/lib/scene-theme"
import { hasVoice, speak, stopSpeaking, type SpeechSupport } from "@/lib/speech"
import { keepScreenAwake } from "@/lib/wake-lock"
import { cn } from "@/lib/utils"

type StreamScreenProps = {
  deck: Phrase[]
  support: SpeechSupport
  onQuit: () => void
}

/** いま読み上げているのは英語か、日本語訳か */
type Part = "en" | "ja"

/** 英語のあと、訳に移るまでの間（ミリ秒）。意味を思い出す時間 */
const GAP_BEFORE_JA = 500
/** 次のフレーズに移るまでの間（ミリ秒） */
const GAP_BEFORE_NEXT = 900
/** ゆっくり再生の速さ。英語にだけ効かせる */
const SLOW_RATE = 0.75

export function StreamScreen({ deck, support, onQuit }: StreamScreenProps) {
  const [index, setIndex] = useState(0)
  const [part, setPart] = useState<Part>("en")
  const [playing, setPlaying] = useState(false)

  const [withJapanese, setWithJapanese] = useState(true)
  const [slow, setSlow] = useState(false)
  const [repeat, setRepeat] = useState(true)
  // 端末に日本語の声が無いと、訳を読ませても意味のある音にならない
  const [noJapaneseVoice, setNoJapaneseVoice] = useState(false)

  const current = deck[index]
  const theme = SCENE_THEME[current.scene]
  const scene = getScene(current.scene)

  // 読み上げ本体。再生中は、1つ終わるたびに次へ進む
  useEffect(() => {
    if (!playing) return

    const phrase = deck[index]
    // 日本語訳を途中でオフにしたあと再開しても、訳を読み上げないようにする
    const speakingJa = withJapanese && part === "ja"
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    function advance() {
      if (!speakingJa && withJapanese) {
        setPart("ja")
        return
      }
      setPart("en")
      if (index < deck.length - 1) {
        setIndex(index + 1)
        return
      }
      // 最後まで来た
      if (repeat) {
        setIndex(0)
      } else {
        setPlaying(false)
        setIndex(0)
      }
    }

    speak(speakingJa ? phrase.ja : phrase.en, {
      lang: speakingJa ? "ja" : "en",
      rate: speakingJa || !slow ? 1 : SLOW_RATE,
      onEnd: () => {
        if (cancelled) return
        timer = setTimeout(
          advance,
          !speakingJa && withJapanese ? GAP_BEFORE_JA : GAP_BEFORE_NEXT
        )
      },
    })

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      stopSpeaking()
    }
  }, [playing, index, part, withJapanese, slow, repeat, deck])

  // 聞き流している間は画面を消さない。取れない環境では何も起きない
  useEffect(() => {
    if (!playing) return

    let release: (() => void) | undefined
    let cancelled = false

    void keepScreenAwake().then((fn) => {
      if (cancelled) fn()
      else release = fn
    })

    return () => {
      cancelled = true
      release?.()
    }
  }, [playing])

  function togglePlay() {
    if (playing) {
      setPlaying(false)
      return
    }
    // 声の一覧は読み込みが遅れるため、再生を押したこの時点で調べる
    if (withJapanese && !hasVoice("ja")) {
      setNoJapaneseVoice(true)
      setWithJapanese(false)
    }
    setPlaying(true)
  }

  function jumpTo(next: number) {
    setIndex((next + deck.length) % deck.length)
    setPart("en")
  }

  if (!support.speak) {
    return (
      <div className="flex flex-col gap-5">
        <Card className="rounded-3xl border-2 shadow-lg">
          <CardContent className="flex flex-col gap-3 text-center">
            <h1 className="text-xl font-bold">聞き流しは使えません</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              このブラウザは音声の読み上げに対応していないため、聞き流しができません。
              「聞いて覚える」でカードを見ながら練習してください。
            </p>
          </CardContent>
        </Card>
        <Button
          size="xl"
          variant="outline"
          onClick={onQuit}
          className="rounded-2xl border-2 text-base font-bold"
        >
          ホームへ もどる
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-sm font-medium tabular-nums">
            {index + 1} / {deck.length} フレーズ
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              stopSpeaking()
              onQuit()
            }}
            className="text-muted-foreground h-7 text-xs"
          >
            やめる
          </Button>
        </div>
        <Progress
          value={((index + 1) / deck.length) * 100}
          className="bg-muted h-2.5"
          indicatorClassName={cn("transition-all duration-300", theme.fill)}
        />
      </header>

      <Card className="rounded-3xl border-2 py-7 shadow-lg">
        <CardContent className="flex flex-col items-center gap-5 text-center">
          <span
            className={cn(
              "rounded-full border-2 px-3 py-1 text-xs font-bold",
              theme.chip
            )}
          >
            {scene.label}
          </span>

          <div
            className={cn(
              "flex flex-col gap-1.5 rounded-2xl px-3 py-2 transition-colors",
              playing && part === "en" && "bg-muted/70"
            )}
          >
            <span
              className={cn(
                "text-[clamp(1.4rem,6.5vw,2rem)] leading-snug font-bold text-balance",
                theme.text
              )}
            >
              {current.en}
            </span>
            <span className="text-muted-foreground text-sm">
              {current.kana}
            </span>
          </div>

          <span className="bg-border h-px w-20" />

          <div
            className={cn(
              "rounded-2xl px-3 py-2 transition-colors",
              playing && part === "ja" && "bg-muted/70"
            )}
          >
            <span className="text-base font-medium text-pretty">
              {current.ja}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="前のフレーズ"
          onClick={() => jumpTo(index - 1)}
          className="size-14 rounded-2xl border-2"
        >
          <SkipBack className="size-6" />
        </Button>

        <Button
          size="icon"
          aria-label={playing ? "一時停止" : "再生"}
          onClick={togglePlay}
          className={cn(
            "size-20 rounded-full text-white shadow-lg transition-colors",
            playing
              ? "bg-slate-700 shadow-slate-700/30 hover:bg-slate-700/90"
              : "bg-linear-to-r from-sky-500 to-indigo-500 shadow-indigo-500/30 hover:from-sky-500/90 hover:to-indigo-500/90"
          )}
        >
          {playing ? (
            <Pause className="size-9" />
          ) : (
            <Play className="size-9 translate-x-0.5" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          aria-label="次のフレーズ"
          onClick={() => jumpTo(index + 1)}
          className="size-14 rounded-2xl border-2"
        >
          <SkipForward className="size-6" />
        </Button>
      </div>

      <Card className="rounded-3xl border-2">
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3 py-2">
            <Label htmlFor="with-japanese" className="gap-2 text-sm font-medium">
              <Languages className="text-muted-foreground size-4" />
              日本語訳も読む
            </Label>
            <Switch
              id="with-japanese"
              checked={withJapanese}
              disabled={noJapaneseVoice}
              onCheckedChange={(on) => {
                setWithJapanese(on)
                // 訳を読んでいる途中でオフにしたら、英語の読み上げに戻す
                if (!on) setPart("en")
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 py-2">
            <Label htmlFor="slow" className="gap-2 text-sm font-medium">
              <Turtle className="text-muted-foreground size-4" />
              英語をゆっくり読む
            </Label>
            <Switch id="slow" checked={slow} onCheckedChange={setSlow} />
          </div>

          <div className="flex items-center justify-between gap-3 py-2">
            <Label htmlFor="repeat" className="gap-2 text-sm font-medium">
              <Repeat className="text-muted-foreground size-4" />
              最後まで行ったらくりかえす
            </Label>
            <Switch id="repeat" checked={repeat} onCheckedChange={setRepeat} />
          </div>
        </CardContent>
      </Card>

      {noJapaneseVoice && (
        <p className="text-muted-foreground rounded-2xl border border-dashed px-4 py-3 text-xs leading-relaxed">
          この端末には日本語の音声が入っていないため、英語だけを読み上げます。
          訳は画面で確認してください。
        </p>
      )}

      <p className="text-muted-foreground text-center text-xs leading-relaxed">
        読み上げはこの画面が開いている間だけ続きます。
        ほかのアプリに切り替えたり画面を消したりすると止まります
      </p>
    </div>
  )
}
