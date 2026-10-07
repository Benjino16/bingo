import type { BingoBoard } from './types'

/**
 * - `line`: klassische Bingo-Linie, wird auf dem Board durchgestrichen.
 * - `special`: Sonderziel (X, Blackout, …), wird als Abzeichen angezeigt.
 */
export type PatternKind = 'line' | 'special'

export interface PatternInstance {
  label: string
  /** Feld-Indizes. Bei Linien in Zeichenreihenfolge (erstes → letztes Feld). */
  cells: number[]
}

export interface PatternDefinition {
  id: string
  /** Name für Abzeichen / Übersicht. */
  name: string
  kind: PatternKind
  /** Jubel-Text, wenn das Muster neu erreicht wird (Standard: "Bingo!"). */
  cheer?: string
  /** Liefert alle konkreten Ausprägungen dieses Musters für eine Board-Größe. */
  instances: (size: number) => PatternInstance[]
}

export interface PatternMatch {
  /** Stabiler, eindeutiger Schlüssel, z.B. "row:2". */
  key: string
  pattern: PatternDefinition
  label: string
  cells: number[]
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

const mainDiagonal = (size: number) => range(size).map((i) => i * size + i)
const antiDiagonal = (size: number) => range(size).map((i) => i * size + (size - 1 - i))

export const ROWS: PatternDefinition = {
  id: 'row',
  name: 'Zeile',
  kind: 'line',
  instances: (size) =>
    range(size).map((r) => ({ label: `Zeile ${r + 1}`, cells: range(size).map((c) => r * size + c) })),
}

export const COLUMNS: PatternDefinition = {
  id: 'column',
  name: 'Spalte',
  kind: 'line',
  instances: (size) =>
    range(size).map((c) => ({ label: `Spalte ${c + 1}`, cells: range(size).map((r) => r * size + c) })),
}

export const DIAGONALS: PatternDefinition = {
  id: 'diagonal',
  name: 'Diagonale',
  kind: 'line',
  instances: (size) => [
    { label: 'Diagonale ↘', cells: mainDiagonal(size) },
    { label: 'Diagonale ↙', cells: antiDiagonal(size) },
  ],
}

export const X_PATTERN: PatternDefinition = {
  id: 'x',
  name: 'X',
  kind: 'special',
  cheer: 'X-Bingo!',
  instances: (size) => [
    { label: 'X', cells: [...new Set([...mainDiagonal(size), ...antiDiagonal(size)])] },
  ],
}

export const BLACKOUT: PatternDefinition = {
  id: 'blackout',
  name: 'Blackout',
  kind: 'special',
  cheer: 'Blackout!',
  instances: (size) => [{ label: 'Blackout', cells: range(size * size) }],
}

/**
 * Alle aktiven Muster. Neue Specials (z.B. "Vier Ecken", "Rahmen", "Plus")
 * einfach als PatternDefinition anlegen und hier eintragen.
 */
export const PATTERNS: PatternDefinition[] = [ROWS, COLUMNS, DIAGONALS, X_PATTERN, BLACKOUT]

export function findMatches(board: BingoBoard, patterns: readonly PatternDefinition[] = PATTERNS): PatternMatch[] {
  return patterns.flatMap((pattern) =>
    pattern
      .instances(board.size)
      .map((instance, i) => ({ instance, key: `${pattern.id}:${i}` }))
      .filter(({ instance }) => instance.cells.every((cell) => board.marked[cell]))
      .map(({ instance, key }) => ({ key, pattern, label: instance.label, cells: instance.cells })),
  )
}

/** Matches, die in `next` neu hinzugekommen sind – Specials zuerst. */
export function newMatches(previous: readonly PatternMatch[], next: readonly PatternMatch[]): PatternMatch[] {
  const known = new Set(previous.map((m) => m.key))
  return next
    .filter((m) => !known.has(m.key))
    .sort((a, b) => Number(b.pattern.kind === 'special') - Number(a.pattern.kind === 'special'))
}
