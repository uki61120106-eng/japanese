import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ハングルフラッシュ | 韓国語の単語とあいさつ",
  description:
    "韓国語の基本のあいさつと日常の単語を、カードと4択クイズで覚える学習デモアプリ。通信なしでブラウザだけで動きます。",
}

export default function KoreanLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/*
        ハングルの字形は M PLUS Rounded 1c に入っていないため、韓国語の画面だけ
        Noto Sans KR を追加で読み込む。React 19 が <head> へ引き上げてくれる。
        読み込めない環境では globals.css の端末内蔵フォントにフォールバックする。
      */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"
      />
      {children}
    </>
  )
}
