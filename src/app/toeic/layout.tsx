import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TOEIC トレーナー | Part 5・Part 7 の個人学習アプリ",
  description:
    "TOEIC 700 点を目標に、Part 5（短文穴埋め）と Part 7（読解）を間隔反復で解く個人用の学習アプリ。通信なし・ブラウザだけで動きます。",
}

export default function ToeicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // ルートレイアウトの背景（かなフラッシュ向けの暖色）を、
  // 学習パート用の落ち着いた配色で上書きする。
  return (
    <div className="min-h-dvh bg-linear-to-b from-slate-50 via-indigo-50/50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {children}
    </div>
  )
}
