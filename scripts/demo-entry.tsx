/**
 * 1枚の HTML にまとめた共有用デモの入り口。
 * Next.js のルーティングを使わず、同じ Page コンポーネントをそのまま描画する。
 */
import { createRoot } from "react-dom/client"

import Page from "@/app/page"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<Page />)
