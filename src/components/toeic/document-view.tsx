"use client"

import { ChevronDown, ChevronUp, Languages } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DOC_TYPE_LABEL } from "@/lib/toeic/category"
import type { Part7Set } from "@/lib/toeic/types"

type DocumentViewProps = {
  set: Part7Set
  collapsed: boolean
  onToggleCollapse: () => void
  /** 和訳の表示。答え合わせが済むまでは出さない */
  showTranslation: boolean
  onToggleTranslation: (() => void) | null
}

export function DocumentView({
  set,
  collapsed,
  onToggleCollapse,
  showTranslation,
  onToggleTranslation,
}: DocumentViewProps) {
  const multiple = set.documents.length > 1

  return (
    <Card className="gap-3 rounded-3xl border-2 py-4 shadow-sm">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            {multiple && (
              <Badge className="w-fit bg-amber-600 text-[0.65rem] tracking-wider hover:bg-amber-600">
                {set.documents.length}文書
              </Badge>
            )}
            <h2 className="font-english text-sm leading-snug font-bold">
              {set.documents[0].title}
              {multiple && " ほか"}
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
            {set.documents.map((document, index) => (
              <section
                key={document.title}
                className={
                  index > 0 ? "border-border mt-2 border-t pt-4" : undefined
                }
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {multiple && (
                    <span className="text-muted-foreground text-[0.7rem] font-bold">
                      文書 {index + 1}
                    </span>
                  )}
                  <Badge
                    variant="secondary"
                    className="text-[0.65rem] tracking-wider"
                  >
                    {DOC_TYPE_LABEL[document.docType]}
                  </Badge>
                  {multiple && (
                    <span className="font-english text-[0.8rem] font-bold">
                      {document.title}
                    </span>
                  )}
                </div>

                {document.meta.length > 0 && (
                  <dl className="border-border bg-muted/50 mb-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-xl border px-3 py-2 text-[0.75rem]">
                    {document.meta.map((row) => (
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
                  {document.body}
                </p>

                {showTranslation && (
                  <p className="text-muted-foreground border-border mt-3 border-t pt-3 text-[0.85rem] leading-relaxed whitespace-pre-line">
                    {document.translation}
                  </p>
                )}
              </section>
            ))}

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
          </>
        )}
      </CardContent>
    </Card>
  )
}
