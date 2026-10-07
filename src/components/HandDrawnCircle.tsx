import { useMemo } from 'react'
import { sketchCircle } from '../lib/sketch'

interface Props {
  /** Gleicher Seed → gleicher Kreis (bleibt beim Neuladen stabil). */
  seed: number
  className?: string
}

export function HandDrawnCircle({ seed, className = '' }: Props) {
  const d = useMemo(() => sketchCircle(seed), [seed])
  return (
    <svg className={`sketch-circle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d={d} pathLength={1} />
    </svg>
  )
}
