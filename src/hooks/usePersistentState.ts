import { useEffect, useState } from 'react'
import { loadJSON, saveJSON } from '../lib/storage'

/** Wie useState, aber automatisch im localStorage gespeichert und beim Laden wiederhergestellt. */
export function usePersistentState<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
) {
  const [state, setState] = useState<T>(() => loadJSON(key, validate) ?? fallback)

  useEffect(() => {
    saveJSON(key, state)
  }, [key, state])

  return [state, setState] as const
}
