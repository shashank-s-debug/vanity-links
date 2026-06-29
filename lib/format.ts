// Small, dependency-free formatting helpers shared across the UI.

/** 95 -> "1m 35s" (compact, for cards/metadata). */
export function formatDurationCompact(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

/** 95 -> "1:35" (for the player timeline). */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Total minutes for a season, rounded, e.g. "16 min season". */
export function seasonLengthLabel(totalSeconds: number): string {
  const mins = Math.max(1, Math.round(totalSeconds / 60));
  return `${mins} min season`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function pct(value: number, total: number): number {
  if (total <= 0) return 0;
  return clamp((value / total) * 100, 0, 100);
}

/** Stable hash for deterministic art seeds. */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
