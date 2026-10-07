/** Liest JSON aus dem localStorage. Gibt null zurück, wenn nichts (Gültiges) vorhanden ist. */
export function loadJSON<T>(key: string, validate: (value: unknown) => value is T): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    return validate(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Speicher voll oder blockiert (z.B. privater Modus) – App funktioniert trotzdem.
  }
}
