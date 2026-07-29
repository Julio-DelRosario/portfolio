/**
 * honeycomb-ambient.ts
 *
 * Pure functions for ambient grid animations: energy pulses along connected
 * paths and random cell twinkles. No React, no DOM.
 *
 * All timing is based on a monotonic timestamp (performance.now / rAF time).
 */

import type { HexCell, HoneycombGrid } from "@/components/hero/honeycomb-grid";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PulseState = {
  /** Ordered cell indices forming the pulse path. */
  path: number[];
  /** Timestamp (ms) when the pulse started. */
  startTime: number;
  /** Total duration of the pulse animation (ms). */
  duration: number;
};

export type TwinkleEntry = {
  /** Cell index. */
  cellIndex: number;
  /** Timestamp (ms) when the twinkle started. */
  startTime: number;
  /** Total duration (ms). */
  duration: number;
};

// ---------------------------------------------------------------------------
// Pulse — energy travelling along a connected path
// ---------------------------------------------------------------------------

const PULSE_MIN_LENGTH = 5;
const PULSE_MAX_LENGTH = 10;
const PULSE_DURATION_MS = 2000;
const PULSE_PEAK_INTENSITY = 0.30;
/** How far ahead/behind the head the glow extends (0–1 of total progress). */
const PULSE_SPREAD = 0.30;

/**
 * Selects a random connected path of 5–10 cells by random-walking along
 * neighbor edges. Biases the start cell toward viewport-interior cells.
 */
export function createPulsePath(grid: HoneycombGrid): number[] {
  const { cells } = grid;
  if (cells.length === 0) return [];

  // Pick a starting cell — prefer cells well inside the viewport
  const interiorCells = cells.filter(
    (c) =>
      c.cx > grid.cellRadius * 2 &&
      c.cy > grid.cellRadius * 2 &&
      c.neighbors.length >= 4,
  );
  const pool = interiorCells.length > 10 ? interiorCells : cells;
  const start = pool[Math.floor(Math.random() * pool.length)];

  const pathLength =
    PULSE_MIN_LENGTH + Math.floor(Math.random() * (PULSE_MAX_LENGTH - PULSE_MIN_LENGTH + 1));

  const visited = new Set<number>([start.index]);
  const path: number[] = [start.index];
  let current: HexCell = start;

  for (let step = 1; step < pathLength; step++) {
    // Unvisited neighbors
    const candidates = current.neighbors.filter((n) => !visited.has(n));
    if (candidates.length === 0) break;

    const nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
    visited.add(nextIndex);
    path.push(nextIndex);
    current = cells[nextIndex];
  }

  return path;
}

/**
 * Computes intensity for each cell in a pulse path at the given timestamp.
 * Returns an empty map if the pulse has ended.
 */
export function computePulseIntensities(
  pulse: PulseState | null,
  now: number,
): Map<number, number> {
  const result = new Map<number, number>();
  if (!pulse) return result;

  const elapsed = now - pulse.startTime;
  if (elapsed < 0 || elapsed > pulse.duration) return result;

  const progress = elapsed / pulse.duration; // 0 → 1 (head position along path)
  const pathLen = pulse.path.length;

  for (let i = 0; i < pathLen; i++) {
    // Normalised position of this cell along the path (0 → 1)
    const cellPos = i / (pathLen - 1);
    // Distance from the pulse head
    const dist = Math.abs(progress - cellPos);

    if (dist > PULSE_SPREAD) continue;

    // Smooth bell curve around the head
    const t = 1 - dist / PULSE_SPREAD;
    const intensity = t * t * (3 - 2 * t) * PULSE_PEAK_INTENSITY; // smoothstep × peak
    if (intensity > 0.005) {
      result.set(pulse.path[i], intensity);
    }
  }

  return result;
}

/** Returns true when the pulse animation is complete. */
export function isPulseComplete(pulse: PulseState | null, now: number): boolean {
  if (!pulse) return true;
  return now - pulse.startTime > pulse.duration;
}

/** Creates a new PulseState starting at the given timestamp. */
export function startPulse(grid: HoneycombGrid, now: number): PulseState | null {
  const path = createPulsePath(grid);
  if (path.length < 3) return null;
  return { path, startTime: now, duration: PULSE_DURATION_MS };
}

// ---------------------------------------------------------------------------
// Twinkles — brief random cell brightening
// ---------------------------------------------------------------------------

const TWINKLE_DURATION_MS = 1200;
const TWINKLE_PEAK_INTENSITY = 0.14;
/** Fraction of duration spent ramping up (rest is fade-out). */
const TWINKLE_ATTACK = 0.30;

/**
 * Creates 1–2 new twinkle entries for random cells.
 */
export function createTwinkles(
  grid: HoneycombGrid,
  now: number,
): TwinkleEntry[] {
  const { cells } = grid;
  if (cells.length === 0) return [];

  const count = Math.random() < 0.6 ? 1 : 2;
  const entries: TwinkleEntry[] = [];

  for (let i = 0; i < count; i++) {
    const cell = cells[Math.floor(Math.random() * cells.length)];
    entries.push({
      cellIndex: cell.index,
      startTime: now,
      duration: TWINKLE_DURATION_MS + (Math.random() - 0.5) * 400,
    });
  }

  return entries;
}

/**
 * Computes twinkle intensities for a list of active twinkle entries.
 * Also returns the filtered list with expired entries removed.
 */
export function computeTwinkleIntensities(
  twinkles: TwinkleEntry[],
  now: number,
): { intensities: Map<number, number>; active: TwinkleEntry[] } {
  const intensities = new Map<number, number>();
  const active: TwinkleEntry[] = [];

  for (const t of twinkles) {
    const elapsed = now - t.startTime;
    if (elapsed < 0 || elapsed > t.duration) continue;

    active.push(t);

    const progress = elapsed / t.duration;
    let intensity: number;

    if (progress < TWINKLE_ATTACK) {
      // Ramp up
      const rampT = progress / TWINKLE_ATTACK;
      intensity = rampT * rampT * TWINKLE_PEAK_INTENSITY;
    } else {
      // Fade out
      const fadeT = (progress - TWINKLE_ATTACK) / (1 - TWINKLE_ATTACK);
      intensity = (1 - fadeT) * (1 - fadeT) * TWINKLE_PEAK_INTENSITY;
    }

    if (intensity > 0.005) {
      // Use max in case two twinkles hit the same cell
      const existing = intensities.get(t.cellIndex) ?? 0;
      intensities.set(t.cellIndex, Math.max(existing, intensity));
    }
  }

  return { intensities, active };
}

// ---------------------------------------------------------------------------
// Map merging
// ---------------------------------------------------------------------------

/**
 * Merges multiple intensity maps using Math.max per cell.
 * The first map is mutated and returned for efficiency.
 */
export function mergeIntensityMaps(
  primary: Map<number, number>,
  ...others: Map<number, number>[]
): Map<number, number> {
  for (const map of others) {
    for (const [key, value] of map) {
      const existing = primary.get(key);
      if (existing === undefined || value > existing) {
        primary.set(key, value);
      }
    }
  }
  return primary;
}
