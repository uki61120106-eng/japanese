import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

type AppShellProps = {
  /** アプリごとの背景グラデーション（body ではなくここで切り替える） */
  background: string
  children: React.ReactNode
}

/** 各アプリ共通の外枠。スマホ幅を基準に中央寄せし、トップへ戻る導線を置く。 */
export function AppShell({ background, children }: AppShellProps) {
  return (
    <div className={cn("min-h-dvh", background)}>
      <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-6 sm:py-10">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 self-start text-xs font-medium transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          アプリをえらぶ
        </Link>
        {children}
      </main>
    </div>
  )
}
