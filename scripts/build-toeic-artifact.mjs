/**
 * TOEIC トレーナーを1枚の HTML ファイルに束ねる。
 *   node scripts/build-toeic-artifact.mjs [出力先]
 *
 * 出力はアーティファクトとして公開できる形（doctype・html・head・body を
 * 持たない断片）にそろえてある。scripts/build-demo.mjs のかなフラッシュ版と
 * 同じ作りで、束ねる対象だけが違う。
 */
import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import * as esbuild from "esbuild"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outFile = resolve(root, process.argv[2] ?? "dist-artifact/toeic.html")
const tmp = join(root, "node_modules/.cache/toeic-artifact")

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
  entryPoints: [join(root, "scripts/toeic-artifact-entry.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  tsconfig: join(root, "tsconfig.json"),
  // next/link は Next のランタイムを引き込むので素の <a> に差し替える
  alias: { "next/link": join(root, "scripts/next-link-shim.tsx") },
  define: {
    "process.env.NODE_ENV": '"production"',
    // 他ページへの導線を落とす（1枚 HTML にはこのページしか入らない）
    "process.env.NEXT_PUBLIC_SINGLE_FILE_DEMO": '"1"',
  },
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

// 和訳や解説で日本語の分量が多く、字形を埋め込むとファイルが重くなる。
// フォントは配信元から読み込ませ、取れない環境では端末内蔵の書体に落とす。
const fontHead = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap">`

const html = `<title>TOEIC トレーナー</title>
${fontHead}
<style>${css}</style>
<div id="root" class="min-h-dvh bg-linear-to-b from-slate-50 via-indigo-50/50 to-slate-100 antialiased dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
<script>${js}</script>
`

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, html)
rmSync(tmp, { recursive: true, force: true })

console.log(`${outFile} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`)
