import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "おうち筋トレ20 | 道具なし・毎日20分の自宅トレーニング",
  description:
    "道具を使わない20分の自宅トレーニングを、音声ガイド付きのタイマーで毎日続けるアプリ。1年で3kg減を目標に体重と記録を管理します。",
  // ホーム画面に追加したときの名前・アイコン（public/workout/ に置いている）
  manifest: "/workout/manifest.webmanifest",
  applicationName: "おうち筋トレ20",
  appleWebApp: {
    capable: true,
    title: "筋トレ20",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/workout/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/workout/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // iPhone のノッチやホームバーの下まで背景を広げ、中身は safe-area で避ける
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff7ed" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
}

export default function WorkoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
