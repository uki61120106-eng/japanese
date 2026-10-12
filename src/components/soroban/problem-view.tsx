import { formatNumber, type Problem } from "@/lib/soroban"
import { cn } from "@/lib/utils"

/**
 * 問題の表示。かけ算・わり算は横書き、見取算は検定の用紙と同じく
 * 縦にならべて右そろえにする。
 */
export function ProblemView({
  problem,
  size = "lg",
}: {
  problem: Problem
  size?: "lg" | "sm"
}) {
  if (problem.kind === "mitori") {
    return (
      <table
        className={cn(
          "font-bold tabular-nums",
          size === "sm"
            ? "text-sm leading-tight"
            : // 4級の10口でもテンキーと一緒に画面に収まるよう少し小さくする
              problem.rows.length > 7
              ? "text-xl leading-tight"
              : "text-2xl leading-snug"
        )}
      >
        <tbody>
          {problem.rows.map((value, i) => (
            <tr key={i}>
              <td
                className={cn(
                  "pr-2 text-right",
                  value < 0 ? "text-rose-500" : "text-transparent"
                )}
                aria-label={value < 0 ? "ひく" : undefined}
              >
                −
              </td>
              <td
                className={cn(
                  "text-right",
                  value < 0 && "text-rose-600 dark:text-rose-300"
                )}
              >
                {formatNumber(Math.abs(value))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="border-foreground/60 border-t-2" />
          </tr>
        </tfoot>
      </table>
    )
  }

  const sign = problem.kind === "mul" ? "×" : "÷"
  return (
    <div
      className={cn(
        "font-black tabular-nums",
        size === "lg" ? "py-3 text-4xl sm:text-5xl" : "text-base"
      )}
    >
      {formatNumber(problem.a)} {sign} {formatNumber(problem.b)} =
    </div>
  )
}
