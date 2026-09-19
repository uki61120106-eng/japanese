"use client"

import { ChevronDown, ChevronUp, Languages } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DOC_TYPE_LABEL } from "@/lib/toeic/category"
import type { Part7Passage } from "@/lib/toeic/types"

type PassageViewProps = {
  passage: Part7Passage
  collapsed: boolean
  onToggleCollapse: () => void
  /** 和訳の表示。答え合わせが済むまでは出さない */
  showTranslation: boolean
  onToggleTranslation: (() => void) | null
}

export function PassageView({
  passage,
  collapsed,
  onToggleCollapse,
  showTranslation,
  onToggleTranslation,
}: PassageViewProps) {
  return (
    <Card className="gap-3 rounded-3xl border-2 py-4 shadow-sm">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <Badge
              variant="secondary"
              className="w-fit text-[0.65rem] tracking-wider"
            >
              {DOC_TYPE_LABEL[passage.docType]}
            </Badge>
            <h2 className="font-english text-sm font-bold leading-snug">
              {passage.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-muted-foreground h-7 shrink-0 gap-1 text-xs"
          >
            {collapsed ? (
              <>
                <ChevronDown className="size-3.5" />
                本文を出す
              </>
            ) : (
              <>
                <ChevronUp className="size-3.5" />
                たたむ
              </>
            )}
          </Button>
        </div>

        {!collapsed && (
          <>
            {passage.meta.length > 0 && (
              <dl className="border-border bg-muted/50 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-xl border px-3 py-2 text-[0.75rem]">
                {passage.meta.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="text-muted-foreground font-medium">
                      {row.label}
                    </dt>
                    <dd className="font-english break-all">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="font-english text-[0.95rem] leading-relaxed whitespace-pre-line">
              {passage.body}
            </p>

            {onToggleTranslation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleTranslation}
                className="text-muted-foreground h-7 w-fit gap-1.5 text-xs"
              >
                <Languages className="size-3.5" />
                {showTranslation ? "和訳を隠す" : "和訳を見る"}
              </Button>
            )}

            {showTranslation && (
              <p className="text-muted-foreground border-border border-t pt-3 text-[0.85rem] leading-relaxed whitespace-pre-line">
                {passage.translation}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
