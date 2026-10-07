import { HandDrawnCircle } from './HandDrawnCircle'

interface Props {
  text: string
  marked: boolean
  seed: number
  onToggle: () => void
}

export function BingoCell({ text, marked, seed, onToggle }: Props) {
  const isEmpty = text === ''
  return (
    <button
      type="button"
      className={`cell${isEmpty ? ' cell--empty' : ''}${marked ? ' cell--marked' : ''}`}
      aria-pressed={marked}
      aria-label={isEmpty ? 'Leeres Feld' : undefined}
      onClick={onToggle}
    >
      <span className="cell__text">{text}</span>
      {marked && <HandDrawnCircle seed={seed} />}
    </button>
  )
}
