import type { AppState, BingoBoard } from './types'

export const DEFAULT_STATE: AppState = {
  view: 'setup',
  input: '',
  shuffle: true,
  board: null,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

function isBoard(value: unknown): value is BingoBoard {
  if (!isRecord(value)) return false
  const { id, size, cells, marked, createdAt } = value
  return (
    typeof id === 'string' &&
    typeof size === 'number' &&
    typeof createdAt === 'number' &&
    Array.isArray(cells) &&
    Array.isArray(marked) &&
    cells.length === size * size &&
    marked.length === cells.length &&
    cells.every((c) => typeof c === 'string') &&
    marked.every((m) => typeof m === 'boolean')
  )
}

/** Prüft gespeicherte Daten, damit kaputte/alte Stände die App nicht crashen. */
export function isAppState(value: unknown): value is AppState {
  if (!isRecord(value)) return false
  return (
    (value.view === 'setup' || value.view === 'play') &&
    typeof value.input === 'string' &&
    typeof value.shuffle === 'boolean' &&
    (value.board === null || isBoard(value.board))
  )
}
