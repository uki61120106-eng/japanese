/**
 * 1枚の HTML にまとめた共有用デモの入り口（えいかいわフラッシュ）。
 * Next.js のルーティングが無いので、AppShell（トップへ戻るリンク）は使わない。
 */
import { createRoot } from "react-dom/client"

import { EnglishApp } from "@/components/english/english-app"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(
  <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-8 sm:py-12">
    <EnglishApp />
  </main>
)
