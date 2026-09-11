/**
 * アプリを1枚の HTML ファイルに束ねる（共有用デモ）。
 *   node scripts/build-demo.mjs [出力先]
 *
 * Next.js の静的書き出しは完全な HTML 文書と複数ファイルになるため、
 * 「HTML を1枚渡せば動く」形が必要な場面ではこちらを使う。
 */
import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import * as esbuild from "esbuild"

import { inlineFontFaces } from "./inline-font.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outFile = resolve(root, process.argv[2] ?? "dist-demo/index.html")
const tmp = join(root, "node_modules/.cache/demo-build")

rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })

// CSS: Tailwind に src/ を走査させて必要なクラスだけを書き出す
const cssPath = join(tmp, "app.css")
execFileSync(
  "npx",
  [
    "@tailwindcss/cli",
    "--input",
    join(root, "src/app/globals.css"),
    "--output",
    cssPath,
    "--minify",
  ],
  { cwd: root, stdio: "inherit" }
)

// JS: React ごと1ファイルにまとめる
const bundle = await esbuild.build({
  entryPoints: [join(root, "scripts/demo-entry.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  tsconfig: join(root, "tsconfig.json"),
  define: { "process.env.NODE_ENV": '"production"' },
  write: false,
})

const css = themeAware(readFileSync(cssPath, "utf8"))
const js = bundle.outputFiles[0].text

/**
 * 配信先によっては OS の設定ではなく data-theme 属性で明暗が指定される。
 * prefers-color-scheme 用に生成された上書きを、その属性にも効くよう複製する。
 */
function themeAware(source) {
  const match = source.match(
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([^}]*)\}\s*\}/
  )
  if (!match) {
    throw new Error("ダークモードの上書きが見つかりませんでした")
  }
  const darkTokens = match[1]
  return (
    source.replace(
      match[0],
      `@media (prefers-color-scheme:dark){:root:not([data-theme=light]){${darkTokens}}}`
    ) + `:root[data-theme=dark]{${darkTokens}}`
  )
}

// 表示に使う文字だけフォントを埋め込む。取れなければ CDN 参照にする。
const fontFaces = inlineFontFaces(css + js)
const fontHead = fontFaces
  ? `<style>${fontFaces}</style>`
  : `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap">`

const html = `<title>かなフラッシュ</title>
${fontHead}
<style>${css}</style>
<div id="root" class="min-h-dvh bg-linear-to-b from-rose-50 via-amber-50 to-sky-50 antialiased dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
<script>${js}</script>
`

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, html)
rmSync(tmp, { recursive: true, force: true })

console.log(
  `${outFile} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB, ` +
    `フォント: ${fontFaces ? "埋め込み" : "CDN参照"})`
)
