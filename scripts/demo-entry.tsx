/**
 * 1枚の HTML にまとめた共有用デモの入り口。
 * Next.js のルーティングは使えないので、ハッシュ（#puzzle）で画面を切り替える。
 * 前回どちらを開いていたかを覚えておき、次に開いたときはそこから始める。
 */
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

import KanaPage from "@/app/page"
import PuzzlePage from "@/app/puzzle/page"

const ROUTE_KEY = "demo.lastRoute"

function hashRoute() {
  return window.location.hash.replace(/^#/, "")
}

function initialRoute() {
  const hash = hashRoute()
  if (hash) return hash
  try {
    return window.localStorage.getItem(ROUTE_KEY) ?? ""
  } catch {
    return ""
  }
}

function Demo() {
  const [route, setRoute] = useState(initialRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(hashRoute())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(ROUTE_KEY, route)
    } catch {
      // 保存できなくても遊べるので、黙って続ける
    }
  }, [route])

  return route === "puzzle" ? <PuzzlePage /> : <KanaPage />
}

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<Demo />)
