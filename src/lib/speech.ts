/**
 * ブラウザ内蔵の音声機能（Web Speech API）の薄いラッパー。
 * サーバーも API キーも使わないので、この2つが使えるかどうかが機能の上限になる。
 *
 * - 読み上げ: SpeechSynthesis（ほぼ全ブラウザで使える）
 * - 聞き取り: SpeechRecognition（Chrome / Edge / Safari など。Firefox は未対応）
 *
 * SpeechRecognition は TypeScript の標準型定義に無いため、使う範囲だけ宣言する。
 */

type RecognitionAlternative = { transcript: string; confidence: number }

type RecognitionResult = {
  readonly length: number
  readonly isFinal: boolean
  [index: number]: RecognitionAlternative
}

type RecognitionResultList = {
  readonly length: number
  [index: number]: RecognitionResult
}

type RecognitionEvent = { results: RecognitionResultList; resultIndex: number }

type RecognitionErrorEvent = { error: string }

type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: ((event: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

type RecognitionConstructor = new () => Recognition

type SpeechWindow = Window & {
  SpeechRecognition?: RecognitionConstructor
  webkitSpeechRecognition?: RecognitionConstructor
}

export type SpeechSupport = {
  /** 英語を読み上げられるか */
  speak: boolean
  /** 発話を聞き取れるか */
  listen: boolean
}

export const NO_SUPPORT: SpeechSupport = { speak: false, listen: false }

function recognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null
  const w = window as SpeechWindow
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

let supportSnapshot: SpeechSupport | null = null

/**
 * 対応状況を返す。読み込み後に変わることはないので一度だけ調べて覚えておく
 * （useSyncExternalStore に渡すため、同じ内容なら同じオブジェクトを返す必要がある）。
 */
export function getSupport(): SpeechSupport {
  if (typeof window === "undefined") return NO_SUPPORT
  supportSnapshot ??= {
    speak: "speechSynthesis" in window,
    listen: recognitionConstructor() !== null,
  }
  return supportSnapshot
}

/** サーバー側では音声機能を判定できないので、無しとして描画する。 */
export function getServerSupport(): SpeechSupport {
  return NO_SUPPORT
}

/** 対応状況は変化しないため、購読しても通知は起きない。 */
export function subscribeSupport(): () => void {
  return () => {}
}

function englishVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang.replace("_", "-") === "en-US") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    null
  )
}

export type SpeakOptions = {
  /** 1 が標準の速さ。ゆっくり再生は 0.6 くらい */
  rate?: number
  onEnd?: () => void
}

/** 英語を読み上げる。前の読み上げは打ち切る。 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "en-US"
  utterance.rate = options.rate ?? 1
  const voice = englishVoice()
  if (voice) utterance.voice = voice
  if (options.onEnd) {
    utterance.onend = options.onEnd
    utterance.onerror = options.onEnd
  }

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
}

export type ListenError =
  | "unsupported"
  /** マイクの利用が許可されなかった */
  | "denied"
  /** 音が拾えなかった */
  | "no-speech"
  | "other"

export type ListenHandlers = {
  /** 確定した聞き取り結果 */
  onResult: (transcript: string) => void
  onError: (error: ListenError) => void
  /** 成否によらず、聞き取りが終わったとき */
  onEnd: () => void
}

export type ListenHandle = { stop: () => void }

function toListenError(code: string): ListenError {
  if (code === "not-allowed" || code === "service-not-allowed") return "denied"
  if (code === "no-speech") return "no-speech"
  return "other"
}

/**
 * マイクから英語を1回だけ聞き取る。
 * 対応していない場合は onError("unsupported") を呼んで null を返す。
 */
export function listen(handlers: ListenHandlers): ListenHandle | null {
  const Recognition = recognitionConstructor()
  if (!Recognition) {
    handlers.onError("unsupported")
    handlers.onEnd()
    return null
  }

  const recognition = new Recognition()
  recognition.lang = "en-US"
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  let finished = false

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1]
    if (!result) return
    finished = true
    handlers.onResult(result[0].transcript)
  }

  recognition.onerror = (event) => {
    finished = true
    handlers.onError(toListenError(event.error))
  }

  recognition.onend = () => {
    // 何も拾えないまま終わることがあるので、その場合もエラーとして扱う
    if (!finished) handlers.onError("no-speech")
    handlers.onEnd()
  }

  // 読み上げ中だとマイクが自分の音声を拾うため、先に止める
  stopSpeaking()

  try {
    recognition.start()
  } catch {
    handlers.onError("other")
    handlers.onEnd()
    return null
  }

  return { stop: () => recognition.abort() }
}
