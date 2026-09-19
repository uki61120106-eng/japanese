import type { Metadata, Viewport } from "next"

import { AppShell } from "@/components/app-shell"
import { KanaApp } from "@/components/kana/kana-app"

export const metadata: Metadata = {
  title: "かなフラッシュ | ひらがな・カタカナを覚えるフラッシュカード",
  description:
    "ひらがな46字・カタカナ46字をカードをめくって覚える学習デモアプリ。通信なしでブラウザだけで動きます。",
}

export const viewport: Viewport = {
  themeColor: "#fb7185",
}

export default function Page() {
  return (
    <AppShell background="bg-linear-to-b from-rose-50 via-amber-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <KanaApp />
    </AppShell>
  )
}
