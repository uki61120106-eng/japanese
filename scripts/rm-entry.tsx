/**
 * 「RM 計算機」を1枚の HTML にまとめるときの入り口。
 * Next.js のルーティングを使わず、/rm と同じ画面をそのまま描画する。
 */
import { createRoot } from "react-dom/client"

import RmPage from "@/app/rm/page"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<RmPage />)
