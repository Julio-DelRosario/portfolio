/**
 * honeycomb-ambient.ts
 *
 * Curated pulse routes and ambient twinkle effects for the honeycomb grid.
 *
 * Pulses travel along predefined directional routes rather than random walks,
 * creating the impression of a deliberate signal moving through a system.
 * Route templates define start/end positions as viewport fractions and are
 * resolved against the actual grid geometry at runtime.
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
  /** Duration (ms) for the signal to travel the full path. */
  travelDuration: number;
  /** Duration (ms) the final cell holds before fading out. */
  holdDuration: number;
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
// Pulse configuration — all timing/intensity values in one place
// ---------------------------------------------------------------------------

/** Time (ms) for the signal to traverse one cell. */
const PULSE_STEP_DURATION_MS = 350;

/** Time (ms) the final cell holds its glow before fading. */
const PULSE_HOLD_MS = 600;

/** Peak brightness of the active cell (0–1, consumed by the renderer). */
const PULSE_PEAK_INTENSITY = 0.55;

/**
 * How far the glow extends around the signal head (0–1 of normalised path).
 * 0.15 lights ~3 cells simultaneously for a focused traveling signal.
 */
const PULSE_SPREAD = 0.15;

// ---------------------------------------------------------------------------
// Route templates — curated start→end paths across the honeycomb
// ---------------------------------------------------------------------------

type RouteTemplate = {
  /** Start position as fraction of viewport (0–1). */
  startX: number;
  startY: number;
  /** End position as fraction of viewport (0–1). */
  endX: number;
  endY: number;
  /** Target number of cells in the path. */
  steps: number;
};

/**
 * Five curated routes covering different areas and directions.
 * Each is resolved against the actual grid geometry at runtime
 * using a direction-biased neighbor walk.
 */
const ROUTE_TEMPLATES: RouteTemplate[] = [
  // 1. Left → right across the upper third
  { startX: 0.10, startY: 0.30, endX: 0.85, endY: 0.25, steps: 14 },
  // 2. Right → left across the middle
  { startX: 0.90, startY: 0.50, endX: 0.15, endY: 0.45, steps: 14 },
  // 3. Top-left → bottom-right diagonal
  { startX: 0.15, startY: 0.20, endX: 0.80, endY: 0.70, steps: 12 },
  // 4. Bottom-left → top-right diagonal
  { startX: 0.15, startY: 0.75, endX: 0.75, endY: 0.25, steps: 12 },
  // 5. Left → right across the lower third
  { startX: 0.12, startY: 0.65, endX: 0.82, endY: 0.70, steps: 13 },
];

/** Track last route index to avoid repeating consecutively. */
let lastRouteIndex = -1;

// ---------------------------------------------------------------------------
// Route resolution — convert a template into actual cell indices
// ---------------------------------------------------------------------------

/** Find the cell whose center is closest to the given canvas coordinates. */
function findNearestCell(
  cells: HexCell[],
  x: number,
  y: number,
): HexCell | null {
  let best: HexCell | null = null;
  let bestDist = Infinity;
  for (const cell of cells) {
    const dx = cell.cx - x;
    const dy = cell.cy - y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      best = cell;
    }
  }
  return best;
}

/**
 * Walk from a start cell toward a target position, always picking the
 * unvisited neighbor most aligned with the overall direction.
 * Produces smooth, directional paths that follow hex topology.
 */
function walkToward(
  cells: HexCell[],
  start: HexCell,
  targetX: number,
  targetY: number,
  steps: number,
): number[] {
  const path = [start.index];
  const visited = new Set([start.index]);
  let current = start;

  // Normalised direction vector from start toward target
  const dirX = targetX - start.cx;
  const dirY = targetY - start.cy;
  const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
  const ndx = dirX / dirLen;
  const ndy = dirY / dirLen;

  for (let i = 1; i < steps; i++) {
    let bestNeighbor = -1;
    let bestScore = -Infinity;

    for (const ni of current.neighbors) {
      if (visited.has(ni)) continue;
      const neighbor = cells[ni];
      // Score = alignment with overall direction (dot product)
      const dx = neighbor.cx - current.cx;
      const dy = neighbor.cy - current.cy;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const score = (dx * ndx + dy * ndy) / len;
      if (score > bestScore) {
        bestScore = score;
        bestNeighbor = ni;
      }
    }

    if (bestNeighbor === -1) break; // no unvisited neighbors
    visited.add(bestNeighbor);
    path.push(bestNeighbor);
    current = cells[bestNeighbor];
  }

  return path;
}

/**
 * Resolve a route template against a concrete grid, producing a path
 * of cell indices. Returns null if the grid can't support the route
 * (fewer than 6 valid cells).
 */
function resolveRoute(
  grid: HoneycombGrid,
  template: RouteTemplate,
): number[] | null {
  const { cells, viewportWidth, viewportHeight } = grid;

  const startX = template.startX * viewportWidth;
  const startY = template.startY * viewportHeight;
  const endX = template.endX * viewportWidth;
  const endY = template.endY * viewportHeight;

  const startCell = findNearestCell(cells, startX, startY);
  if (!startCell) return null;

  const path = walkToward(cells, startCell, endX, endY, template.steps);
  // Require at least 6 cells for a deliberate visual
  return path.length >= 6 ? path : null;
}

// ---------------------------------------------------------------------------
// Pulse API
// ---------------------------------------------------------------------------

/**
 * Creates a new pulse along a curated route. Selects a different route
 * template each time to avoid consecutive repetition.
 */
export function startPulse(
  grid: HoneycombGrid,
  now: number,
): PulseState | null {
  const templateCount = ROUTE_TEMPLATES.length;

  // Build candidate list excluding the last-used route
  const candidates = Array.from({ length: templateCount }, (_, i) => i).filter(
    (i) => i !== lastRouteIndex,
  );

  // Shuffle for variety
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (const idx of candidates) {
    const path = resolveRoute(grid, ROUTE_TEMPLATES[idx]);
    if (path) {
      lastRouteIndex = idx;
      return {
        path,
        startTime: now,
        travelDuration: path.length * PULSE_STEP_DURATION_MS,
        holdDuration: PULSE_HOLD_MS,
      };
    }
  }

  return null;
}

/** Returns true when the pulse (travel + hold) is fully complete. */
export function isPulseComplete(
  pulse: PulseState | null,
  now: number,
): boolean {
  if (!pulse) return true;
  return now - pulse.startTime > pulse.travelDuration + pulse.holdDuration;
}

/**
 * Computes intensity for each cell in the pulse path at the given timestamp.
 *
 * During travel: a smoothstep bell curve follows the signal head.
 * During hold:   the remaining lit cells fade out with an ease-out curve.
 */
export function computePulseIntensities(
  pulse: PulseState | null,
  now: number,
): Map<number, number> {
  const result = new Map<number, number>();
  if (!pulse) return result;

  const elapsed = now - pulse.startTime;
  const totalDuration = pulse.travelDuration + pulse.holdDuration;
  if (elapsed < 0 || elapsed > totalDuration) return result;

  // Where is the signal head along the path? (0 → 1)
  let progress: number;
  let fadeFactor: number;

  if (elapsed <= pulse.travelDuration) {
    // Traveling phase: head moves from 0 → 1
    progress = elapsed / pulse.travelDuration;
    fadeFactor = 1;
  } else {
    // Hold phase: head stays at end, everything fades out
    progress = 1;
    const holdElapsed = elapsed - pulse.travelDuration;
    const t = 1 - holdElapsed / pulse.holdDuration;
    fadeFactor = t * t; // ease-out
  }

  const pathLen = pulse.path.length;

  for (let i = 0; i < pathLen; i++) {
    const cellPos = i / (pathLen - 1);
    const dist = Math.abs(progress - cellPos);

    if (dist > PULSE_SPREAD) continue;

    const t = 1 - dist / PULSE_SPREAD;
    const intensity = t * t * (3 - 2 * t) * PULSE_PEAK_INTENSITY * fadeFactor;
    if (intensity > 0.005) {
      result.set(pulse.path[i], intensity);
    }
  }

  return result;
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
