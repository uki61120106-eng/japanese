/**
 * 1枚の HTML にまとめた共有用デモの入り口。
 * Next.js のルーティングは使えないので、ハッシュ（#puzzle）で画面を切り替える。
 */
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

import KanaPage from "@/app/page"
import PuzzlePage from "@/app/puzzle/page"

function currentRoute() {
  return window.location.hash.replace(/^#/, "")
}

function Demo() {
  const [route, setRoute] = useState(currentRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return route === "puzzle" ? <PuzzlePage /> : <KanaPage />
}

const container = document.getElementById("root")

if (!container) {
  throw new Error("#root が見つかりません")
}

createRoot(container).render(<Demo />)
