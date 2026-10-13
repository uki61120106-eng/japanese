/**
 * 行政書士アプリを1枚の HTML にまとめるときの入り口（claude.ai アーティファクト用）。
 *   npm run build:gyosei
 */
import { createRoot } from "react-dom/client"

import { GyoseiApp } from "@/components/gyosei/gyosei-app"
import { isArtifact } from "@/lib/gyosei/claude-runtime"
import { connectRemote } from "@/lib/gyosei/store"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

if (isArtifact()) void connectRemote()

createRoot(container).render(<GyoseiApp />)
