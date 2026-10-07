# Bingo

Einfache Bingo-App (Vite + React + TypeScript).

1. Begriffe/Zahlen untereinander eingeben → Board wird erstellt (9 → 3×3, 16 → 4×4, … bis 6×6).
   Passt die Anzahl nicht, erscheint vorher eine Warnung; überzählige Felder bleiben leer.
2. Felder anklicken, um sie mit einem handgezeichneten Kreis zu markieren.
   Volle Zeilen, Spalten und Diagonalen werden durchgestrichen; Specials (X, Blackout) erscheinen als Abzeichen.
3. Der Zustand wird im `localStorage` gespeichert und beim nächsten Öffnen wiederhergestellt.

```sh
npm install
npm run dev
```

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `src/bingo/` | Reine Spiellogik ohne React: Board-Erstellung, Muster, Persistenz-Validierung, Konfiguration |
| `src/bingo/patterns.ts` | Alle Gewinnmuster. Neues Special = neue `PatternDefinition` in `PATTERNS` eintragen |
| `src/hooks/` | `useBingoApp` (App-Zustand + Aktionen), `usePersistentState` (localStorage-Sync) |
| `src/components/` | UI: `SetupView`, `PlayView`, `BingoGrid`, `BingoCell`, `HandDrawnCircle`, … |
| `src/lib/` | Hilfsfunktionen: Zufall/Seeds, Storage, Generator für handgezeichnete SVG-Pfade |
