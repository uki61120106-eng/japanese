/**
 * 社労士アプリの問題データを検査する。問題を追加・修正したら実行する。
 *   npm run check:questions
 *
 * - ID の重複・書式（科目ID-連番）
 * - 空の項目、問題文の末尾が「。」で終わっているか
 * - 模試を作れる量があるか（科目区分ごとに誤り2つ以上・正しい記述8つ以上）
 */
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import * as esbuild from "esbuild"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const bundle = await esbuild.build({
  stdin: {
    contents: `
      export { QUESTIONS } from "@/lib/sharoushi/questions"
      export { EXAM_GROUPS, SUBJECTS } from "@/lib/sharoushi/subjects"
      export { MOCK_PER_GROUP } from "@/lib/sharoushi/mock"
    `,
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  tsconfig: join(root, "tsconfig.json"),
  write: false,
})
const { QUESTIONS, EXAM_GROUPS, SUBJECTS, MOCK_PER_GROUP } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`
)

const errors = []
const seen = new Set()
for (const q of QUESTIONS) {
  if (seen.has(q.id)) errors.push(`ID が重複: ${q.id}`)
  seen.add(q.id)
  if (!new RegExp(`^${q.subject}-\\d{2,}$`).test(q.id)) {
    errors.push(`ID の書式が科目と合わない: ${q.id}`)
  }
  for (const key of ["statement", "explanation", "basis"]) {
    if (!q[key]?.trim()) errors.push(`${q.id}: ${key} が空`)
  }
  if (!q.statement.endsWith("。")) errors.push(`${q.id}: 問題文が「。」で終わっていない`)
}

console.log("科目ごとの問題数（正しい / 誤り）")
for (const s of SUBJECTS) {
  const rows = QUESTIONS.filter((q) => q.subject === s.id)
  const t = rows.filter((q) => q.answer).length
  console.log(`  ${s.name.padEnd(14, "　")} ${String(rows.length).padStart(3)}問（${t} / ${rows.length - t}）`)
}
console.log(`  合計 ${QUESTIONS.length}問`)

// 模試は区分をまたいで同じ記述を使わないので、徴収法のように2区分で共有する科目は少なめに見積もる
for (const group of EXAM_GROUPS) {
  const pool = QUESTIONS.filter((q) => group.subjects.includes(q.subject))
  const falses = pool.filter((q) => !q.answer).length
  const trues = pool.filter((q) => q.answer).length
  if (falses < MOCK_PER_GROUP || trues < MOCK_PER_GROUP * 4) {
    errors.push(
      `模試の問題を作れない: ${group.name}（誤り ${falses} / 正しい ${trues}、必要数は誤り ${MOCK_PER_GROUP}・正しい ${MOCK_PER_GROUP * 4}）`
    )
  }
}

if (errors.length) {
  console.error(`\n${errors.length}件の問題があります`)
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}
console.log("\nOK")
