import { WorkoutApp } from "@/components/workout/workout-app"

export default function WorkoutPage() {
  return (
    // 背景はルートレイアウトではなくページごとに持つ（アプリごとに切り替えるため）
    <div className="min-h-dvh bg-linear-to-b from-rose-50 via-amber-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="theme-workout mx-auto flex w-full max-w-lg flex-col px-[max(1rem,env(safe-area-inset-left))] pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12">
        <WorkoutApp />
      </main>
    </div>
  )
}
