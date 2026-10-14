/**
 * スマホのホーム画面に追加して使うための仕組み（/workout と /rm で共有）。
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

/**
 * そのアプリのページ（scope 配下）で開いているか。
 * 1枚の HTML にまとめた共有版ではホーム画面に追加できないので、案内も登録もしない。
 */
export function isOnSite(scope: string): boolean {
  return window.location.pathname.startsWith(scope)
}

/** 例: registerServiceWorker("/rm-sw.js", "/rm") */
export function registerServiceWorker(script: string, scope: string) {
  if (process.env.NODE_ENV !== "production") return
  if (!("serviceWorker" in navigator)) return
  if (!isOnSite(scope)) return
  navigator.serviceWorker
    .register(script, { scope, updateViaCache: "none" })
    .catch(() => {
      // 登録できなくても通常のウェブページとして使える
    })
}
