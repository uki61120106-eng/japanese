/**
 * tests/ 以下の *.test.ts を実行する。
 *   node scripts/run-tests.mjs
 *
 * Node 単体では tsconfig の "@/..." を解決できないため、
 * esbuild で1ファイルに束ねてから node --test に渡している。
 */
import { execFileSync } from "node:child_process"
import { mkdirSync, readdirSync, rmSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import * as esbuild from "esbuild"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const testsDir = join(root, "tests")
const outDir = join(root, "node_modules/.cache/tests")

function collect(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return collect(path)
    return entry.name.endsWith(".test.ts") ? [path] : []
  })
}

const entryPoints = collect(testsDir)
if (entryPoints.length === 0) {
  console.error("テストが見つかりません")
  process.exit(1)
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

await esbuild.build({
  entryPoints,
  outdir: outDir,
  outbase: testsDir,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  sourcemap: "inline",
  tsconfig: join(root, "tsconfig.json"),
  outExtension: { ".js": ".mjs" },
})

const compiled = entryPoints.map((entry) =>
  join(outDir, relative(testsDir, entry).replace(/\.ts$/, ".mjs"))
)

try {
  execFileSync("node", ["--test", ...compiled], { cwd: root, stdio: "inherit" })
} catch {
  process.exitCode = 1
}
