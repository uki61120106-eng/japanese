"use client"

import { Share, SquarePlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { isOnSite, promptInstall, useInstallState } from "@/lib/pwa"

/** スマホのブラウザで開いているときだけ「ホーム画面に追加」を案内する */
export function InstallHint({
  scope,
  icon,
  hidden,
  onDismiss,
  iosNote,
}: {
  /** アプリのページ（例: "/rm"） */
  scope: string
  /** 案内に並べるアプリのアイコン */
  icon: string
  hidden: boolean
  onDismiss: () => void
  /** iPhone の手順の下に添える補足 */
  iosNote?: string
}) {
  const install = useInstallState()
  if (!install || hidden || !isOnSite(scope) || install.standalone || !install.touch) {
    return null
  }

  return (
    <section className="bg-card relative flex flex-col gap-3 rounded-3xl border p-5 pr-12 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        className="text-muted-foreground absolute top-2 right-2"
        aria-label="案内を閉じる"
      >
        <X />
      </Button>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- 1枚の HTML 版でも同じ表示にするため */}
        <img
          src={icon}
          alt=""
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-xl"
        />
        <div className="flex min-w-0 flex-col">
          <h2 className="font-extrabold">ホーム画面に追加</h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            アプリのようにワンタップで開けて、通信がない場所でも使えます
          </p>
        </div>
      </div>

      {install.canPrompt ? (
        <Button onClick={() => void promptInstall()} className="h-11 rounded-xl">
          <SquarePlus />
          ホーム画面に追加する
        </Button>
      ) : install.ios ? (
        <ol className="flex flex-col gap-1.5 text-sm">
          <li className="flex items-center gap-2">
            <span className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              1
            </span>
            <span>
              画面下（iPad は右上）の共有ボタン
              <Share className="mx-0.5 inline size-4 align-[-0.15em]" aria-hidden />
              を押す
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              2
            </span>
            「ホーム画面に追加」を選ぶ
          </li>
          {iosNote && (
            <li className="text-muted-foreground text-xs leading-relaxed">{iosNote}</li>
          )}
        </ol>
      ) : (
        <p className="text-sm">
          ブラウザのメニュー（︙）から「ホーム画面に追加」または「アプリをインストール」を選んでください。
        </p>
      )}
    </section>
  )
}
