import { RmCalculator } from "@/components/rm/rm-calculator"

export default function RmPage() {
  return (
    <main className="theme-rm mx-auto flex w-full max-w-lg flex-col px-[max(1rem,env(safe-area-inset-left))] pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12">
      <RmCalculator />
    </main>
  )
}
