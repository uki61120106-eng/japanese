/**
 * 聞き取り結果とお手本を比べて、どこまで言えたかを判定する。
 *
 * 音声認識は句読点や大文字小文字が安定しないので、単語の並びだけを見る。
 * 発音の良し悪しではなく「意図した文を言えたか」の判定であることに注意。
 */

export type Judgement = "perfect" | "close" | "retry"

/** 数字で書き起こされたときに、つづりへそろえる（"2 people" → "two people"） */
const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
]

/**
 * 短縮形のゆれを一方へそろえる。
 * 音声認識は "I'm" を "I am" と書き起こすことがあり、そのままでは不一致になる。
 */
const CONTRACTIONS: [RegExp, string][] = [
  [/\bi am\b/g, "im"],
  [/\bi will\b/g, "ill"],
  [/\bi have\b/g, "ive"],
  [/\bi would\b/g, "id"],
  [/\bit is\b/g, "its"],
  [/\byou are\b/g, "youre"],
  [/\bthat is\b/g, "thats"],
  [/\bcannot\b/g, "cant"],
  [/\bcan not\b/g, "cant"],
  [/\bdo not\b/g, "dont"],
  [/\bdoes not\b/g, "doesnt"],
  [/\blet us\b/g, "lets"],
]

/**
 * 比較用に正規化する。小文字化し、記号とアポストロフィを落としたうえで、
 * 書き起こしのゆれ（数字表記・短縮形）をそろえる。
 */
export function normalize(text: string): string {
  let result = text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/'/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\d+\b/g, (digits) => NUMBER_WORDS[Number(digits)] ?? digits)

  for (const [pattern, replacement] of CONTRACTIONS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

export function toWords(text: string): string[] {
  const normalized = normalize(text)
  return normalized === "" ? [] : normalized.split(" ")
}

/**
 * 最長共通部分列。お手本のどの単語が聞き取れたかを返す。
 * 語順を保った一致だけを数えるので、並べ替えは一致とみなさない。
 */
function matchedFlags(expected: string[], heard: string[]): boolean[] {
  const rows = expected.length
  const cols = heard.length
  const table: number[][] = Array.from({ length: rows + 1 }, () =>
    new Array<number>(cols + 1).fill(0)
  )

  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      table[i][j] =
        expected[i - 1] === heard[j - 1]
          ? table[i - 1][j - 1] + 1
          : Math.max(table[i - 1][j], table[i][j - 1])
    }
  }

  const flags = new Array<boolean>(rows).fill(false)
  let i = rows
  let j = cols
  while (i > 0 && j > 0) {
    if (expected[i - 1] === heard[j - 1]) {
      flags[i - 1] = true
      i--
      j--
    } else if (table[i - 1][j] >= table[i][j - 1]) {
      i--
    } else {
      j--
    }
  }
  return flags
}

/**
 * 画面に出す用の単語。正規化すると綴りが変わる（"I'm" → "im"）ので、
 * 元の表記から前後の記号だけを落としたものを使う。
 */
function displayWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, ""))
    .filter((word) => word !== "")
}

export type PronunciationResult = {
  judgement: Judgement
  /** 0〜100。お手本の単語のうち、順番どおりに言えた割合 */
  score: number
  /** お手本の単語（元の表記）と、それぞれ言えたかどうか */
  expected: { word: string; matched: boolean }[]
  /** 聞き取られた文そのまま */
  heard: string
}

export function evaluate(
  expectedText: string,
  heardText: string
): PronunciationResult {
  const expected = toWords(expectedText)
  const heard = toWords(heardText)
  const flags = matchedFlags(expected, heard)
  const hits = flags.filter(Boolean).length

  // 余計な単語が多いときに満点にならないよう、長いほうを分母にする
  const ratio =
    expected.length === 0 ? 0 : hits / Math.max(expected.length, heard.length)
  const score = Math.round(ratio * 100)

  // 単語数がそろっているときだけ元の表記を使い、ずれたら正規化後の語で表示する
  const display = displayWords(expectedText)
  const labels = display.length === expected.length ? display : expected

  return {
    judgement: score === 100 ? "perfect" : score >= 60 ? "close" : "retry",
    score,
    expected: labels.map((word, i) => ({ word, matched: flags[i] })),
    heard: heardText.trim(),
  }
}
