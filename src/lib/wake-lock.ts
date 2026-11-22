/**
 * 聞き流している間だけ画面を消さないようにする。
 * 対応していない端末やブラウザでは何も起きない（拒否されても問題にしない）。
 *
 * WakeLock は TypeScript の標準型定義に無いことがあるため、使う範囲だけ宣言する。
 */

type Sentinel = { release(): Promise<void> }

type WakeLockNavigator = Navigator & {
  wakeLock?: { request(type: "screen"): Promise<Sentinel> }
}

/** 取得できたら解除用の関数を、できなければ何もしない関数を返す。 */
export async function keepScreenAwake(): Promise<() => void> {
  if (typeof navigator === "undefined") return () => {}

  const api = (navigator as WakeLockNavigator).wakeLock
  if (!api) return () => {}

  try {
    const sentinel = await api.request("screen")
    return () => {
      void sentinel.release().catch(() => {})
    }
  } catch {
    // タブが背面にあるなど、取得できない状況は珍しくない
    return () => {}
  }
}
