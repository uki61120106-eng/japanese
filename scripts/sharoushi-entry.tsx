/**
 * 社労士アプリを1枚の HTML にまとめるときの入り口。
 * Next.js のルーティングを使わず、/sharoushi の Page コンポーネントをそのまま描画する。
 */
import { createRoot } from "react-dom/client"

import SharoushiPage from "@/app/sharoushi/page"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<SharoushiPage />)
