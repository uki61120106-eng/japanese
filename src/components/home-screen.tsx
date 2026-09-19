"use client"

import { GraduationCap, Play, Shuffle, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROWS, rowCount, rowLabel, type RowId, type Script } from "@/lib/kana"
import { ROW_THEME } from "@/lib/row-theme"
import { cn } from "@/lib/utils"

/** 1枚 HTML のデモにはこのページしか入らないので、他ページへの導線は隠す */
const SINGLE_FILE_DEMO = process.env.NEXT_PUBLIC_SINGLE_FILE_DEMO === "1"

type HomeScreenProps = {
  script: Script
  onScriptChange: (script: Script) => void
  selectedRows: RowId[]
  onSelectedRowsChange: (rows: RowId[]) => void
  shuffle: boolean
  onShuffleChange: (shuffle: boolean) => void
  onStart: () => void
}

export function HomeScreen({
  script,
  onScriptChange,
  selectedRows,
  onSelectedRowsChange,
  shuffle,
  onShuffleChange,
  onStart,
}: HomeScreenProps) {
  const selected = new Set(selectedRows)
  const total = selectedRows.reduce((sum, row) => sum + rowCount(row), 0)
  const allSelected = selectedRows.length === ROWS.length

  function toggleRow(rowId: RowId) {
    onSelectedRowsChange(
      selected.has(rowId)
        ? selectedRows.filter((row) => row !== rowId)
        : [...selectedRows, rowId]
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <Badge className="gap-1.5 bg-linear-to-r from-fuchsia-500 to-rose-500 px-3 py-1 text-[0.7rem] tracking-widest">
          <Sparkles className="size-3" />
          DEMO
        </Badge>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          かなフラッシュ
        </h1>
        <p className="text-muted-foreground text-sm">
          カードをめくって、ひらがな・カタカナを覚えよう
        </p>
      </header>

      <Card className="gap-5 rounded-3xl border-2 shadow-lg">
        <CardContent className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              もじの しゅるい
            </Label>
            <Tabs
              value={script}
              onValueChange={(value) => onScriptChange(value as Script)}
            >
              <TabsList className="h-11 w-full rounded-xl p-1">
                <TabsTrigger value="hiragana" className="rounded-lg text-base">
                  ひらがな
                </TabsTrigger>
                <TabsTrigger value="katakana" className="rounded-lg text-base">
                  カタカナ
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-muted-foreground text-xs tracking-widest">
                れんしゅうする ぎょう
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  onSelectedRowsChange(
                    allSelected ? [] : ROWS.map((row) => row.id)
                  )
                }
              >
                {allSelected ? "すべて外す" : "すべて選ぶ"}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {ROWS.map((row) => {
                const theme = ROW_THEME[row.id]
                const isOn = selected.has(row.id)
                return (
                  <button
                    key={row.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isOn}
                    onClick={() => toggleRow(row.id)}
                    className={cn(
                      "focus-visible:ring-ring/60 rounded-2xl border-2 py-3 text-lg font-bold transition-all outline-none focus-visible:ring-4",
                      isOn
                        ? cn("scale-105 shadow-md", theme.chipActive)
                        : theme.chip
                    )}
                  >
                    {rowLabel(row, script)}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="bg-muted/60 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <Label htmlFor="shuffle" className="gap-2 text-sm font-medium">
              <Shuffle className="text-muted-foreground size-4" />
              じゅんばんを シャッフル
            </Label>
            <Switch
              id="shuffle"
              checked={shuffle}
              onCheckedChange={onShuffleChange}
            />
          </section>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button
          size="xl"
          disabled={total === 0}
          onClick={onStart}
          className="w-full gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-fuchsia-500 text-lg font-bold shadow-lg hover:from-rose-500/90 hover:to-fuchsia-500/90"
        >
          <Play className="size-5" />
          スタート
        </Button>
        <p className="text-muted-foreground text-sm">
          {total === 0 ? "行をひとつ以上えらんでください" : `ぜんぶで ${total} まい`}
        </p>
      </div>

      {/*
        next/link は Next のランタイムを引き込み、1枚 HTML のデモ
        （scripts/build-demo.mjs）で process 参照が残って動かなくなる。
        ページ間の行き来は素の <a> で足りるので、ここでは使わない。
      */}
      {!SINGLE_FILE_DEMO && (
        <footer className="flex justify-center pb-4">
          <a
            href="/toeic"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs underline-offset-4 hover:underline"
          >
            <GraduationCap className="size-3.5" />
            TOEIC トレーナーへ
          </a>
        </footer>
      )}
    </div>
  )
}
