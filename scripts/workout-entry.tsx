/**
 * 「おうち筋トレ20」を1枚の HTML にまとめるときの入り口。
 * Next.js のルーティングを使わず、/workout と同じ画面をそのまま描画する。
 */
import { createRoot } from "react-dom/client"

import WorkoutPage from "@/app/workout/page"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<WorkoutPage />)
