import { PATTERNS, type PatternMatch } from '../bingo/patterns'

interface Props {
  matches: PatternMatch[]
}

/** Übersicht: erreichte Linien + alle Specials (erreicht/offen). */
export function Achievements({ matches }: Props) {
  const lines = matches.filter((m) => m.pattern.kind === 'line')
  const achieved = new Set(matches.map((m) => m.pattern.id))
  const specials = PATTERNS.filter((p) => p.kind === 'special')

  return (
    <section className="achievements" aria-label="Erreichte Muster">
      <div className="achievements__lines">
        <strong>
          {lines.length} {lines.length === 1 ? 'Linie' : 'Linien'}
        </strong>
        {lines.length > 0 && <span className="muted"> · {lines.map((m) => m.label).join(', ')}</span>}
      </div>
      <ul className="badges">
        {specials.map((p) => (
          <li key={p.id} className={`badge${achieved.has(p.id) ? ' badge--done' : ''}`}>
            {achieved.has(p.id) ? '★' : '☆'} {p.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
