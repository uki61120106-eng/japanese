/**
 * そろばんドリルを1枚の HTML にまとめるときの入り口。
 */
import { createRoot } from "react-dom/client"

import { SorobanApp } from "@/components/soroban/soroban-app"

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<SorobanApp />)
