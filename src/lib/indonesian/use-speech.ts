"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

/**
 * ブラウザ内蔵の読み上げ（Web Speech API）でインドネシア語を話させる。
 * 通信も費用も発生しないが、端末にインドネシア語の音声が入っていない場合がある。
 */

const LANG = "id-ID"

/** 読み上げの対応状況。インドネシア語の音声があればその voiceURI が入る */
export type VoiceState = "pending" | "unsupported" | "no-voice" | (string & {})

function isSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window
}

function findVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang.replace("_", "-") === LANG) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("id"))
  )
}

function subscribe(onChange: () => void) {
  if (!isSupported()) return () => {}
  window.speechSynthesis.addEventListener("voiceschanged", onChange)
  return () =>
    window.speechSynthesis.removeEventListener("voiceschanged", onChange)
}

function getSnapshot(): VoiceState {
  if (!isSupported()) return "unsupported"
  return findVoice()?.voiceURI ?? "no-voice"
}

function getServerSnapshot(): VoiceState {
  return "pending"
}

// Chrome では再生中の utterance が GC されると onend が呼ばれないことがあるため保持しておく
let current: SpeechSynthesisUtterance | null = null

export function useIndonesianSpeech() {
  const voiceState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const [speakingKey, setSpeakingKey] = useState<string | null>(null)
  const [slow, setSlow] = useState(false)
  const slowRef = useRef(slow)

  useEffect(() => {
    slowRef.current = slow
  }, [slow])

  const stop = useCallback(() => {
    if (!isSupported()) return
    current = null
    window.speechSynthesis.cancel()
    setSpeakingKey(null)
  }, [])

  /**
   * text を読み上げる。key は「どの吹き出しが再生中か」を UI で示すための識別子。
   * 読み終えたら（または止められたら）onEnd を呼ぶ。
   */
  const speak = useCallback(
    (text: string, options?: { key?: string; onEnd?: () => void }) => {
      if (!isSupported()) {
        options?.onEnd?.()
        return
      }
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = LANG
      utterance.rate = slowRef.current ? 0.6 : 0.9
      const voice = findVoice()
      if (voice) utterance.voice = voice

      const finish = () => {
        if (current !== utterance) return
        current = null
        setSpeakingKey(null)
        options?.onEnd?.()
      }
      utterance.onend = finish
      utterance.onerror = finish

      current = utterance
      setSpeakingKey(options?.key ?? text)
      window.speechSynthesis.speak(utterance)
    },
    []
  )

  // 画面を離れたら読み上げを止める
  useEffect(() => stop, [stop])

  return {
    voiceState,
    canSpeak: voiceState !== "unsupported" && voiceState !== "pending",
    speak,
    stop,
    speakingKey,
    slow,
    setSlow,
  }
}

export type IndonesianSpeech = ReturnType<typeof useIndonesianSpeech>
