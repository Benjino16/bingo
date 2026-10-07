import { useCallback, useMemo } from 'react'
import { clearMarks, createBoard, toggleCell } from '../bingo/board'
import { STORAGE_KEY } from '../bingo/config'
import { DEFAULT_STATE, isAppState } from '../bingo/persistence'
import type { AppState, BingoBoard } from '../bingo/types'
import { usePersistentState } from './usePersistentState'

/** Zentraler App-Zustand inkl. aller Aktionen. */
export function useBingoApp() {
  const [state, setState] = usePersistentState<AppState>(STORAGE_KEY, DEFAULT_STATE, isAppState)

  const patch = useCallback((changes: Partial<AppState>) => setState((s) => ({ ...s, ...changes })), [setState])
  const updateBoard = useCallback(
    (update: (board: BingoBoard) => BingoBoard) => setState((s) => (s.board ? { ...s, board: update(s.board) } : s)),
    [setState],
  )

  const actions = useMemo(
    () => ({
      setInput: (input: string) => patch({ input }),
      setShuffle: (shuffle: boolean) => patch({ shuffle }),
      createBoard: (entries: string[]) =>
        setState((s) => ({ ...s, view: 'play', board: createBoard(entries, { shuffle: s.shuffle }) })),
      toggleCell: (index: number) => updateBoard((board) => toggleCell(board, index)),
      clearMarks: () => updateBoard(clearMarks),
      goToSetup: () => patch({ view: 'setup' }),
      goToPlay: () => patch({ view: 'play' }),
    }),
    [patch, setState, updateBoard],
  )

  return { state, ...actions }
}
