import {
  SCENES,
  type Line,
  type Scene,
  type Speaker,
} from "@/lib/indonesian/scenes"

/** 自分の番に出す選択肢の数（正解を含む） */
const CHOICE_COUNT = 3

export type Turn = {
  line: Line
  /** 自分の番なら選択肢、相手の番なら null */
  choices: string[] | null
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * まぎらわしい選択肢を作る。同じ場面の別のセリフを優先し、
 * 足りなければ他の場面から補う。
 */
function distractors(scene: Scene, answer: Line): string[] {
  const sameScene = scene.lines
    .filter((line) => line.id !== answer.id)
    .map((line) => line.id)
  const otherScenes = SCENES.filter((s) => s.slug !== scene.slug)
    .flatMap((s) => s.lines)
    .map((line) => line.id)
    .filter((text) => text !== answer.id)

  const pool = [...new Set([...shuffled(sameScene), ...shuffled(otherScenes)])]
  return pool.slice(0, CHOICE_COUNT - 1)
}

export function buildTurns(scene: Scene, role: Speaker): Turn[] {
  return scene.lines.map((line) => ({
    line,
    choices:
      line.speaker === role
        ? shuffled([line.id, ...distractors(scene, line)])
        : null,
  }))
}

export function otherSpeaker(role: Speaker): Speaker {
  return role === "A" ? "B" : "A"
}
