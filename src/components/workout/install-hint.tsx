"use client"

import { Share, SquarePlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { promptInstall, useInstallState } from "@/lib/workout/pwa"
import { updateWorkoutData } from "@/lib/workout/storage"

/** スマホのブラウザで開いているときだけ「ホーム画面に追加」を案内する */
export function InstallHint({ hidden }: { hidden: boolean }) {
  const install = useInstallState()
  if (!install || hidden || !install.onSite || install.standalone || !install.touch) {
    return null
  }

  function dismiss() {
    updateWorkoutData((data) => ({
      ...data,
      settings: { ...data.settings, hideInstallHint: true },
    }))
  }

  return (
    <section className="bg-card relative flex flex-col gap-3 rounded-3xl border p-5 pr-12 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={dismiss}
        className="text-muted-foreground absolute top-2 right-2"
        aria-label="案内を閉じる"
      >
        <X />
      </Button>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- 1枚の HTML 版でも同じ表示にするため */}
        <img
          src="/workout/icons/icon-192.png"
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
          <li className="text-muted-foreground text-xs leading-relaxed">
            iPhone では Safari とホーム画面のアプリで記録の保存場所が分かれます。記録を始める前に追加するのがおすすめです。
          </li>
        </ol>
      ) : (
        <p className="text-sm">
          ブラウザのメニュー（︙）から「ホーム画面に追加」または「アプリをインストール」を選んでください。
        </p>
      )}
    </section>
  )
}
