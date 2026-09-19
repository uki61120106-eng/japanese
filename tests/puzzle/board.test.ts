import assert from "node:assert/strict"
import { test } from "node:test"

import {
  boardFromPattern,
  clearAndFall,
  findMatches,
  isAdjacent,
  resolveBoard,
  swapCells,
} from "@/lib/puzzle/board"
import type { Match } from "@/lib/puzzle/types"

/** 補充されるドロップを固定するための乱数。0.99 は回復（ELEMENTS の最後）。 */
const alwaysHeart = () => 0.99

/** 補充を再現できるようにした線形合同法の乱数。 */
function makeRng(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function elements(matches: Match[]): string[] {
  return matches.map((match) => match.element).sort()
}

test("横に3つ並ぶと1コンボになる", () => {
  const board = boardFromPattern([
    "fffwgl",
    "wgldhw",
    "ghwlgd",
    "lwghdl",
    "dglwhg",
  ])
  const matches = findMatches(board)
  assert.equal(matches.length, 1)
  assert.equal(matches[0].element, "fire")
  assert.equal(matches[0].cells.length, 3)
})

test("縦に3つ並ぶと1コンボになる", () => {
  const board = boardFromPattern([
    "wgldhw",
    "wghldg",
    "wlghdl",
    "ghwlgd",
    "dglwhg",
  ])
  const matches = findMatches(board)
  assert.equal(matches.length, 1)
  assert.equal(matches[0].element, "water")
  assert.equal(matches[0].cells.length, 3)
})

test("2つ以下では消えない", () => {
  const board = boardFromPattern([
    "ffwgld",
    "wgldhw",
    "ghwlgd",
    "lwghdl",
    "dglwhg",
  ])
  assert.deepEqual(findMatches(board), [])
})

test("L字は5個で1コンボとして数える", () => {
  const board = boardFromPattern([
    "fffwgl",
    "fwglhw",
    "fghlgd",
    "lwghdl",
    "dglwhg",
  ])
  const matches = findMatches(board)
  assert.equal(matches.length, 1)
  assert.equal(matches[0].cells.length, 5)
})

test("離れた同じ色は別のコンボになる", () => {
  const board = boardFromPattern([
    "fffwgl",
    "wglghw",
    "ghwlgd",
    "lwghdl",
    "wwwlhg",
  ])
  const matches = findMatches(board)
  assert.equal(matches.length, 2)
  assert.deepEqual(elements(matches), ["fire", "water"])
})

test("異なる色が同時に揃えばコンボが増える", () => {
  const board = boardFromPattern([
    "fffggg",
    "wglghw",
    "ghwlgw",
    "lwghdl",
    "dglwhg",
  ])
  const matches = findMatches(board)
  assert.equal(matches.length, 2)
  assert.deepEqual(elements(matches), ["fire", "wood"])
})

test("消えたマスは上から詰められ、空いた分だけ補充される", () => {
  const board = boardFromPattern([
    "wgldhw",
    "ghwlgd",
    "fffwgl",
    "lwghdl",
    "dglwhg",
  ])
  const matches = findMatches(board)
  const next = clearAndFall(board, matches, alwaysHeart)

  // 消えた1マスのぶんだけ、その列の上側が1つずつ下がる
  assert.equal(next[2][0].element, "wood") // もとの [1][0]
  assert.equal(next[1][0].element, "water") // もとの [0][0]
  assert.equal(next[0][0].element, "heart") // 補充
  // 消えていない列と、消えたマスより下はそのまま
  assert.equal(next[2][3].element, board[2][3].element)
  assert.equal(next[4][0].element, board[4][0].element)
})

test("落ちてきたドロップが揃うと連鎖になる", () => {
  const board = boardFromPattern([
    "wgldhw",
    "ghwlgd",
    "fffwgl",
    "lwghdl",
    "dglwhg",
  ])
  // 補充がすべて回復になるので、左3列の最上段に回復が3つ並ぶ
  const next = clearAndFall(board, findMatches(board), alwaysHeart)
  const chained = findMatches(next)

  assert.equal(chained.length, 1)
  assert.equal(chained[0].element, "heart")
  assert.equal(chained[0].cells.length, 3)
})

test("解決は揃いがなくなるまで続き、コンボを数え上げる", () => {
  const rng = makeRng(20260919)
  const board = boardFromPattern([
    "fffggg",
    "wglghw",
    "ghwlgw",
    "lwghdl",
    "dglwhg",
  ])
  const result = resolveBoard(board, rng)

  assert.equal(result.steps[0].matches.length, 2)
  assert.equal(
    result.combo,
    result.steps.reduce((sum, step) => sum + step.matches.length, 0)
  )
  assert.deepEqual(findMatches(result.board), [], "解決後に揃いが残っている")
})

test("入れ替えは元の盤面を壊さない", () => {
  const board = boardFromPattern([
    "fwgldh",
    "wgldhf",
    "gldhfw",
    "ldhfwg",
    "dhfwgl",
  ])
  const next = swapCells(board, { row: 0, col: 0 }, { row: 0, col: 1 })
  assert.equal(next[0][0].element, "water")
  assert.equal(next[0][1].element, "fire")
  assert.equal(board[0][0].element, "fire")
})

test("隣接判定は上下左右のみ", () => {
  assert.equal(isAdjacent({ row: 1, col: 1 }, { row: 1, col: 2 }), true)
  assert.equal(isAdjacent({ row: 1, col: 1 }, { row: 2, col: 1 }), true)
  assert.equal(isAdjacent({ row: 1, col: 1 }, { row: 2, col: 2 }), false)
  assert.equal(isAdjacent({ row: 1, col: 1 }, { row: 1, col: 1 }), false)
})
