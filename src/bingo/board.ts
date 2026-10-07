import { MAX_BOARD_SIZE, MIN_BOARD_SIZE } from './config'
import type { BingoBoard } from './types'
import { createId, shuffled } from '../lib/random'

/** Zerlegt die Eingabe in Begriffe: eine Zeile = ein Begriff, Leerzeilen werden ignoriert. */
export function parseEntries(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

export interface BoardPlan {
  entryCount: number
  size: number
  capacity: number
  /** Felder, die leer bleiben, weil zu wenige Begriffe vorhanden sind. */
  emptyCells: number
  /** Begriffe, die nicht mehr aufs größte Board passen. */
  droppedEntries: number
  /** true, wenn die Anzahl genau ein Quadrat ergibt (9, 16, 25, 36). */
  isExact: boolean
}

/** Bestimmt anhand der Anzahl Begriffe die passende Board-Größe. */
export function planBoard(entryCount: number): BoardPlan {
  const ideal = Math.ceil(Math.sqrt(entryCount))
  const size = Math.min(MAX_BOARD_SIZE, Math.max(MIN_BOARD_SIZE, ideal))
  const capacity = size * size
  return {
    entryCount,
    size,
    capacity,
    emptyCells: Math.max(0, capacity - entryCount),
    droppedEntries: Math.max(0, entryCount - capacity),
    isExact: entryCount === capacity,
  }
}

export const EXACT_ENTRY_COUNTS = Array.from(
  { length: MAX_BOARD_SIZE - MIN_BOARD_SIZE + 1 },
  (_, i) => (MIN_BOARD_SIZE + i) ** 2,
)

/** Menschlich lesbare Warnung, falls die Anzahl nicht exakt passt – sonst null. */
export function describePlanIssue(plan: BoardPlan, shuffle: boolean): string | null {
  if (plan.isExact || plan.entryCount === 0) return null
  const dims = `${plan.size}×${plan.size}`

  if (plan.droppedEntries > 0) {
    return (
      `Du hast ${plan.entryCount} Begriffe, auf ein ${dims}-Board passen aber maximal ${plan.capacity}. ` +
      `${plan.droppedEntries} Begriff${plan.droppedEntries === 1 ? '' : 'e'} ` +
      (shuffle ? 'werden zufällig weggelassen.' : 'am Ende der Liste werden weggelassen.')
    )
  }

  return (
    `Du hast ${plan.entryCount} Begriff${plan.entryCount === 1 ? '' : 'e'} – für ein ${dims}-Board werden ${plan.capacity} benötigt. ` +
    `${plan.emptyCells} Feld${plan.emptyCells === 1 ? '' : 'er'} ${plan.emptyCells === 1 ? 'bleibt' : 'bleiben'} leer.`
  )
}

export interface CreateBoardOptions {
  shuffle: boolean
}

export function createBoard(entries: readonly string[], { shuffle }: CreateBoardOptions): BingoBoard {
  const plan = planBoard(entries.length)
  const pool = shuffle ? shuffled(entries) : [...entries]
  const filled = [...pool.slice(0, plan.capacity), ...Array<string>(plan.emptyCells).fill('')]
  // Beim Mischen landen auch leere Felder an zufälligen Positionen.
  const cells = shuffle ? shuffled(filled) : filled

  return {
    id: createId(),
    size: plan.size,
    cells,
    marked: cells.map(() => false),
    createdAt: Date.now(),
  }
}

export function toggleCell(board: BingoBoard, index: number): BingoBoard {
  return { ...board, marked: board.marked.map((value, i) => (i === index ? !value : value)) }
}

export function clearMarks(board: BingoBoard): BingoBoard {
  return { ...board, marked: board.marked.map(() => false) }
}
