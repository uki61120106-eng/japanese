"use client"

import { useState } from "react"

import { SorobanHome } from "@/components/soroban/soroban-home"
import { SorobanQuiz } from "@/components/soroban/soroban-quiz"
import { SorobanResult } from "@/components/soroban/soroban-result"
import { buildQuiz, type Grade, type KindChoice, type Problem } from "@/lib/soroban"
import { cn } from "@/lib/utils"

type Screen = "home" | "quiz" | "result"

export type QuizResult = {
  /** 問題 id ごとの入力したこたえ */
  answers: Record<string, number>
  /** かかった時間（ミリ秒） */
  elapsedMs: number
}

/**
 * そろばん練習アプリ本体。Next.js のルーティングに依存しないので、
 * 1枚の HTML に束ねる共有用デモからもそのまま描画できる。
 */
export function SorobanApp() {
  // ホームの設定。結果画面から戻っても保たれるようにここで持つ。
  const [grade, setGrade] = useState<Grade>(6)
  const [kind, setKind] = useState<KindChoice>("mix")
  const [count, setCount] = useState(10)

  const [screen, setScreen] = useState<Screen>("home")
  const [problems, setProblems] = useState<Problem[]>([])
  const [result, setResult] = useState<QuizResult>({ answers: {}, elapsedMs: 0 })
  // やり直すたびに出題画面の状態をリセットするための key
  const [round, setRound] = useState(0)

  function start(next: Problem[]) {
    setProblems(next)
    setRound((value) => value + 1)
    setScreen("quiz")
    // ホームを下までスクロールしてスタートしても、問題が上から見えるようにする
    window.scrollTo(0, 0)
  }

  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-lg flex-col px-4",
        // 出題中はスマホの1画面に収めて、問題とテンキーの間でスクロールさせない
        screen === "quiz"
          ? "h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] py-3"
          : "py-8 sm:py-12"
      )}
    >
      {screen === "home" && (
        <SorobanHome
          grade={grade}
          onGradeChange={setGrade}
          kind={kind}
          onKindChange={setKind}
          count={count}
          onCountChange={setCount}
          onStart={() => start(buildQuiz({ grade, kind, count }))}
        />
      )}

      {screen === "quiz" && (
        <SorobanQuiz
          key={round}
          grade={grade}
          problems={problems}
          onFinish={(next) => {
            setResult(next)
            setScreen("result")
          }}
          onQuit={() => setScreen("home")}
        />
      )}

      {screen === "result" && (
        <SorobanResult
          problems={problems}
          result={result}
          onRetryWrong={(wrong) => start(wrong)}
          onNewSet={() => start(buildQuiz({ grade, kind, count }))}
          onHome={() => setScreen("home")}
        />
      )}
    </main>
  )
}
