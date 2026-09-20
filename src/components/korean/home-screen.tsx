"use client"

import { Languages, Play, Shuffle, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CATEGORIES, categoryCount, type CategoryId } from "@/lib/korean"
import { CATEGORY_THEME } from "@/lib/korean-theme"
import type { Direction, Mode } from "@/lib/korean-study"
import { cn } from "@/lib/utils"

type HomeScreenProps = {
  mode: Mode
  onModeChange: (mode: Mode) => void
  direction: Direction
  onDirectionChange: (direction: Direction) => void
  selectedCategories: CategoryId[]
  onSelectedCategoriesChange: (categories: CategoryId[]) => void
  shuffle: boolean
  onShuffleChange: (shuffle: boolean) => void
  onStart: () => void
}

export function HomeScreen({
  mode,
  onModeChange,
  direction,
  onDirectionChange,
  selectedCategories,
  onSelectedCategoriesChange,
  shuffle,
  onShuffleChange,
  onStart,
}: HomeScreenProps) {
  const selected = new Set(selectedCategories)
  const total = selectedCategories.reduce(
    (sum, category) => sum + categoryCount(category),
    0
  )
  const allSelected = selectedCategories.length === CATEGORIES.length

  function toggleCategory(categoryId: CategoryId) {
    onSelectedCategoriesChange(
      selected.has(categoryId)
        ? selectedCategories.filter((category) => category !== categoryId)
        : [...selectedCategories, categoryId]
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <Badge className="gap-1.5 bg-linear-to-r from-sky-500 to-violet-500 px-3 py-1 text-[0.7rem] tracking-widest">
          <Sparkles className="size-3" />
          DEMO
        </Badge>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          ハングルフラッシュ
        </h1>
        <p className="text-muted-foreground text-sm">
          韓国語の単語と、基本のあいさつを覚えよう
        </p>
      </header>

      <Card className="gap-5 rounded-3xl border-2 shadow-lg">
        <CardContent className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              れんしゅうの かたち
            </Label>
            <Tabs
              value={mode}
              onValueChange={(value) => onModeChange(value as Mode)}
            >
              <TabsList className="h-11 w-full rounded-xl p-1">
                <TabsTrigger value="card" className="rounded-lg text-base">
                  カード
                </TabsTrigger>
                <TabsTrigger value="quiz" className="rounded-lg text-base">
                  4択クイズ
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-muted-foreground text-xs">
              {mode === "card"
                ? "カードをめくって、読み方と意味を確かめます"
                : "4つの選択肢から正しい答えを選びます"}
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              しゅつだいの むき
            </Label>
            <Tabs
              value={direction}
              onValueChange={(value) => onDirectionChange(value as Direction)}
            >
              <TabsList className="h-11 w-full rounded-xl p-1">
                <TabsTrigger value="ko-ja" className="gap-1.5 rounded-lg">
                  <Languages className="size-4" />
                  韓国語 → 日本語
                </TabsTrigger>
                <TabsTrigger value="ja-ko" className="gap-1.5 rounded-lg">
                  <Languages className="size-4" />
                  日本語 → 韓国語
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-muted-foreground text-xs tracking-widest">
                れんしゅうする ぶんや
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  onSelectedCategoriesChange(
                    allSelected ? [] : CATEGORIES.map((category) => category.id)
                  )
                }
              >
                {allSelected ? "すべて外す" : "すべて選ぶ"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((category) => {
                const theme = CATEGORY_THEME[category.id]
                const isOn = selected.has(category.id)
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isOn}
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "focus-visible:ring-ring/60 flex flex-col items-center gap-0.5 rounded-2xl border-2 px-2 py-3 font-bold transition-all outline-none focus-visible:ring-4",
                      isOn
                        ? cn("scale-105 shadow-md", theme.chipActive)
                        : theme.chip
                    )}
                  >
                    <span className="text-sm">{category.label}</span>
                    <span className="text-[0.65rem] font-medium opacity-75">
                      {categoryCount(category.id)}語
                    </span>
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
          className="w-full gap-2 rounded-2xl bg-linear-to-r from-sky-500 to-violet-500 text-lg font-bold shadow-lg hover:from-sky-500/90 hover:to-violet-500/90"
        >
          <Play className="size-5" />
          スタート
        </Button>
        <p className="text-muted-foreground text-sm">
          {total === 0
            ? "分野をひとつ以上えらんでください"
            : `ぜんぶで ${total} 語`}
        </p>
      </div>
    </div>
  )
}
