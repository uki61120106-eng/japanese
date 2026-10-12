import type { Metadata } from "next"

import { SorobanApp } from "@/components/soroban/soroban-app"

export const metadata: Metadata = {
  title: "そろばん ドリル | 4〜6きゅうの れんしゅう もんだい",
  description:
    "そろばん（珠算）4〜6級レベルの かけざん・わりざん・みとりざんを れんしゅうできるアプリ。通信なしでブラウザだけで動きます。",
}

export default function SorobanPage() {
  return <SorobanApp />
}
