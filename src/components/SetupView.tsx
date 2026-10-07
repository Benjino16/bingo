import { useMemo, useState } from 'react'
import { describePlanIssue, EXACT_ENTRY_COUNTS, parseEntries, planBoard } from '../bingo/board'

interface Props {
  input: string
  shuffle: boolean
  hasBoard: boolean
  onInputChange: (input: string) => void
  onShuffleChange: (shuffle: boolean) => void
  onCreate: (entries: string[]) => void
  onResume: () => void
}

export function SetupView({ input, shuffle, hasBoard, onInputChange, onShuffleChange, onCreate, onResume }: Props) {
  const entries = useMemo(() => parseEntries(input), [input])
  const plan = planBoard(entries.length)
  const issue = describePlanIssue(plan, shuffle)
  const [showWarning, setShowWarning] = useState(false)

  const handleCreate = () => {
    if (issue && !showWarning) {
      setShowWarning(true)
      return
    }
    setShowWarning(false)
    onCreate(entries)
  }

  return (
    <main className="view view--setup">
      <header className="setup__header">
        <h1>Bingo</h1>
        <p className="muted">Ein Begriff oder eine Zahl pro Zeile.</p>
      </header>

      <textarea
        className="entries"
        value={input}
        onChange={(e) => {
          onInputChange(e.target.value)
          setShowWarning(false)
        }}
        placeholder={'Kaffee\nMeeting verschoben\n42\n…'}
        rows={12}
        spellCheck={false}
        autoFocus
      />

      <div className="setup__meta">
        <span className={plan.isExact ? 'ok' : 'muted'}>
          {entries.length} {entries.length === 1 ? 'Begriff' : 'Begriffe'}
          {entries.length > 0 && ` → ${plan.size}×${plan.size}-Board`}
          {plan.isExact && ' ✓'}
        </span>
        <label className="checkbox">
          <input type="checkbox" checked={shuffle} onChange={(e) => onShuffleChange(e.target.checked)} />
          Reihenfolge mischen
        </label>
      </div>

      {showWarning && issue && (
        <div className="warning" role="alert">
          <p>
            <strong>Achtung:</strong> {issue}
          </p>
          <p className="muted">Passende Anzahlen: {EXACT_ENTRY_COUNTS.join(', ')}.</p>
          <div className="warning__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setShowWarning(false)}>
              Anpassen
            </button>
            <button type="button" className="btn" onClick={handleCreate}>
              Trotzdem erstellen
            </button>
          </div>
        </div>
      )}

      <div className="setup__actions">
        {hasBoard && (
          <button type="button" className="btn btn--ghost" onClick={onResume}>
            Zum aktuellen Board
          </button>
        )}
        {!showWarning && (
          <button type="button" className="btn btn--primary" onClick={handleCreate} disabled={entries.length === 0}>
            {hasBoard ? 'Neues Board erstellen' : 'Bingo-Board erstellen'}
          </button>
        )}
      </div>
    </main>
  )
}
