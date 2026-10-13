import { WorkoutApp } from "@/components/workout/workout-app"

export default function WorkoutPage() {
  return (
    <main className="theme-workout mx-auto flex w-full max-w-lg flex-col px-[max(1rem,env(safe-area-inset-left))] pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12">
      <WorkoutApp />
    </main>
  )
}
