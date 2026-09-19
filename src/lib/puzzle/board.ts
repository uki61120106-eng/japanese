import {
  ELEMENTS,
  type Board,
  type Cell,
  type Element,
  type Match,
  type Orb,
} from "@/lib/puzzle/types"

export const ROWS = 5
export const COLS = 6

/** 乱数。テストから差し替えられるように引数で受け取る。 */
export type Rng = () => number

let orbSeq = 0

export function createOrb(element: Element): Orb {
  orbSeq += 1
  return { id: `orb-${orbSeq}`, element }
}

function randomElement(rng: Rng): Element {
  return ELEMENTS[Math.floor(rng() * ELEMENTS.length)]
}

export function createBoard(rng: Rng = Math.random): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => createOrb(randomElement(rng)))
  )
}

/** テストや固定配置用。1文字が1ドロップ（f 火 / w 水 / g 木 / l 光 / d 闇 / h 回復）。 */
export function boardFromPattern(rows: string[]): Board {
  const map: Record<string, Element> = {
    f: "fire",
    w: "water",
    g: "wood",
    l: "light",
    d: "dark",
    h: "heart",
  }
  return rows.map((row) =>
    [...row].map((char) => {
      const element = map[char]
      if (!element) {
        throw new Error(`未知のドロップ記号: ${char}`)
      }
      return createOrb(element)
    })
  )
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row])
}

/** a と b を入れ替えた新しい盤面を返す。 */
export function swapCells(board: Board, a: Cell, b: Cell): Board {
  const next = cloneBoard(board)
  const tmp = next[a.row][a.col]
  next[a.row][a.col] = next[b.row][b.col]
  next[b.row][b.col] = tmp
  return next
}

export function isAdjacent(a: Cell, b: Cell): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1
}

/**
 * 縦横に3つ以上並んだマスを探し、同色で隣接するものを1コンボにまとめて返す。
 * L字や十字は 1 コンボとして数える（パズル＆ドラゴンズ系の一般的な数え方）。
 */
export function findMatches(board: Board): Match[] {
  const marked = board.map((row) => row.map(() => false))

  // 横方向
  for (let row = 0; row < board.length; row++) {
    let run = 1
    for (let col = 1; col <= board[row].length; col++) {
      const same =
        col < board[row].length &&
        board[row][col].element === board[row][col - 1].element
      if (same) {
        run += 1
        continue
      }
      if (run >= 3) {
        for (let back = col - run; back < col; back++) {
          marked[row][back] = true
        }
      }
      run = 1
    }
  }

  // 縦方向
  for (let col = 0; col < COLS; col++) {
    let run = 1
    for (let row = 1; row <= board.length; row++) {
      const same =
        row < board.length &&
        board[row][col].element === board[row - 1][col].element
      if (same) {
        run += 1
        continue
      }
      if (run >= 3) {
        for (let back = row - run; back < row; back++) {
          marked[back][col] = true
        }
      }
      run = 1
    }
  }

  // マークされたマスを同色の連結成分に分ける
  const seen = board.map((row) => row.map(() => false))
  const matches: Match[] = []

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (!marked[row][col] || seen[row][col]) continue

      const element = board[row][col].element
      const cells: Cell[] = []
      const stack: Cell[] = [{ row, col }]
      seen[row][col] = true

      while (stack.length > 0) {
        const cell = stack.pop() as Cell
        cells.push(cell)
        const neighbors: Cell[] = [
          { row: cell.row - 1, col: cell.col },
          { row: cell.row + 1, col: cell.col },
          { row: cell.row, col: cell.col - 1 },
          { row: cell.row, col: cell.col + 1 },
        ]
        for (const next of neighbors) {
          if (
            next.row < 0 ||
            next.row >= board.length ||
            next.col < 0 ||
            next.col >= board[next.row].length
          ) {
            continue
          }
          if (seen[next.row][next.col]) continue
          if (!marked[next.row][next.col]) continue
          if (board[next.row][next.col].element !== element) continue
          seen[next.row][next.col] = true
          stack.push(next)
        }
      }

      matches.push({ element, cells })
    }
  }

  return matches
}

/** 消えたマスを詰めて、上から新しいドロップを補充した盤面を返す。 */
export function clearAndFall(
  board: Board,
  matches: Match[],
  rng: Rng = Math.random
): Board {
  const removed = board.map((row) => row.map(() => false))
  for (const match of matches) {
    for (const cell of match.cells) {
      removed[cell.row][cell.col] = true
    }
  }

  const next = cloneBoard(board)
  for (let col = 0; col < COLS; col++) {
    // 下から詰め直す
    const kept: Orb[] = []
    for (let row = board.length - 1; row >= 0; row--) {
      if (!removed[row][col]) {
        kept.push(board[row][col])
      }
    }
    for (let row = board.length - 1; row >= 0; row--) {
      const index = board.length - 1 - row
      next[row][col] =
        index < kept.length ? kept[index] : createOrb(randomElement(rng))
    }
  }
  return next
}

export type ResolveStep = {
  /** このステップで消えるかたまり */
  matches: Match[]
  /** 消える直前の盤面 */
  boardBefore: Board
  /** 落下と補充が終わった盤面 */
  boardAfter: Board
}

export type ResolveResult = {
  steps: ResolveStep[]
  /** 連鎖も含めた総コンボ数 */
  combo: number
  /** 全ステップで消えたかたまり */
  matches: Match[]
  board: Board
}

/** 落下と連鎖が止まるまで解決する。演出のためにステップごとの盤面も返す。 */
export function resolveBoard(
  board: Board,
  rng: Rng = Math.random,
  maxSteps = 30
): ResolveResult {
  const steps: ResolveStep[] = []
  const all: Match[] = []
  let current = board

  for (let i = 0; i < maxSteps; i++) {
    const matches = findMatches(current)
    if (matches.length === 0) break
    const after = clearAndFall(current, matches, rng)
    steps.push({ matches, boardBefore: current, boardAfter: after })
    all.push(...matches)
    current = after
  }

  return { steps, combo: all.length, matches: all, board: current }
}
