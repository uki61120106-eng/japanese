import type { Metadata, Viewport } from "next"

import { GyoseiApp } from "@/components/gyosei/gyosei-app"

export const metadata: Metadata = {
  title: "行政書士 1年合格プラン | 毎日30分の学習アプリ",
  description:
    "1日30分・約1年で行政書士試験の合格を目指す学習アプリ。要点、一問一答、間隔反復の復習、週次の理解度チェック、本試験形式の模試。",
  // スマホのホーム画面に追加して、アプリのように毎日開けるようにする
  manifest: "/gyosei/manifest.webmanifest",
  appleWebApp: { capable: true, title: "行政書士", statusBarStyle: "default" },
  icons: {
    icon: "/gyosei/icon.svg",
    apple: "/gyosei/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#e11d48",
}

export default function Page() {
  return <GyoseiApp />
}
