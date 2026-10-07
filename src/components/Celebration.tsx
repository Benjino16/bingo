import { useEffect } from 'react'
import type { PatternMatch } from '../bingo/patterns'
import { vibrate } from '../lib/haptics'

export interface CelebrationData {
  id: number
  matches: PatternMatch[]
}

interface Props {
  celebration: CelebrationData | null
  onDone: () => void
  durationMs?: number
}

export function Celebration({ celebration, onDone, durationMs = 2200 }: Props) {
  useEffect(() => {
    if (!celebration) return
    vibrate([40, 60, 80])
    const timer = setTimeout(onDone, durationMs)
    return () => clearTimeout(timer)
  }, [celebration, onDone, durationMs])

  if (!celebration) return null
  // Matches sind nach Wichtigkeit sortiert (Specials zuerst).
  const [top] = celebration.matches

  return (
    <div className="celebration" key={celebration.id} role="status" onClick={onDone}>
      <div className="celebration__title">{top.pattern.cheer ?? 'Bingo!'}</div>
      <div className="celebration__detail">{celebration.matches.map((m) => m.label).join(' · ')}</div>
    </div>
  )
}
