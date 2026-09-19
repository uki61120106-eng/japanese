import type { Metadata, Viewport } from "next"

import { AppShell } from "@/components/app-shell"
import { EnglishApp } from "@/components/english/english-app"

export const metadata: Metadata = {
  title: "えいかいわフラッシュ | 初心者向けの英会話フレーズ練習",
  description:
    "あいさつ・自己紹介から旅行・買い物・レストランまで、初心者向けの英会話フレーズ56個を聞いて・声に出して覚える学習デモアプリ。ブラウザだけで動きます。",
}

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
}

export default function Page() {
  return (
    <AppShell background="bg-linear-to-b from-sky-50 via-indigo-50 to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <EnglishApp />
    </AppShell>
  )
}
