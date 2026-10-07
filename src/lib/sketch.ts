import { seededRandom } from './random'

type Point = [number, number]

const fmt = (n: number) => n.toFixed(1)

/** Glatter Pfad durch Punkte (Catmull-Rom → kubische Bézier). */
function smoothPath(points: Point[]): string {
  let d = `M${fmt(points[0][0])},${fmt(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${fmt(c1[0])},${fmt(c1[1])} ${fmt(c2[0])},${fmt(c2[1])} ${fmt(p2[0])},${fmt(p2[1])}`
  }
  return d
}

export interface SketchCircleOptions {
  cx?: number
  cy?: number
  radius?: number
}

/**
 * Handgezeichnet wirkender Kreis: leicht eiförmig, schief, wackelig
 * und mit überlappendem Ende – wie mit einem Stift gezogen.
 */
export function sketchCircle(seed: number, { cx = 50, cy = 50, radius = 40 }: SketchCircleOptions = {}): string {
  const rand = seededRandom(seed)
  const start = rand() * Math.PI * 2
  const sweep = Math.PI * 2 + 0.35 + rand() * 0.45
  const rx = radius * (0.92 + rand() * 0.1)
  const ry = radius * (0.82 + rand() * 0.1)
  const tilt = (rand() - 0.5) * 0.6
  const phaseA = rand() * Math.PI * 2
  const phaseB = rand() * Math.PI * 2
  const steps = 28

  const points: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const angle = start + sweep * t
    // Spiraliger Drift, damit sich Anfang und Ende nicht exakt treffen.
    const drift = 1 + 0.07 * (t - 0.5)
    const wobble = 1 + 0.035 * Math.sin(angle * 2 + phaseA) + 0.025 * Math.sin(angle * 3 + phaseB)
    const x = Math.cos(angle) * rx * drift * wobble
    const y = Math.sin(angle) * ry * drift * wobble
    points.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)])
  }
  return smoothPath(points)
}

/** Leicht gebogener, über die Endpunkte hinausragender Strich. */
export function sketchLine(seed: number, from: Point, to: Point, overshoot = 0.12): string {
  const rand = seededRandom(seed)
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const length = Math.hypot(dx, dy)
  const [nx, ny] = [-dy / length, dx / length]
  const extend = (base: Point, dir: number, amount: number): Point => [
    base[0] + dir * dx * amount + nx * (rand() - 0.5) * length * 0.02,
    base[1] + dir * dy * amount + ny * (rand() - 0.5) * length * 0.02,
  ]
  const a = extend(from, -1, overshoot * (0.6 + rand() * 0.6))
  const b = extend(to, 1, overshoot * (0.6 + rand() * 0.6))
  const bow = (rand() - 0.5) * length * 0.05
  const mid: Point = [(a[0] + b[0]) / 2 + nx * bow, (a[1] + b[1]) / 2 + ny * bow]
  return `M${fmt(a[0])},${fmt(a[1])} Q${fmt(mid[0])},${fmt(mid[1])} ${fmt(b[0])},${fmt(b[1])}`
}
