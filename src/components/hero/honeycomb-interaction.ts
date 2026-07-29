/**
 * honeycomb-interaction.ts
 *
 * Pure computation of cursor proximity intensity for honeycomb cells.
 * No React, no DOM access — designed to be called from an animation loop.
 */

import type { HexCell } from "@/components/hero/honeycomb-grid";

/**
 * Computes proximity intensity for all cells near the cursor.
 *
 * @returns Map of cell index → intensity in (0, 1].
 *          Cells outside the radius are not included.
 */
export function computeProximity(
  cells: HexCell[],
  cursorX: number,
  cursorY: number,
  radius: number,
): Map<number, number> {
  const active = new Map<number, number>();
  const radiusSq = radius * radius;

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const dx = cursorX - cell.cx;
    const dy = cursorY - cell.cy;
    const distSq = dx * dx + dy * dy;

    if (distSq >= radiusSq) continue;

    const dist = Math.sqrt(distSq);
    // Smooth cubic falloff for a more organic feel
    const t = 1 - dist / radius;
    const intensity = t * t * (3 - 2 * t); // smoothstep
    active.set(cell.index, intensity);
  }

  return active;
}
