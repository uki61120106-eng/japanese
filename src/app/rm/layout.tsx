import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "RM 計算機 | 最大挙上重量（1RM）の推定",
  description:
    "挙げた重量と回数から最大挙上重量（1RM）を推定し、回数ごとの重量や目的別の目安を計算します。通信なしでブラウザだけで動きます。",
  formatDetection: { telephone: false },
}

export default function RmLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
