/**
 * Google Fonts の CSS から、実際に表示する文字を含むスライスだけを取り出し、
 * woff2 を data URI として埋め込んだ @font-face を組み立てる。
 *
 * 日本語のウェブフォントは unicode-range で数百のスライスに分かれている。
 * デモで使う文字は決まっているので、その分だけ取り込めば1枚の HTML で完結する。
 */
import { execFileSync } from "node:child_process"

export const MPLUS_ROUNDED_CSS_URL =
  "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap"

export const NOTO_SANS_KR_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"

// woff2 を返してもらうために、対応ブラウザとして問い合わせる
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

function fetchText(url) {
  return execFileSync(
    "curl",
    ["-sS", "--fail", "--max-time", "60", "-H", `User-Agent: ${UA}`, url],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  )
}

function fetchBase64(url) {
  return execFileSync(
    "curl",
    ["-sS", "--fail", "--max-time", "60", "-H", `User-Agent: ${UA}`, url],
    { encoding: "base64", maxBuffer: 64 * 1024 * 1024 }
  ).replace(/\s/g, "")
}

/** "U+3042-3096, U+30A0" → [[0x3042, 0x3096], [0x30a0, 0x30a0]] */
function parseRanges(value) {
  return value.split(",").map((part) => {
    const [from, to] = part.trim().replace(/^U\+/i, "").split("-")
    return [parseInt(from, 16), parseInt(to ?? from, 16)]
  })
}

function covers(ranges, codePoints) {
  return ranges.some(([from, to]) =>
    codePoints.some((code) => code >= from && code <= to)
  )
}

/**
 * text に出てくる文字を表示するのに必要な @font-face だけを返す。
 * 複数のファミリー（日本語＋ハングルなど）をまとめて渡せる。
 * ひとつでも取得に失敗した場合は null を返し、呼び出し側で CDN 参照に切り替える。
 */
export function inlineFontFaces(text, cssUrls = [MPLUS_ROUNDED_CSS_URL]) {
  const codePoints = [...new Set([...text].map((char) => char.codePointAt(0)))]
  const kept = []

  for (const cssUrl of cssUrls) {
    let css
    try {
      css = fetchText(cssUrl)
    } catch {
      return null
    }

    const blocks = css.match(/@font-face\s*\{[^}]*\}/g) ?? []

    for (const block of blocks) {
      const range = block.match(/unicode-range:\s*([^;]+);/)
      const url = block.match(/url\((https:[^)]+\.woff2)\)/)
      if (!range || !url) continue
      if (!covers(parseRanges(range[1]), codePoints)) continue

      kept.push(
        block.replace(
          url[0],
          `url(data:font/woff2;base64,${fetchBase64(url[1])})`
        )
      )
    }
  }

  return kept.length > 0 ? kept.join("") : null
}
