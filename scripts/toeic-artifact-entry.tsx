/**
 * 1枚 HTML にまとめた TOEIC トレーナーの入り口。
 * Next.js のルーティングを使わず、/toeic の Page をそのまま描画する。
 */
import { createRoot } from "react-dom/client"

import Page from "@/app/toeic/page"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<Page />)
