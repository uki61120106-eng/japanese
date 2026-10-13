/**
 * スマホのホーム画面に追加して使うための仕組み。
 *   - Service Worker の登録（一度開けば通信なしでも開けるようにする）
 *   - 「ホーム画面に追加」の案内に使う端末の判定と、Android のインストール要求の保持
 */
import { useSyncExternalStore } from "react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export type InstallState = {
  /** ホーム画面から開いている */
  standalone: boolean
  /** iPhone / iPad（共有メニューから追加する） */
  ios: boolean
  /** スマホ・タブレットなど指で操作する端末 */
  touch: boolean
  /** Android の Chrome などで、ボタンから追加できる */
  canPrompt: boolean
  /** /workout で開いている（1枚の HTML 版ではホーム画面に追加できない） */
  onSite: boolean
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let state: InstallState | null = null
const listeners = new Set<() => void>()

function detect(): InstallState {
  const ua = navigator.userAgent
  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS はデスクトップの Safari を名乗る
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  return {
    standalone,
    ios,
    touch: window.matchMedia("(pointer: coarse)").matches,
    canPrompt: deferredPrompt !== null,
    onSite: window.location.pathname.startsWith("/workout"),
  }
}

function refresh() {
  state = detect()
  listeners.forEach((listener) => listener())
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    // ブラウザ任せの表示を止め、アプリ内のボタンから出す
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    refresh()
  })
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null
    refresh()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useInstallState(): InstallState | null {
  return useSyncExternalStore<InstallState | null>(
    subscribe,
    () => (state ??= detect()),
    () => null
  )
}

/** Android の「ホーム画面に追加」ダイアログを出す。追加されたら true */
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) return false
  const event = deferredPrompt
  deferredPrompt = null
  await event.prompt()
  const { outcome } = await event.userChoice
  refresh()
  return outcome === "accepted"
}

export function registerServiceWorker() {
  if (process.env.NODE_ENV !== "production") return
  if (!("serviceWorker" in navigator)) return
  // 1枚の HTML にまとめた共有版など、/workout 以外で開いたときは登録しない
  if (!window.location.pathname.startsWith("/workout")) return
  navigator.serviceWorker
    .register("/workout-sw.js", { scope: "/workout", updateViaCache: "none" })
    .catch(() => {
      // 登録できなくても通常のウェブページとして使える
    })
}
