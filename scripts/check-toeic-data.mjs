/**
 * TOEIC パートの問題データを検算する。
 *   node scripts/check-toeic-data.mjs
 *
 * 問題は手書きなので、id の重複・空所の数・選択肢の重複・正解番号の範囲など、
 * 目視では見落としやすい取り違えを機械的に止める。
 */
import { mkdirSync, rmSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import * as esbuild from "esbuild"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const tmp = join(root, "node_modules/.cache/toeic-check")

rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })

const bundlePath = join(tmp, "data.mjs")
await esbuild.build({
  entryPoints: [join(root, "scripts/toeic-data-entry.ts")],
  outfile: bundlePath,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  tsconfig: join(root, "tsconfig.json"),
})

const { BLANK, PART5_CATEGORIES, PART5_QUESTIONS, PART7_PASSAGES } =
  await import(bundlePath)

const problems = []
const fail = (where, message) => problems.push(`${where}: ${message}`)

function checkChoices(where, choices, answer) {
  if (!Array.isArray(choices) || choices.length !== 4) {
    fail(where, `選択肢が4つではない（${choices?.length}）`)
    return
  }
  if (choices.some((choice) => typeof choice !== "string" || !choice.trim())) {
    fail(where, "空の選択肢がある")
  }
  if (new Set(choices).size !== choices.length) {
    fail(where, "同じ選択肢が重複している")
  }
  if (!Number.isInteger(answer) || answer < 0 || answer > 3) {
    fail(where, `正解番号が範囲外（${answer}）`)
  }
}

// ---- Part 5 ----------------------------------------------------------
const categoryIds = new Set(PART5_CATEGORIES.map((category) => category.id))
const seenPart5 = new Set()
const answerByCategory = new Map()

for (const question of PART5_QUESTIONS) {
  const where = `Part5 ${question.id}`

  if (seenPart5.has(question.id)) fail(where, "id が重複している")
  seenPart5.add(question.id)

  if (!categoryIds.has(question.category)) {
    fail(where, `未定義のカテゴリ（${question.category}）`)
  }

  const blanks = question.sentence.split(BLANK).length - 1
  if (blanks !== 1) fail(where, `空所が ${blanks} 個ある（1個であること）`)

  checkChoices(where, question.choices, question.answer)

  if (!question.explanation.trim()) fail(where, "解説が空")
  if (!question.translation.trim()) fail(where, "和訳が空")

  const counts = answerByCategory.get(question.category) ?? [0, 0, 0, 0]
  counts[question.answer] += 1
  answerByCategory.set(question.category, counts)
}

for (const id of categoryIds) {
  if (!answerByCategory.has(id)) fail(`カテゴリ ${id}`, "問題が1問もない")
}

// ---- Part 7 ----------------------------------------------------------
const seenPassages = new Set()
const seenPart7 = new Set()
let part7QuestionCount = 0

for (const passage of PART7_PASSAGES) {
  const where = `Part7 ${passage.id}`

  if (seenPassages.has(passage.id)) fail(where, "文書 id が重複している")
  seenPassages.add(passage.id)

  if (!passage.body.trim()) fail(where, "本文が空")
  if (!passage.translation.trim()) fail(where, "本文の和訳が空")
  if (passage.questions.length < 2 || passage.questions.length > 5) {
    fail(where, `設問数が ${passage.questions.length}（2〜5問であること）`)
  }

  for (const question of passage.questions) {
    const qWhere = `${where} / ${question.id}`
    part7QuestionCount += 1

    if (seenPart7.has(question.id)) fail(qWhere, "設問 id が重複している")
    seenPart7.add(question.id)

    if (!question.question.trim()) fail(qWhere, "設問文が空")
    checkChoices(qWhere, question.choices, question.answer)
    if (!question.explanation.trim()) fail(qWhere, "解説が空")
  }
}

// ---- 結果 ------------------------------------------------------------
rmSync(tmp, { recursive: true, force: true })

console.log(`Part 5: ${PART5_QUESTIONS.length} 問 / ${categoryIds.size} カテゴリ`)
for (const [category, counts] of [...answerByCategory].sort()) {
  const total = counts.reduce((sum, value) => sum + value, 0)
  console.log(`  ${category.padEnd(12)} ${total} 問  正解の位置 A/B/C/D = ${counts.join("/")}`)
}
console.log(`Part 7: ${PART7_PASSAGES.length} 文書 / ${part7QuestionCount} 問`)

if (problems.length > 0) {
  console.error(`\n問題が ${problems.length} 件見つかりました:`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log("\nデータに問題は見つかりませんでした。")
