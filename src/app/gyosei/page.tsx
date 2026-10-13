import type { Metadata } from "next"

import { GyoseiApp } from "@/components/gyosei/gyosei-app"

export const metadata: Metadata = {
  title: "行政書士 1年合格プラン | 毎日30分の学習アプリ",
  description:
    "1日30分・約1年で行政書士試験の合格を目指す学習アプリ。要点、一問一答、間隔反復の復習、週次の理解度チェック、本試験形式の模試。",
}

export default function Page() {
  return <GyoseiApp />
}
