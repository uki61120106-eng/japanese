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

/** 読み上げに使う言語。英語のお手本と、日本語の訳。 */
export type SpeakLang = "en" | "ja"

const LANG_TAG: Record<SpeakLang, string> = { en: "en-US", ja: "ja-JP" }

function voicesFor(lang: SpeakLang): SpeechSynthesisVoice[] {
  const tag = LANG_TAG[lang]
  const all = window.speechSynthesis.getVoices()
  const exact = all.filter((voice) => voice.lang.replace("_", "-") === tag)
  if (exact.length > 0) return exact
  return all.filter((voice) => voice.lang.toLowerCase().startsWith(lang))
}

function voiceFor(lang: SpeakLang): SpeechSynthesisVoice | null {
  return voicesFor(lang)[0] ?? null
}

/**
 * その言語の声が端末にあるか。
 * 声の一覧は遅れて読み込まれるので、読み込みが済んでいる再生開始時に調べること。
 */
export function hasVoice(lang: SpeakLang): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false
  }
  return voiceFor(lang) !== null
}

export type SpeakOptions = {
  /** 既定は英語 */
  lang?: SpeakLang
  /** 1 が標準の速さ。ゆっくり再生は 0.6 くらい */
  rate?: number
  /**
   * 会話の話し手。2人目は別の声で読む。
   * 声が1つしか無い端末では、声の高さを変えて区別する。
   */
  voiceIndex?: 0 | 1
  onEnd?: () => void
}

/** 読み上げる。前の読み上げは打ち切る。 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return

  window.speechSynthesis.cancel()

  const lang = options.lang ?? "en"
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_TAG[lang]
  utterance.rate = options.rate ?? 1

  const voices = voicesFor(lang)
  const wanted = options.voiceIndex ?? 0
  const voice = voices[Math.min(wanted, voices.length - 1)] ?? null
  if (voice) utterance.voice = voice
  // 2人分の声を用意できない端末では、高さを下げて別人だと分かるようにする
  if (wanted === 1 && voices.length < 2) utterance.pitch = 0.75
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
