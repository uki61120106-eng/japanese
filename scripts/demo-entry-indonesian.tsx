/**
 * 1枚の HTML にまとめた共有用デモ（インドネシア語会話）の入り口。
 * Next.js のルーティングを使わず、ページの中身をそのまま描画する。
 */
import { createRoot } from "react-dom/client"

import { IndonesianApp } from "@/components/indonesian/indonesian-app"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<IndonesianApp />)
