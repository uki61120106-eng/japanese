"use client"

import { Volume2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { IndonesianSpeech } from "@/lib/indonesian/use-speech"
import { cn } from "@/lib/utils"

type SpeakButtonProps = {
  text: string
  speech: IndonesianSpeech
  /** 同じ文が複数あっても再生中の表示を区別するための識別子 */
  speakKey?: string
  className?: string
}

export function SpeakButton({
  text,
  speech,
  speakKey = text,
  className,
}: SpeakButtonProps) {
  if (!speech.canSpeak) return null
  const speaking = speech.speakingKey === speakKey

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="読み上げる"
      onClick={(event) => {
        event.stopPropagation()
        if (speaking) speech.stop()
        else speech.speak(text, { key: speakKey })
      }}
      className={cn(
        "size-8 shrink-0 rounded-full",
        speaking && "text-primary animate-pulse",
        className
      )}
    >
      <Volume2 className="size-4" />
    </Button>
  )
}
