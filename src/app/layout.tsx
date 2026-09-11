import type { Metadata, Viewport } from "next"

import "./globals.css"

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
    <html lang="ja">
      <head>
        {/*
          next/font で self-host すると、日本語は unicode-range で 500 個以上の
          woff2 に分割されてビルド成果物に入ってしまう。表示に必要な字形だけを
          取りに行かせたいので Google Fonts の CSS を読み込む。
          取得できない環境では globals.css の端末内蔵フォントにフォールバックする。
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* ルートレイアウトなので全ページに適用される（Pages Router 向けの警告） */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap"
        />
      </head>
      <body className="min-h-dvh bg-linear-to-b from-rose-50 via-amber-50 to-sky-50 antialiased dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {children}
      </body>
    </html>
  )
}
