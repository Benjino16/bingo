/** Kurzes haptisches Feedback auf Geräten, die es unterstützen (v.a. Android; iOS ignoriert es). */
export function vibrate(pattern: number | number[]) {
  navigator.vibrate?.(pattern)
}
