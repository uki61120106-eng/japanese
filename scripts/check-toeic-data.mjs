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

const {
  BLANK,
  PART5_CATEGORIES,
  PART5_QUESTIONS,
  PART5_ADVANCED,
  PART7_SETS,
  PART7_ADVANCED,
  PHRASE_CATEGORIES,
  PHRASE_CARDS,
} = await import(bundlePath)

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

const LEVELS = new Set(["core", "advanced"])
const seenIds = new Set()

function checkId(where, id) {
  if (typeof id !== "string" || !id.trim()) {
    fail(where, "id が空")
    return
  }
  // 学習ログは id をキーにするので、コンテンツ全体で重複してはいけない
  if (seenIds.has(id)) fail(where, "id が全体で重複している")
  seenIds.add(id)
}

// ---- Part 5 ----------------------------------------------------------
const categoryIds = new Set(PART5_CATEGORIES.map((category) => category.id))
const part5 = [...PART5_QUESTIONS, ...PART5_ADVANCED]
const answerByGroup = new Map()

for (const question of part5) {
  const where = `Part5 ${question.id}`
  checkId(where, question.id)

  if (!categoryIds.has(question.category)) {
    fail(where, `未定義のカテゴリ（${question.category}）`)
  }
  if (!LEVELS.has(question.level)) {
    fail(where, `未定義の難易度（${question.level}）`)
  }

  const blanks = question.sentence.split(BLANK).length - 1
  if (blanks !== 1) fail(where, `空所が ${blanks} 個ある（1個であること）`)

  checkChoices(where, question.choices, question.answer)

  if (!question.explanation.trim()) fail(where, "解説が空")
  if (!question.translation.trim()) fail(where, "和訳が空")

  const key = `${question.level}/${question.category}`
  const counts = answerByGroup.get(key) ?? [0, 0, 0, 0]
  counts[question.answer] += 1
  answerByGroup.set(key, counts)
}

for (const id of categoryIds) {
  if (!answerByGroup.has(`core/${id}`)) fail(`カテゴリ ${id}`, "基礎の問題がない")
}

// ---- Part 7 ----------------------------------------------------------
const part7 = [...PART7_SETS, ...PART7_ADVANCED]
const part7Answers = [0, 0, 0, 0]
let part7QuestionCount = 0
let multiDocumentSets = 0

for (const set of part7) {
  const where = `Part7 ${set.id}`
  checkId(where, set.id)

  if (!LEVELS.has(set.level)) fail(where, `未定義の難易度（${set.level}）`)
  if (!Array.isArray(set.documents) || set.documents.length === 0) {
    fail(where, "文書が1通もない")
    continue
  }
  if (set.documents.length > 1) multiDocumentSets += 1

  for (const [index, document] of set.documents.entries()) {
    const dWhere = `${where} / 文書${index + 1}`
    if (!document.title.trim()) fail(dWhere, "見出しが空")
    if (!document.body.trim()) fail(dWhere, "本文が空")
    if (!document.translation.trim()) fail(dWhere, "本文の和訳が空")
  }

  if (set.questions.length < 2 || set.questions.length > 5) {
    fail(where, `設問数が ${set.questions.length}（2〜5問であること）`)
  }

  for (const question of set.questions) {
    const qWhere = `${where} / ${question.id}`
    part7QuestionCount += 1
    checkId(qWhere, question.id)

    if (!question.question.trim()) fail(qWhere, "設問文が空")
    checkChoices(qWhere, question.choices, question.answer)
    if (!question.explanation.trim()) fail(qWhere, "解説が空")
    part7Answers[question.answer] += 1
  }
}

// ---- フレーズカード ---------------------------------------------------
const phraseCategoryIds = new Set(
  PHRASE_CATEGORIES.map((category) => category.id)
)
const phraseByCategory = new Map()
const seenPhrases = new Set()

for (const card of PHRASE_CARDS) {
  const where = `フレーズ ${card.id}`
  checkId(where, card.id)

  if (!phraseCategoryIds.has(card.category)) {
    fail(where, `未定義の分類（${card.category}）`)
  }

  const key = card.phrase.trim().toLowerCase()
  if (seenPhrases.has(key)) fail(where, `同じフレーズが重複している（${card.phrase}）`)
  seenPhrases.add(key)

  if (!card.phrase.trim()) fail(where, "フレーズが空")
  if (!card.meaning.trim()) fail(where, "意味が空")
  if (!card.example.trim()) fail(where, "例文が空")
  if (!card.exampleTranslation.trim()) fail(where, "例文の和訳が空")

  phraseByCategory.set(
    card.category,
    (phraseByCategory.get(card.category) ?? 0) + 1
  )
}

for (const id of phraseCategoryIds) {
  if (!phraseByCategory.has(id)) fail(`フレーズ分類 ${id}`, "カードが1枚もない")
}

// ---- 結果 ------------------------------------------------------------
rmSync(tmp, { recursive: true, force: true })

console.log(`Part 5: ${part5.length} 問`)
for (const [key, counts] of [...answerByGroup].sort()) {
  const total = counts.reduce((sum, value) => sum + value, 0)
  console.log(
    `  ${key.padEnd(22)} ${String(total).padStart(3)} 問  正解の位置 A/B/C/D = ${counts.join("/")}`
  )
}
console.log(
  `Part 7: ${part7.length} セット / ${part7QuestionCount} 問（うち複数文書 ${multiDocumentSets} セット）`
)
console.log(`  正解の位置 A/B/C/D = ${part7Answers.join("/")}`)
console.log(`フレーズ: ${PHRASE_CARDS.length} 枚`)
for (const [category, count] of [...phraseByCategory].sort()) {
  console.log(`  ${category.padEnd(14)} ${String(count).padStart(3)} 枚`)
}

if (problems.length > 0) {
  console.error(`\n問題が ${problems.length} 件見つかりました:`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log("\nデータに問題は見つかりませんでした。")
