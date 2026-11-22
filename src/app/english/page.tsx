import type { Metadata, Viewport } from "next"

import { AppShell } from "@/components/app-shell"
import { EnglishApp } from "@/components/english/english-app"

export const metadata: Metadata = {
  title: "えいかいわフラッシュ | 初心者向けの英会話フレーズ練習",
  description:
    "あいさつ・自己紹介から旅行・買い物・レストランまで、初心者向けの英会話フレーズ56個を聞き流し・カード・発音チェックで覚える学習デモアプリ。ブラウザだけで動きます。",
  // ホーム画面に追加したときの名前・アイコン（public/english/ に置いている）
  manifest: "/english/manifest.webmanifest",
  applicationName: "えいかいわフラッシュ",
  appleWebApp: {
    capable: true,
    title: "えいかいわ",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/english/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/english/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // iPhone のノッチやホームバーの下まで背景を広げ、中身は safe-area で避ける
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f9ff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
}

export default function Page() {
  return (
    <AppShell background="bg-linear-to-b from-sky-50 via-indigo-50 to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <EnglishApp />
    </AppShell>
  )
}
