/**
 * 合図の音と読み上げ。スマホのブラウザは「ユーザーが押した直後」でないと
 * 音を鳴らせないため、スタートボタンの処理の中で unlockAudio() を呼んでおく。
 */
let context: AudioContext | null = null

export function unlockAudio() {
  try {
    context ??= new AudioContext()
    void context.resume()
  } catch {
    context = null
  }
  try {
    // iOS は最初の読み上げもタップ内で始める必要がある
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(""))
  } catch {
    // 読み上げに対応していない端末では音だけで動かす
  }
}

export function beep(frequency = 880, durationMs = 120) {
  if (!context) return
  try {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const start = context.currentTime
    const end = start + durationMs / 1000
    oscillator.type = "sine"
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.3, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, end)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(start)
    oscillator.stop(end)
  } catch {
    // 音が出せなくても画面のタイマーは進める
  }
}

export function speak(text: string) {
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ja-JP"
    utterance.rate = 1.05
    synth.speak(utterance)
  } catch {
    // 読み上げに対応していない端末では何もしない
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel()
  } catch {
    // 何もしない
  }
}
