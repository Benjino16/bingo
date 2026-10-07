import { useCallback, useMemo, useState } from 'react'
import { findMatches, newMatches } from '../bingo/patterns'
import type { BingoBoard } from '../bingo/types'
import { Achievements } from './Achievements'
import { BingoGrid } from './BingoGrid'
import { Celebration, type CelebrationData } from './Celebration'

interface Props {
  board: BingoBoard
  onToggle: (index: number) => void
  onReset: () => void
  onBack: () => void
}

export function PlayView({ board, onToggle, onReset, onBack }: Props) {
  const matches = useMemo(() => findMatches(board), [board])
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const hasMarks = board.marked.some(Boolean)

  // Neu erreichte Muster erkennen (State-Anpassung während des Renderns statt Effekt).
  // Initial = aktueller Stand, damit ein wiederhergestelltes Board nicht sofort jubelt.
  const [previousMatches, setPreviousMatches] = useState(matches)
  if (previousMatches !== matches) {
    setPreviousMatches(matches)
    const fresh = newMatches(previousMatches, matches)
    if (fresh.length > 0) setCelebration({ id: (celebration?.id ?? 0) + 1, matches: fresh })
  }

  const handleToggle = (index: number) => {
    setConfirmReset(false)
    onToggle(index)
  }

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    setConfirmReset(false)
    setCelebration(null)
    onReset()
  }

  const dismissCelebration = useCallback(() => setCelebration(null), [])

  return (
    <main className="view view--play">
      <header className="toolbar">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Liste bearbeiten
        </button>
        <span className="toolbar__title">
          {board.size}×{board.size}
        </span>
        <button
          type="button"
          className={`btn btn--ghost${confirmReset ? ' btn--danger' : ''}`}
          onClick={handleReset}
          onBlur={() => setConfirmReset(false)}
          disabled={!hasMarks}
        >
          {confirmReset ? 'Wirklich zurücksetzen?' : 'Zurücksetzen'}
        </button>
      </header>

      <BingoGrid board={board} matches={matches} onToggle={handleToggle} />
      <Achievements matches={matches} />
      <Celebration celebration={celebration} onDone={dismissCelebration} />
    </main>
  )
}
