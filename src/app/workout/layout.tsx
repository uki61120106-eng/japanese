import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "おうち筋トレ20 | 道具なし・毎日20分の自宅トレーニング",
  description:
    "道具を使わない20分の自宅トレーニングを、音声ガイド付きのタイマーで毎日続けるアプリ。1年で3kg減を目標に体重と記録を管理します。",
}

export const viewport: Viewport = {
  themeColor: "#f97316",
}

export default function WorkoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
