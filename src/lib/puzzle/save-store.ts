import { loadSave, writeSave } from "@/lib/puzzle/save"
import type { SaveData } from "@/lib/puzzle/types"

/**
 * localStorage を React から購読するための小さなストア。
 * useSyncExternalStore に渡すので、同じ内容なら同じ参照を返す必要がある。
 */
let cache: SaveData | null = null
const listeners = new Set<() => void>()

export function subscribeSave(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSaveSnapshot(): SaveData | null {
  if (cache === null) {
    cache = loadSave()
  }
  return cache
}

/** サーバー描画時は保存データを持たない。読み込み中の表示になる。 */
export function getServerSaveSnapshot(): SaveData | null {
  return null
}

export function updateSave(next: SaveData): void {
  cache = next
  writeSave(next)
  for (const listener of listeners) {
    listener()
  }
}
