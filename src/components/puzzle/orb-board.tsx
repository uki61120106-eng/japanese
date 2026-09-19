"use client"

import { useEffect, useRef, useState } from "react"

import { COLS, ROWS, swapCells } from "@/lib/puzzle/board"
import { ELEMENT_THEME } from "@/lib/puzzle/element-theme"
import type { Board, Cell } from "@/lib/puzzle/types"
import { cn } from "@/lib/utils"

type OrbBoardProps = {
  board: Board
  /** 操作を受け付けない間（演出中や決着後）は true */
  disabled?: boolean
  /** 消える最中のドロップ id。薄くして消えたことを分かるようにする */
  clearing?: Set<string>
  /** 入れ替わるたびに呼ばれる。盤面は親が持つ */
  onChange: (board: Board) => void
  /** 指を離した、または時間切れになったとき */
  onRelease: (board: Board) => void
  /** 操作の制限時間（秒）。null は無制限 */
  timeLimitSec: number | null
}

/** 掴んでいる間の状態。表示に使うので state で持つ。 */
type Drag = {
  pointerId: number
  cell: Cell
  orbId: string
  /** 盤面の左上から見たポインタ位置（px） */
  x: number
  y: number
  cellWidth: number
  cellHeight: number
}

export function OrbBoard({
  board,
  disabled = false,
  clearing,
  onChange,
  onRelease,
  timeLimitSec,
}: OrbBoardProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [grabbedAt, setGrabbedAt] = useState<number | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)

  // 掴んでいる間の最新の値。描画には使わず、イベントとタイマーからだけ読む。
  const dragRef = useRef<Drag | null>(null)
  const boardRef = useRef(board)
  const releaseRef = useRef(onRelease)
  /** この操作で1度でも入れ替えたか。動かしていなければターンを消費しない */
  const movedRef = useRef(false)

  useEffect(() => {
    releaseRef.current = onRelease
  })

  /** 制限時間。掴んだ時刻が決まってから動かす。 */
  useEffect(() => {
    if (grabbedAt === null || timeLimitSec === null) return

    const timer = window.setInterval(() => {
      const left = timeLimitSec - (performance.now() - grabbedAt) / 1000
      if (left > 0) {
        setRemaining(left)
        return
      }
      window.clearInterval(timer)
      setRemaining(0)
      setGrabbedAt(null)
      setDrag(null)
      dragRef.current = null
      if (movedRef.current) {
        movedRef.current = false
        releaseRef.current(boardRef.current)
      }
    }, 50)

    return () => window.clearInterval(timer)
  }, [grabbedAt, timeLimitSec])

  function measure() {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return null
    return { rect, cellWidth: rect.width / COLS, cellHeight: rect.height / ROWS }
  }

  function cellAt(
    clientX: number,
    clientY: number,
    size: NonNullable<ReturnType<typeof measure>>
  ): Cell | null {
    const col = Math.floor((clientX - size.rect.left) / size.cellWidth)
    const row = Math.floor((clientY - size.rect.top) / size.cellHeight)
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null
    return { row, col }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return
    const size = measure()
    if (!size) return
    const cell = cellAt(event.clientX, event.clientY, size)
    if (!cell) return

    event.currentTarget.setPointerCapture(event.pointerId)
    const next: Drag = {
      pointerId: event.pointerId,
      cell,
      orbId: board[cell.row][cell.col].id,
      x: event.clientX - size.rect.left,
      y: event.clientY - size.rect.top,
      cellWidth: size.cellWidth,
      cellHeight: size.cellHeight,
    }
    boardRef.current = board
    movedRef.current = false
    dragRef.current = next
    setDrag(next)
    setRemaining(timeLimitSec)
    setGrabbedAt(performance.now())
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const current = dragRef.current
    if (!current || current.pointerId !== event.pointerId) return

    const size = measure()
    if (!size) return

    const next: Drag = {
      ...current,
      x: event.clientX - size.rect.left,
      y: event.clientY - size.rect.top,
      cellWidth: size.cellWidth,
      cellHeight: size.cellHeight,
    }

    const target = cellAt(event.clientX, event.clientY, size)
    if (
      target &&
      (target.row !== current.cell.row || target.col !== current.cell.col)
    ) {
      // 素早く動かして数マス飛んだときは、経路上を1マスずつ入れ替える
      let moving = current.cell
      let updated = boardRef.current
      while (moving.row !== target.row || moving.col !== target.col) {
        const step: Cell =
          moving.row !== target.row
            ? {
                row: moving.row + Math.sign(target.row - moving.row),
                col: moving.col,
              }
            : {
                row: moving.row,
                col: moving.col + Math.sign(target.col - moving.col),
              }
        updated = swapCells(updated, moving, step)
        moving = step
      }
      next.cell = moving
      boardRef.current = updated
      movedRef.current = true
      onChange(updated)
    }

    dragRef.current = next
    setDrag(next)
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const current = dragRef.current
    if (!current || current.pointerId !== event.pointerId) return
    dragRef.current = null
    setDrag(null)
    setGrabbedAt(null)
    setRemaining(null)
    if (!movedRef.current) return
    movedRef.current = false
    onRelease(boardRef.current)
  }

  const draggedOrb = drag ? board[drag.cell.row][drag.cell.col] : null

  return (
    <div className="flex flex-col gap-2">
      {timeLimitSec !== null && (
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-75 ease-linear",
              remaining !== null && remaining < timeLimitSec * 0.3
                ? "bg-rose-500"
                : "bg-emerald-500"
            )}
            style={{
              width:
                remaining === null
                  ? "100%"
                  : `${Math.max(0, (remaining / timeLimitSec) * 100)}%`,
            }}
          />
        </div>
      )}

      <div
        ref={areaRef}
        role="application"
        aria-label="ドロップの盤面"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative grid w-full touch-none select-none",
          "rounded-2xl bg-slate-900/5 dark:bg-slate-100/5",
          disabled && "opacity-80"
        )}
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          aspectRatio: `${COLS} / ${ROWS}`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((orb, colIndex) => {
            const theme = ELEMENT_THEME[orb.element]
            return (
              <div
                key={orb.id}
                className="flex items-center justify-center p-[3px]"
              >
                <div
                  aria-label={`${rowIndex + 1}行${colIndex + 1}列 ${theme.label}`}
                  className={cn(
                    "flex aspect-square w-full items-center justify-center rounded-full",
                    "bg-linear-to-br text-sm font-bold text-white/90 shadow-sm",
                    "transition-all duration-200",
                    theme.orb,
                    drag?.orbId === orb.id && "opacity-25",
                    clearing?.has(orb.id) && "scale-50 opacity-0"
                  )}
                >
                  {theme.symbol}
                </div>
              </div>
            )
          })
        )}

        {/* 掴んでいるドロップは指に追従させる */}
        {drag && draggedOrb && (
          <div
            className="pointer-events-none absolute z-10 flex items-center justify-center"
            style={{
              width: drag.cellWidth,
              height: drag.cellHeight,
              left: drag.x - drag.cellWidth / 2,
              top: drag.y - drag.cellHeight / 2,
            }}
          >
            <div
              className={cn(
                "flex aspect-square w-full scale-110 items-center justify-center rounded-full",
                "bg-linear-to-br text-sm font-bold text-white shadow-lg ring-4 ring-white/70",
                ELEMENT_THEME[draggedOrb.element].orb
              )}
            >
              {ELEMENT_THEME[draggedOrb.element].symbol}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
