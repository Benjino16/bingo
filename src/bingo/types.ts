export interface BingoBoard {
  id: string
  /** Kantenlänge, z.B. 4 für ein 4×4-Board. */
  size: number
  /** Feldtexte zeilenweise (Länge size²). Leerer String = leeres Feld. */
  cells: string[]
  /** Markierungsstatus pro Feld, gleiche Reihenfolge wie `cells`. */
  marked: boolean[]
  createdAt: number
}

export type View = 'setup' | 'play'

/** Gesamter (persistierter) Zustand der App. */
export interface AppState {
  view: View
  /** Roher Text aus dem Eingabefeld. */
  input: string
  shuffle: boolean
  board: BingoBoard | null
}
