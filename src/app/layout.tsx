import type { Metadata, Viewport } from "next"
import { M_PLUS_Rounded_1c } from "next/font/google"

import "./globals.css"

const appSans = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-app-sans",
  // 日本語は unicode-range で数百ファイルに分割されている。preload すると
  // 全ファイルに preload タグが付いてしまうため、必要な分だけ遅延取得させる。
  preload: false,
  fallback: [
    "Hiragino Maru Gothic ProN",
    "Hiragino Kaku Gothic ProN",
    "Yu Gothic",
    "Meiryo",
    "sans-serif",
  ],
})

export const metadata: Metadata = {
  title: "かなフラッシュ | ひらがな・カタカナを覚えるフラッシュカード",
  description:
    "ひらがな46字・カタカナ46字をカードをめくって覚える学習デモアプリ。通信なしでブラウザだけで動きます。",
}

export const viewport: Viewport = {
  themeColor: "#fb7185",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={appSans.variable}>
      <body className="min-h-dvh bg-linear-to-b from-rose-50 via-amber-50 to-sky-50 antialiased dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {children}
      </body>
    </html>
  )
}
