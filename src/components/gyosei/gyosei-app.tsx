"use client"

import { useEffect, useState } from "react"
import {
  CalendarDays,
  ChartColumn,
  House,
  Settings as SettingsIcon,
  Trophy,
} from "lucide-react"

import { CheckScreen } from "@/components/gyosei/check-screen"
import { Dashboard } from "@/components/gyosei/dashboard"
import { KijutsuPractice } from "@/components/gyosei/kijutsu-practice"
import { MockHome } from "@/components/gyosei/mock-home"
import { MockGrade, MockResult } from "@/components/gyosei/mock-result"
import { MockRunner } from "@/components/gyosei/mock-runner"
import { PlanScreen } from "@/components/gyosei/plan-screen"
import { QuizResult } from "@/components/gyosei/quiz-result"
import { QuizScreen, type QuizOutcome } from "@/components/gyosei/quiz-screen"
import { SettingsScreen, SetupScreen } from "@/components/gyosei/settings-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  finishMock,
  markDayDone,
  recordCheck,
  recordKijutsu,
  saveDraft,
} from "@/lib/gyosei/actions"
import { todayISO } from "@/lib/gyosei/dates"
import {
  buildMock,
  missedStatements,
  questionScore,
  scoreMock,
  type MockDraft,
  type MockRecord,
} from "@/lib/gyosei/mock"
import { buildPlan, dayInfo } from "@/lib/gyosei/plan"
import {
  buildCheckSession,
  buildDailySession,
  buildTopicSession,
  buildWeakSession,
  shuffled,
  type Session,
} from "@/lib/gyosei/session"
import { useAppState } from "@/lib/gyosei/store"
import type { Kijutsu } from "@/lib/gyosei/types"
import { cn } from "@/lib/utils"

type Tab = "home" | "check" | "mock" | "plan" | "settings"

type View =
  | { name: Tab }
  | { name: "quiz"; session: Session; round: number }
  | {
      name: "quizResult"
      session: Session
      outcomes: QuizOutcome[]
      kijutsuScore: number | null
    }
  | { name: "kijutsu"; kijutsu: Kijutsu }
  | { name: "mockRun" }
  | { name: "mockGrade"; draft: MockDraft }
  | { name: "mockResult"; draft: MockDraft; record: MockRecord }

const TABS: { id: Tab; label: string; icon: typeof House }[] = [
  { id: "home", label: "ホーム", icon: House },
  { id: "check", label: "理解度", icon: ChartColumn },
  { id: "mock", label: "模試", icon: Trophy },
  { id: "plan", label: "計画", icon: CalendarDays },
  { id: "settings", label: "設定", icon: SettingsIcon },
]

export function GyoseiApp() {
  const state = useAppState()
  const [view, setView] = useState<View>({ name: "home" })
  const [round, setRound] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  if (!state) {
    return (
      <Shell>
        <p className="text-muted-foreground py-20 text-center text-sm">読み込み中…</p>
      </Shell>
    )
  }

  const today = todayISO()

  if (!state.settings) {
    return (
      <Shell>
        <SetupScreen today={today} />
      </Shell>
    )
  }

  const settings = state.settings
  const plan = buildPlan(settings)
  const info = dayInfo(plan, settings, today)

  function startSession(session: Session) {
    setRound(round + 1)
    setView({ name: "quiz", session, round: round + 1 })
  }

  function finalizeMock(draft: MockDraft) {
    const record = scoreMock(draft, today)
    const kijutsuScores = draft.questions.flatMap((question, index) =>
      question.kind === "kijutsu"
        ? [{ id: question.id, score: questionScore(question, draft.answers[index]).score }]
        : []
    )
    finishMock(record, missedStatements(draft), kijutsuScores, today)
    setView({ name: "mockResult", draft, record })
  }

  const tab: Tab | null =
    view.name === "home" ||
    view.name === "check" ||
    view.name === "mock" ||
    view.name === "plan" ||
    view.name === "settings"
      ? view.name
      : null

  let content: React.ReactNode
  switch (view.name) {
    case "home":
      content = (
        <Dashboard
          state={state}
          plan={plan}
          info={info}
          today={today}
          daily={buildDailySession(state, plan, info, today)}
          onStartDaily={() =>
            startSession(buildDailySession(state, plan, info, today))
          }
          onStartCheck={() => startSession(buildCheckSession(state, plan, info))}
          onOpenMock={() => setView({ name: "mock" })}
          onResumeMock={() => setView({ name: "mockRun" })}
        />
      )
      break
    case "check":
      content = (
        <CheckScreen
          state={state}
          onStartCheck={() => startSession(buildCheckSession(state, plan, info))}
          onStartWeak={() => startSession(buildWeakSession(state))}
          onStartTopic={(ref) => startSession(buildTopicSession(state, ref))}
          onStartKijutsu={(kijutsu) => setView({ name: "kijutsu", kijutsu })}
        />
      )
      break
    case "mock":
      content = (
        <MockHome
          state={state}
          onStart={(kind) => {
            saveDraft(buildMock(kind, today))
            setView({ name: "mockRun" })
          }}
          onResume={() => setView({ name: "mockRun" })}
        />
      )
      break
    case "plan":
      content = <PlanScreen plan={plan} info={info} />
      break
    case "settings":
      content = (
        <SettingsScreen settings={settings} onSaved={() => undefined} />
      )
      break
    case "quiz":
      content = (
        <QuizScreen
          key={view.round}
          session={view.session}
          today={today}
          onQuit={() => setView({ name: "home" })}
          onFinish={(outcomes, kijutsuScore) => {
            if (view.session.kind === "daily") markDayDone(today)
            if (view.session.kind === "check") {
              recordCheck(
                info.week,
                today,
                outcomes.filter((o) => o.correct).length,
                outcomes.length
              )
            }
            setView({
              name: "quizResult",
              session: view.session,
              outcomes,
              kijutsuScore,
            })
          }}
        />
      )
      break
    case "quizResult":
      content = (
        <QuizResult
          session={view.session}
          outcomes={view.outcomes}
          kijutsuScore={view.kijutsuScore}
          onHome={() => setView({ name: "home" })}
          onRetryWrong={() =>
            startSession({
              kind: "weak",
              title: "まちがえた問題をもう一度",
              topic: null,
              kijutsu: null,
              items: shuffled(
                view.outcomes
                  .filter((o) => !o.correct)
                  .map((o) => ({ statement: o.statement, isNew: false }))
              ),
            })
          }
        />
      )
      break
    case "kijutsu":
      content = (
        <Card className="rounded-3xl py-5">
          <CardContent className="flex flex-col gap-3 px-5">
            <KijutsuPractice
              kijutsu={view.kijutsu}
              doneLabel="記録して戻る"
              onDone={(score) => {
                recordKijutsu(view.kijutsu.id, score, today)
                setView({ name: "check" })
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setView({ name: "check" })}
            >
              記録せずに戻る
            </Button>
          </CardContent>
        </Card>
      )
      break
    case "mockRun":
      content = state.draft ? (
        <MockRunner
          initial={state.draft}
          today={today}
          onPause={() => setView({ name: "home" })}
          onSubmit={(draft) => {
            if (draft.questions.some((q) => q.kind === "kijutsu")) {
              setView({ name: "mockGrade", draft })
            } else {
              finalizeMock(draft)
            }
          }}
        />
      ) : (
        <p className="text-muted-foreground text-sm">中断中の模試はありません。</p>
      )
      break
    case "mockGrade":
      content = <MockGrade draft={view.draft} onDone={finalizeMock} />
      break
    case "mockResult":
      content = (
        <MockResult
          draft={view.draft}
          record={view.record}
          onHome={() => setView({ name: "home" })}
        />
      )
      break
  }

  return (
    <Shell withNav={tab !== null}>
      {content}
      {tab !== null && (
        <nav className="bg-background/95 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur">
          <div className="mx-auto grid max-w-lg grid-cols-5 px-2 pb-[env(safe-area-inset-bottom)]">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView({ name: id })}
                aria-current={tab === id ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[0.7rem] font-bold",
                  tab === id ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </Shell>
  )
}

function Shell({
  children,
  withNav = false,
}: {
  children: React.ReactNode
  withNav?: boolean
}) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-lg flex-col px-4 py-6",
        withNav && "pb-28"
      )}
    >
      {children}
    </main>
  )
}
