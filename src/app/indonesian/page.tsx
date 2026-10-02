import type { Metadata } from "next"

import { IndonesianApp } from "@/components/indonesian/indonesian-app"

export const metadata: Metadata = {
  title: "Ayo Bicara! | 場面で覚えるインドネシア語会話",
  description:
    "あいさつ・買い物・レストランなどの場面別会話で、インドネシア語を読んで・聞いて・ロールプレイで練習する学習デモアプリ。",
}

export default function Page() {
  return <IndonesianApp />
}
