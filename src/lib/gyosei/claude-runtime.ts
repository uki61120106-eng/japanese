/**
 * claude.ai のアーティファクトとして動くときだけ使える機能（window.claude）。
 * 通常の Web アプリとして動くときは window.claude が無いので、すべて null になる。
 */

type DocSnapshot = { exists: boolean; data(): Record<string, unknown> | undefined }
type DocRef = {
  get(): Promise<DocSnapshot>
  set(data: Record<string, unknown>): Promise<void>
}
type DB = { doc(path: string): DocRef }
type User = { id(): Promise<string | null> }
type Downloads = {
  save(request: { filename: string; data: string }): Promise<unknown>
}
type ClaudeRuntime = {
  use(name: "db"): Promise<DB | null>
  use(name: "user"): Promise<User | null>
  use(name: "downloads"): Promise<Downloads | null>
}

function runtime(): ClaudeRuntime | null {
  if (typeof window === "undefined") return null
  const claude = (window as unknown as { claude?: ClaudeRuntime }).claude
  return claude && typeof claude.use === "function" ? claude : null
}

export function isArtifact(): boolean {
  return runtime() !== null
}

/** 学習記録を置く、この利用者専用のドキュメント。null なら使えない。 */
export async function personalDoc(): Promise<DocRef | null> {
  const claude = runtime()
  if (!claude) return null
  try {
    const [db, user] = await Promise.all([claude.use("db"), claude.use("user")])
    const id = await user?.id()
    if (!db || !id) return null
    return db.doc(`data/users/${id}/state`)
  } catch {
    return null
  }
}

/**
 * ファイルを保存する。アーティファクトでは downloads 機能（確認ダイアログ付き）、
 * 通常のブラウザではリンクのクリックでダウンロードする。
 */
export async function saveTextFile(filename: string, text: string): Promise<boolean> {
  const claude = runtime()
  if (claude) {
    const downloads = await claude.use("downloads").catch(() => null)
    if (!downloads) return false
    try {
      await downloads.save({ filename, data: text })
      return true
    } catch {
      return false
    }
  }
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
  return true
}
