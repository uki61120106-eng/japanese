"use client"

import { useState } from "react"
import { BookOpenCheck } from "lucide-react"

import { MockExam } from "@/components/sharoushi/mock-exam"
import { MockResult } from "@/components/sharoushi/mock-result"
import { MockTab } from "@/components/sharoushi/mock-tab"
import { PlanTab } from "@/components/sharoushi/plan-tab"
import {
  QuizSession,
  type SessionItem,
  type SessionResult,
} from "@/components/sharoushi/quiz-session"
import { ReviewTab } from "@/components/sharoushi/review-tab"
import { SessionResultScreen } from "@/components/sharoushi/session-result"
import { TodayTab } from "@/components/sharoushi/today-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { todayKey } from "@/lib/sharoushi/dates"
import {
  buildMock,
  scoreMock,
  type MockQuestion,
  type MockScore,
} from "@/lib/sharoushi/mock"
import { buildDailyMenu, buildPlan, dueQuestions } from "@/lib/sharoushi/plan"
import type { Question } from "@/lib/sharoushi/questions"
import { lastWrongQuestions } from "@/lib/sharoushi/stats"
import {
  addStudySeconds,
  recordAnswer,
  recordMock,
  useStudyData,
} from "@/lib/sharoushi/store"

type Tab = "today" | "review" | "mock" | "plan"

type View =
  | { kind: "home" }
  | { kind: "session"; title: string; items: SessionItem[]; startedAt: number }
  | { kind: "sessionResult"; results: SessionResult[] }
  | { kind: "mock"; questions: MockQuestion[]; startedAt: number }
  | {
      kind: "mockResult"
      questions: MockQuestion[]
      picks: (number | null)[]
      score: MockScore
    }

export default function SharoushiPage() {
  const data = useStudyData()
  const [tab, setTab] = useState<Tab>("today")
  const [view, setView] = useState<View>({ kind: "home" })

  if (data === null) {
    return (
      <main className="text-muted-foreground mx-auto max-w-lg px-4 py-16 text-center text-sm">
        読み込み中…
      </main>
    )
  }

  const today = todayKey()
  const plan = buildPlan(data.startDate, data.examDate)
  const menu = buildDailyMenu(data.cards, plan, today)
  const due = dueQuestions(data.cards, today)
  const lastWrong = lastWrongQuestions(data.cards)

  function startSession(title: string, items: SessionItem[]) {
    if (items.length === 0) return
    setView({ kind: "session", title, items, startedAt: Date.now() })
  }

  function startQuestions(title: string, questions: Question[]) {
    startSession(
      title,
      questions.map((question) => ({
        question,
        kind: data?.cards[question.id] ? "review" : "new",
      }))
    )
  }

  function goHome() {
    setView({ kind: "home" })
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-6 sm:py-10">
      {view.kind === "home" && (
        <div className="flex flex-col gap-5">
          <header className="flex flex-col items-center gap-1 text-center">
            <BookOpenCheck className="size-8 text-teal-600" />
            <h1 className="text-2xl font-black tracking-tight">社労士 毎日30分</h1>
            <p className="text-muted-foreground text-xs">
              一問一答と復習、模試で1年後の合格へ
            </p>
          </header>

          <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
            <TabsList className="mb-2 grid h-11 w-full grid-cols-4 rounded-xl p-1">
              <TabsTrigger value="today" className="rounded-lg">今日</TabsTrigger>
              <TabsTrigger value="review" className="rounded-lg">振り返り</TabsTrigger>
              <TabsTrigger value="mock" className="rounded-lg">模試</TabsTrigger>
              <TabsTrigger value="plan" className="rounded-lg">計画</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              <TodayTab
                data={data}
                today={today}
                plan={plan}
                menu={menu}
                onStart={() =>
                  startSession("今日のメニュー", [
                    ...menu.review.map((question) => ({ question, kind: "review" as const })),
                    ...menu.fresh.map((question) => ({
                      question,
                      kind: data.cards[question.id] ? ("review" as const) : ("new" as const),
                    })),
                  ])
                }
              />
            </TabsContent>
            <TabsContent value="review">
              <ReviewTab
                data={data}
                today={today}
                due={due}
                lastWrong={lastWrong}
                onStart={startQuestions}
              />
            </TabsContent>
            <TabsContent value="mock">
              <MockTab
                data={data}
                onStart={() =>
                  setView({ kind: "mock", questions: buildMock(), startedAt: Date.now() })
                }
              />
            </TabsContent>
            <TabsContent value="plan">
              <PlanTab data={data} today={today} plan={plan} />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {view.kind === "session" && (
        <QuizSession
          title={view.title}
          items={view.items}
          startedAt={view.startedAt}
          onFinish={(results) => setView({ kind: "sessionResult", results })}
          onQuit={(results) =>
            results.length > 0
              ? setView({ kind: "sessionResult", results })
              : goHome()
          }
        />
      )}

      {view.kind === "sessionResult" && (
        <SessionResultScreen
          results={view.results}
          onRetryWrong={() =>
            startSession(
              "間違えた問題の解き直し",
              view.results
                .filter((r) => !r.correct)
                .map((r) => ({ question: r.question, kind: "review" }))
            )
          }
          onHome={goHome}
        />
      )}

      {view.kind === "mock" && (
        <MockExam
          questions={view.questions}
          startedAt={view.startedAt}
          onQuit={goHome}
          onSubmit={(picks, seconds) => {
            const score = scoreMock(view.questions, picks)
            recordMock({
              date: todayKey(),
              seconds,
              correct: score.correct,
              total: score.total,
              byGroup: score.byGroup,
            })
            addStudySeconds(seconds)
            // 間違えた問題の「誤っている記述」と、誤って選んだ記述を復習に回す
            view.questions.forEach((q, i) => {
              if (picks[i] === q.answerIndex) return
              recordAnswer(q.options[q.answerIndex].id, false)
              const picked = picks[i]
              if (picked !== null) recordAnswer(q.options[picked].id, false)
            })
            setView({ kind: "mockResult", questions: view.questions, picks, score })
          }}
        />
      )}

      {view.kind === "mockResult" && (
        <MockResult
          questions={view.questions}
          picks={view.picks}
          score={view.score}
          onHome={goHome}
        />
      )}
    </main>
  )
}
