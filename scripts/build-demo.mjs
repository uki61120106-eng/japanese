/**
 * アプリを1枚の HTML ファイルに束ねる（共有用デモ）。
 *   node scripts/build-demo.mjs               # すべてのアプリ
 *   node scripts/build-demo.mjs english       # えいかいわフラッシュだけ
 *   node scripts/build-demo.mjs english out.html
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

/** 背景は body ではなく #root に当てる（レイアウトを持ち込まないため） */
const APPS = {
  kana: {
    entry: "scripts/demo-entry-kana.tsx",
    title: "かなフラッシュ",
    out: "dist-demo/kana.html",
    background:
      "bg-linear-to-b from-rose-50 via-amber-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
  },
  english: {
    entry: "scripts/demo-entry-english.tsx",
    title: "えいかいわフラッシュ",
    out: "dist-demo/english.html",
    background:
      "bg-linear-to-b from-sky-50 via-indigo-50 to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
  },
}

const [appArg, outArg] = process.argv.slice(2)

if (appArg && !(appArg in APPS)) {
  console.error(
    `不明なアプリ: ${appArg}（指定できるのは ${Object.keys(APPS).join(" / ")}）`
  )
  process.exit(1)
}

const targets = appArg ? [appArg] : Object.keys(APPS)

if (outArg && targets.length > 1) {
  console.error("出力先を指定するときは、アプリ名もあわせて指定してください")
  process.exit(1)
}

const tmp = join(root, "node_modules/.cache/demo-build")
rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })

// CSS: Tailwind に src/ を走査させて必要なクラスだけを書き出す。
// 走査対象はアプリ共通なので、一度だけ生成して使い回す。
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
const css = themeAware(readFileSync(cssPath, "utf8"))

for (const name of targets) {
  const app = APPS[name]
  const outFile = resolve(root, outArg ?? app.out)

  // JS: React ごと1ファイルにまとめる
  const bundle = await esbuild.build({
    entryPoints: [join(root, app.entry)],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    jsx: "automatic",
    tsconfig: join(root, "tsconfig.json"),
    define: { "process.env.NODE_ENV": '"production"' },
    write: false,
  })
  const js = bundle.outputFiles[0].text

  // 表示に使う文字だけフォントを埋め込む。取れなければ CDN 参照にする。
  const fontFaces = inlineFontFaces(css + js)
  const fontHead = fontFaces
    ? `<style>${fontFaces}</style>`
    : `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap">`

  const html = `<title>${app.title}</title>
${fontHead}
<style>${css}</style>
<div id="root" class="min-h-dvh ${app.background} antialiased"></div>
<script>${js}</script>
`

  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html)

  console.log(
    `${outFile} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB, ` +
      `フォント: ${fontFaces ? "埋め込み" : "CDN参照"})`
  )
}

rmSync(tmp, { recursive: true, force: true })

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
