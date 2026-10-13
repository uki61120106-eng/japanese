import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "社労士 毎日30分 | 1年で合格を目指す学習アプリ",
  description:
    "一問一答・間隔反復の復習・ミニ模試で、社会保険労務士試験の合格を目指す学習アプリ。記録はブラウザ内に保存されます。",
}

export const viewport: Viewport = {
  themeColor: "#0d9488",
}

export default function SharoushiLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
