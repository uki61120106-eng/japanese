"use client"

import { useState } from "react"
import { BadgeCheck, ExternalLink, Flag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { lawLinks } from "@/lib/sharoushi/law-links"
import type { Question } from "@/lib/sharoushi/questions"
import { setQuestionCheck, useStudyData } from "@/lib/sharoushi/store"
import { cn } from "@/lib/utils"

/** 解説の下に出す、根拠の確認リンクと「確認済み」「誤りを報告」ボタン */
export function QuestionCheck({ question }: { question: Question }) {
  const data = useStudyData()
  const check = data?.checks[question.id]
  /** 報告メモの入力中（埋め込み先によっては prompt() が使えないため画面内で入力する） */
  const [draft, setDraft] = useState<string | null>(null)

  function flag() {
    if (check?.status === "flag") {
      setQuestionCheck(question.id, "flag")
      return
    }
    setDraft("")
  }

  function submitFlag() {
    setQuestionCheck(question.id, "flag", draft?.trim() || undefined)
    setDraft(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-foreground">根拠を確認:</span>
        {lawLinks(question.basis).map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 text-teal-700 underline underline-offset-2 dark:text-teal-300"
          >
            {link.label}
            <ExternalLink className="size-3" />
          </a>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-pressed={check?.status === "ok"}
          onClick={() => setQuestionCheck(question.id, "ok")}
          className={cn(
            "h-7 gap-1 text-xs",
            check?.status === "ok" &&
              "border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-200"
          )}
        >
          <BadgeCheck className="size-3.5" />
          {check?.status === "ok" ? "確認済み" : "条文で確認した"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-pressed={check?.status === "flag"}
          onClick={flag}
          className={cn(
            "h-7 gap-1 text-xs",
            check?.status === "flag" &&
              "border-rose-400 bg-rose-50 text-rose-800 hover:bg-rose-50 dark:bg-rose-950 dark:text-rose-200"
          )}
        >
          <Flag className="size-3.5" />
          {check?.status === "flag" ? "報告済み（取り消す）" : "誤りを報告"}
        </Button>
      </div>
      {draft !== null && (
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            submitFlag()
          }}
        >
          <label htmlFor={`flag-note-${question.id}`} className="text-xs">
            どこが怪しいかメモ（空のままでも記録できます）
          </label>
          <textarea
            id={`flag-note-${question.id}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={2}
            autoFocus
            className="border-input bg-background rounded-md border px-2 py-1 text-sm"
            placeholder="例: 期限は14日ではなく10日では？"
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setDraft(null)}>
              やめる
            </Button>
            <Button type="submit" size="sm" className="bg-rose-600 text-white hover:bg-rose-600/90">
              報告を記録する
            </Button>
          </div>
        </form>
      )}
      {check?.status === "flag" && check.note && (
        <p className="text-muted-foreground text-xs">メモ: {check.note}</p>
      )}
    </div>
  )
}
