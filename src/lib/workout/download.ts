/** 端末にファイルとして保存させる（ブラウザのダウンロード）。できなければ false */
export function downloadText(filename: string, text: string, type: string): boolean {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }))
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    // iOS はクリック直後に URL を消すと保存に失敗することがあるので少し待つ
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
    return true
  } catch {
    return false
  }
}
