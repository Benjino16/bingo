import type { CSSProperties } from 'react'
import type { PatternMatch } from '../bingo/patterns'
import type { BingoBoard } from '../bingo/types'
import { hashString } from '../lib/random'
import { sketchLine } from '../lib/sketch'
import { BingoCell } from './BingoCell'

/** Ein Feld entspricht im Overlay 100×100 Einheiten. */
const CELL_UNITS = 100

interface Props {
  board: BingoBoard
  matches: PatternMatch[]
  onToggle: (index: number) => void
}

function cellCenter(index: number, size: number): [number, number] {
  const col = index % size
  const row = Math.floor(index / size)
  return [col * CELL_UNITS + CELL_UNITS / 2, row * CELL_UNITS + CELL_UNITS / 2]
}

export function BingoGrid({ board, matches, onToggle }: Props) {
  const { size } = board
  const lines = matches.filter((m) => m.pattern.kind === 'line')
  // Erreichte Specials als CSS-Klassen (z.B. board--blackout), um sie gezielt zu stylen.
  const specialClasses = matches
    .filter((m) => m.pattern.kind === 'special')
    .map((m) => `board--${m.pattern.id}`)
    .join(' ')

  return (
    <div className={`board ${specialClasses}`} style={{ '--size': size } as CSSProperties}>
      <div className="board__grid">
        {board.cells.map((text, i) => (
          <BingoCell
            key={i}
            text={text}
            marked={board.marked[i]}
            seed={hashString(`${board.id}:${i}`)}
            onToggle={() => onToggle(i)}
          />
        ))}
      </div>

      <svg className="board__lines" viewBox={`0 0 ${size * CELL_UNITS} ${size * CELL_UNITS}`} aria-hidden="true">
        {lines.map((match) => {
          const from = cellCenter(match.cells[0], size)
          const to = cellCenter(match.cells[match.cells.length - 1], size)
          return (
            <path
              key={match.key}
              className="strike"
              d={sketchLine(hashString(`${board.id}:${match.key}`), from, to)}
              pathLength={1}
            />
          )
        })}
      </svg>
    </div>
  )
}
