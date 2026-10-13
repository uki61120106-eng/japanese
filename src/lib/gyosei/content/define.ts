import type { Statement, SubjectId } from "@/lib/gyosei/types"

/** [正誤, 記述, 解説] */
export type Row = [boolean, string, string]

/**
 * 単元ごとの行から Statement を作る。id は「科目.単元.(セット記号)通し番号」。
 * 学習記録が id に紐づくため、問題は末尾に追加し、途中への挿入や削除はしないこと
 * （誤りを直すときは文言だけを書き換える）。
 */
export function defineStatements(
  subject: SubjectId,
  topics: Record<string, Row[]>,
  /** 追加セットの記号。別ファイルで足した問題の id が既存と衝突しないようにする */
  set = ""
): Statement[] {
  return Object.entries(topics).flatMap(([topic, rows]) =>
    rows.map(([answer, text, explanation], index) => ({
      id: `${subject}.${topic}.${set}${index + 1}`,
      subject,
      topic,
      text,
      answer,
      explanation,
    }))
  )
}
