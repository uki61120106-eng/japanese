/**
 * 音声機能の薄いラッパー。読み上げと聞き取りを、環境に応じて使い分ける。
 *
 * - 読み上げ: SpeechSynthesis（ほぼ全ブラウザで使える）
 * - 聞き取り: 置かれている場所によって2通り
 *     - アーティファクト内: claude.use("dictation")。枠の中では
 *       マイクを直接さわれないため、プラットフォーム側に聞き取ってもらう
 *     - それ以外（Vercel・ローカル）: SpeechRecognition
 *
 * どちらも TypeScript の標準型定義に無いため、使う範囲だけ宣言する。
 */

// ---------------------------------------------------------------------------
// SpeechRecognition（ブラウザ内蔵）
// ---------------------------------------------------------------------------

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

function recognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null
  const w = window as SpeechWindow
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

// ---------------------------------------------------------------------------
// dictation（アーティファクトのランタイム機能）
// ---------------------------------------------------------------------------

type DictationState = "idle" | "starting" | "listening" | "finishing"

type Dictation = {
  start(options?: { language?: string }): Promise<void>
  stop(): Promise<void>
  active(): boolean
  onFinal(handler: (event: { text: string }) => void): () => void
  onState(
    handler: (event: { state: DictationState; reason?: string }) => void
  ): () => void
}

type ClaudeWindow = Window & {
  claude?: { use?: (name: string) => Promise<unknown> }
}

/**
 * アーティファクトの枠の中にいるか。
 * ここでは SpeechRecognition が存在していても必ず拒否されるため、
 * dictation が無ければ「聞き取りは使えない」と扱う。
 */
function inArtifact(): boolean {
  return typeof window !== "undefined" && "claude" in window
}

let dictation: Dictation | null = null
let probeStarted = false

async function probeDictation(): Promise<void> {
  const claude = (window as ClaudeWindow).claude
  if (typeof claude?.use !== "function") return
  try {
    // 使えない環境（Safari・Firefox・スマホのアプリなど）では null が返る
    dictation = ((await claude.use("dictation")) as Dictation | null) ?? null
  } catch {
    dictation = null
  }
  refreshSupport()
}

// ---------------------------------------------------------------------------
// 対応状況
// ---------------------------------------------------------------------------

export type SpeechSupport = {
  /** 英語を読み上げられるか */
  speak: boolean
  /** 発話を聞き取れるか */
  listen: boolean
}

export const NO_SUPPORT: SpeechSupport = { speak: false, listen: false }

const supportListeners = new Set<() => void>()
let supportSnapshot: SpeechSupport | null = null

function computeSupport(): SpeechSupport {
  return {
    speak: "speechSynthesis" in window,
    listen: dictation
      ? true
      : inArtifact()
        ? false
        : recognitionConstructor() !== null,
  }
}

function refreshSupport(): void {
  const next = computeSupport()
  const prev = supportSnapshot
  if (prev && prev.speak === next.speak && prev.listen === next.listen) return
  supportSnapshot = next
  supportListeners.forEach((listener) => listener())
}

/**
 * 対応状況を返す。useSyncExternalStore に渡すため、
 * 内容が変わらないかぎり同じオブジェクトを返す。
 */
export function getSupport(): SpeechSupport {
  if (typeof window === "undefined") return NO_SUPPORT
  supportSnapshot ??= computeSupport()
  return supportSnapshot
}

/** サーバー側では音声機能を判定できないので、無しとして描画する。 */
export function getServerSupport(): SpeechSupport {
  return NO_SUPPORT
}

/**
 * dictation が使えるかは非同期にしか分からないため、
 * 購読が始まった時点で調べ、分かったら通知する。
 */
export function subscribeSupport(onChange: () => void): () => void {
  supportListeners.add(onChange)
  if (!probeStarted) {
    probeStarted = true
    void probeDictation()
  }
  return () => {
    supportListeners.delete(onChange)
  }
}

// ---------------------------------------------------------------------------
// 読み上げ
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 聞き取り
// ---------------------------------------------------------------------------

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

/** dictation の終了理由。エラーでなければ undefined を返す。 */
function dictationError(reason?: string): ListenError | undefined {
  switch (reason) {
    case "not_granted":
      return "denied"
    case "unavailable":
      return "unsupported"
    case "dismissed":
    case "rate_limited":
    case "upstream_error":
      return "other"
    // stopped / viewer_stopped / hidden / time_limit は異常ではない
    default:
      return undefined
  }
}

function listenWithDictation(
  api: Dictation,
  handlers: ListenHandlers
): ListenHandle {
  let heard = ""
  let done = false
  const unsubscribes: Array<() => void> = []

  function finish(error?: ListenError) {
    if (done) return
    done = true
    unsubscribes.forEach((off) => off())
    unsubscribes.length = 0

    const text = heard.trim()
    if (!error && text) handlers.onResult(text)
    else handlers.onError(error ?? "no-speech")
    handlers.onEnd()
  }

  // 確定したぶんは、つなぎの空白ごとそのまま足していく
  unsubscribes.push(api.onFinal((event) => (heard += event.text)))
  unsubscribes.push(
    api.onState((event) => {
      if (event.state === "idle") finish(dictationError(event.reason))
    })
  )

  // 読み上げ中だとマイクが自分の音声を拾うため、先に止める
  stopSpeaking()

  // start() は利用者の操作から同期的に呼ぶ必要がある（await を挟まない）
  api.start({ language: "en" }).catch((error: { code?: string }) => {
    finish(dictationError(error?.code) ?? "other")
  })

  return {
    stop: () => {
      void api.stop()
    },
  }
}

/**
 * マイクから英語を1回だけ聞き取る。
 * 対応していない場合は onError("unsupported") を呼んで null を返す。
 *
 * 利用者のクリックから同期的に呼ぶこと。
 */
export function listen(handlers: ListenHandlers): ListenHandle | null {
  if (dictation) return listenWithDictation(dictation, handlers)

  // アーティファクトの枠の中では SpeechRecognition は必ず拒否される
  const Recognition = inArtifact() ? null : recognitionConstructor()
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
