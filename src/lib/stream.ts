/**
 * 聞き流しで流す中身。フレーズ集と会話を同じ形にそろえて、
 * 再生側（StreamScreen）がどちらも同じ手順で扱えるようにする。
 */
import { DIALOGUES, type Speaker } from "@/lib/dialogues"
import { PHRASES, getScene, type SceneId } from "@/lib/phrases"
import { shuffled } from "@/lib/shuffle"

/** フレーズ集を流すか、まとまった会話を流すか */
export type StreamSource = "phrase" | "dialogue"

export type StreamLine = {
  speaker: Speaker
  en: string
  ja: string
  /** 読み方のカタカナ。相手の返事には付かないことがある */
  kana?: string
}

export type StreamItem = {
  id: string
  scene: SceneId
  /** カードの見出し。会話なら題、フレーズなら場面名 */
  title: string
  /** 見出しの下の補足 */
  note: string
  lines: StreamLine[]
}

export type StreamConfig = {
  source: StreamSource
  scenes: SceneId[]
  shuffle: boolean
}

function phraseItems(scenes: Set<SceneId>): StreamItem[] {
  return PHRASES.filter((phrase) => scenes.has(phrase.scene)).map((phrase) => ({
    id: `phrase-${phrase.id}`,
    scene: phrase.scene,
    title: getScene(phrase.scene).label,
    note: phrase.note,
    lines: [
      {
        speaker: "you" as Speaker,
        en: phrase.en,
        ja: phrase.ja,
        kana: phrase.kana,
      },
      ...(phrase.reply
        ? [{ speaker: "other" as Speaker, ...phrase.reply }]
        : []),
    ],
  }))
}

function dialogueItems(scenes: Set<SceneId>): StreamItem[] {
  return DIALOGUES.filter((dialogue) => scenes.has(dialogue.scene)).map(
    (dialogue) => ({
      id: `dialogue-${dialogue.id}`,
      scene: dialogue.scene,
      title: dialogue.title,
      note: dialogue.situation,
      lines: dialogue.lines,
    })
  )
}

export function buildStream(config: StreamConfig): StreamItem[] {
  const scenes = new Set(config.scenes)
  const items =
    config.source === "dialogue" ? dialogueItems(scenes) : phraseItems(scenes)
  // 会話の中のセリフは順番を変えない。入れ替えるのは会話／フレーズの単位だけ
  return config.shuffle ? shuffled(items) : items
}

/** ホームに出す「ぜんぶで N」の数 */
export function streamSize(config: Omit<StreamConfig, "shuffle">): {
  items: number
  lines: number
} {
  const items = buildStream({ ...config, shuffle: false })
  return {
    items: items.length,
    lines: items.reduce((sum, item) => sum + item.lines.length, 0),
  }
}
