import Link from "next/link"
import type { Viewport } from "next"
import { ArrowRight, Languages, MessagesSquare } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HIRAGANA, KATAKANA } from "@/lib/kana"
import { PHRASES } from "@/lib/phrases"
import { cn } from "@/lib/utils"

export const viewport: Viewport = {
  themeColor: "#818cf8",
}

const APPS = [
  {
    href: "/kana",
    icon: Languages,
    title: "かなフラッシュ",
    lead: "ひらがな・カタカナを覚える",
    description: "日本語の文字がまだ読めない人向け。カードをめくって92字を練習します。",
    count: `${HIRAGANA.length + KATAKANA.length} もじ`,
    face: "from-rose-400 to-fuchsia-500 dark:from-rose-500 dark:to-fuchsia-600",
    ring: "hover:ring-rose-300 dark:hover:ring-rose-700",
  },
  {
    href: "/english",
    icon: MessagesSquare,
    title: "えいかいわフラッシュ",
    lead: "初心者向けの英会話フレーズ",
    description:
      "あいさつ・自己紹介から旅行・買い物まで。聞いて、声に出して練習します。",
    count: `${PHRASES.length} フレーズ`,
    face: "from-sky-400 to-indigo-500 dark:from-sky-500 dark:to-indigo-600",
    ring: "hover:ring-sky-300 dark:hover:ring-sky-700",
  },
]

export default function Page() {
  return (
    <div className="min-h-dvh bg-linear-to-b from-indigo-50 via-rose-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10 sm:py-16">
        <header className="flex flex-col items-center gap-3 text-center">
          <Badge className="bg-linear-to-r from-indigo-500 to-rose-500 px-3 py-1 text-[0.7rem] tracking-widest">
            DEMO
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            学習デモアプリ
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            どちらもブラウザだけで動きます。ログインも通信もいりません
          </p>
        </header>

        <nav className="flex flex-col gap-4">
          {APPS.map((app) => (
            <Link key={app.href} href={app.href} className="group">
              <Card
                className={cn(
                  "gap-0 rounded-3xl border-2 py-0 shadow-lg ring-4 ring-transparent transition-all group-hover:-translate-y-0.5 group-hover:shadow-xl",
                  app.ring
                )}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <span
                    className={cn(
                      "flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-md",
                      app.face
                    )}
                  >
                    <app.icon className="size-7" />
                  </span>

                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-lg leading-tight font-bold">
                      {app.title}
                    </span>
                    <span className="text-foreground/80 text-sm font-medium">
                      {app.lead}
                    </span>
                    <span className="text-muted-foreground text-xs leading-relaxed text-pretty">
                      {app.description}
                    </span>
                    <span className="text-muted-foreground/80 text-[0.7rem] font-medium tabular-nums">
                      ぜんぶで {app.count}
                    </span>
                  </span>

                  <ArrowRight className="text-muted-foreground size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  )
}
