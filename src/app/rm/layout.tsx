import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "RM 計算機 | 最大挙上重量（1RM）の推定",
  description:
    "挙げた重量と回数から最大挙上重量（1RM）を推定し、回数ごとの重量や目的別の目安を計算します。通信なしでブラウザだけで動きます。",
  // ホーム画面に追加したときの名前・アイコン（public/rm/ に置いている）
  manifest: "/rm/manifest.webmanifest",
  applicationName: "RM 計算機",
  appleWebApp: {
    capable: true,
    title: "RM計算",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/rm/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/rm/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // iPhone のノッチやホームバーの下まで背景を広げ、中身は safe-area で避ける
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff1f2" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
}

export default function RmLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
