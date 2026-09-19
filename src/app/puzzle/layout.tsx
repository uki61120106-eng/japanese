import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ドロップクエスト | ドロップをつなぐパズルRPG",
  description:
    "ドロップを動かしてコンボを組み、モンスターを育ててダンジョンを攻略するパズルRPG。通信なしでブラウザだけで動きます。",
}

export default function PuzzleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
