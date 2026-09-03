/**
 * honeycomb-renderer.ts
 *
 * Canvas2D drawing for the honeycomb grid. Renders connections first (below),
 * then cell outlines, then glow effects on active cells.
 *
 * Receives pre-computed interaction state — no cursor tracking here.
 */

import type { HoneycombGrid } from "@/components/hero/honeycomb-grid";
import { flatTopHexVertices } from "@/components/hero/honeycomb-grid";

// ---------------------------------------------------------------------------
// Design tokens (aligned with DESIGN.md)
// ---------------------------------------------------------------------------

const COLOR_ACCENT = { r: 244, g: 180, b: 0 }; // #F4B400
const COLOR_ACCENT_GLOW = { r: 255, g: 201, b: 51 }; // #FFC933

// Base cell appearance (intentionally subtle — grid is barely visible at rest)
const BASE_STROKE_ALPHA_MIN = 0.03;
const BASE_STROKE_ALPHA_MAX = 0.08;
const BASE_STROKE_WIDTH = 0.7;

// Active cell appearance (pulse / hover — clearly visible amber)
const ACTIVE_STROKE_ALPHA_MAX = 0.65;
const ACTIVE_STROKE_WIDTH = 1.4;
const GLOW_BLUR_MAX = 10;
const GLOW_ALPHA_MAX = 0.35;

// Connection appearance
const CONNECTION_BASE_ALPHA = 0.015;
const CONNECTION_ACTIVE_ALPHA_MAX = 0.30;
const CONNECTION_BASE_WIDTH = 0.4;
const CONNECTION_ACTIVE_WIDTH = 0.7;

// ---------------------------------------------------------------------------
// Pre-computed hex path (reused for all cells)
// ---------------------------------------------------------------------------

let cachedRadius = 0;
let cachedPath: Path2D | null = null;
let cachedVertices: [number, number][] = [];

function getHexPath(radius: number): Path2D {
  if (radius === cachedRadius && cachedPath) return cachedPath;

  cachedRadius = radius;
  cachedVertices = flatTopHexVertices(radius);
  const path = new Path2D();
  path.moveTo(cachedVertices[0][0], cachedVertices[0][1]);
  for (let i = 1; i < 6; i++) {
    path.lineTo(cachedVertices[i][0], cachedVertices[i][1]);
  }
  path.closePath();
  cachedPath = path;
  return path;
}

// ---------------------------------------------------------------------------
// Draw
// ---------------------------------------------------------------------------

export function drawHoneycomb(
  ctx: CanvasRenderingContext2D,
  grid: HoneycombGrid,
  activeMap: Map<number, number>,
): void {
  const { cells, connections, cellRadius } = grid;
  const hexPath = getHexPath(cellRadius);

  // Reset shadow state once
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  // ----- Pass 1: Connections -----
  ctx.lineCap = "round";

  for (const conn of connections) {
    const fromCell = cells[conn.from];
    const toCell = cells[conn.to];

    const fromIntensity = activeMap.get(conn.from) ?? 0;
    const toIntensity = activeMap.get(conn.to) ?? 0;
    const intensity = Math.max(fromIntensity, toIntensity);

    let alpha: number;
    let width: number;

    if (intensity > 0) {
      // Both endpoints must be active for connection to illuminate
      const minIntensity = Math.min(fromIntensity || 0, toIntensity || 0);
      if (minIntensity > 0) {
        alpha =
          CONNECTION_BASE_ALPHA +
          minIntensity * (CONNECTION_ACTIVE_ALPHA_MAX - CONNECTION_BASE_ALPHA);
        width =
          CONNECTION_BASE_WIDTH +
          minIntensity * (CONNECTION_ACTIVE_WIDTH - CONNECTION_BASE_WIDTH);
        const blend = minIntensity;
        const r = Math.round(255 * (1 - blend) + COLOR_ACCENT.r * blend);
        const g = Math.round(255 * (1 - blend) + COLOR_ACCENT.g * blend);
        const b = Math.round(255 * (1 - blend) + COLOR_ACCENT.b * blend);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      } else {
        // Only one endpoint active — subtle brightening
        alpha = CONNECTION_BASE_ALPHA + intensity * 0.04;
        width = CONNECTION_BASE_WIDTH;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      }
    } else {
      alpha = CONNECTION_BASE_ALPHA;
      width = CONNECTION_BASE_WIDTH;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    }

    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(fromCell.cx, fromCell.cy);
    ctx.lineTo(toCell.cx, toCell.cy);
    ctx.stroke();
  }

  // ----- Pass 2: Cell outlines (inactive) -----
  ctx.lineWidth = BASE_STROKE_WIDTH;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";

  for (const cell of cells) {
    if (activeMap.has(cell.index)) continue; // drawn in pass 3

    const baseAlpha =
      BASE_STROKE_ALPHA_MIN +
      cell.seed * (BASE_STROKE_ALPHA_MAX - BASE_STROKE_ALPHA_MIN);

    ctx.strokeStyle = `rgba(255,255,255,${baseAlpha})`;

    ctx.save();
    ctx.translate(cell.cx, cell.cy);
    ctx.scale(cell.scale, cell.scale);
    ctx.stroke(hexPath);
    ctx.restore();
  }

  // ----- Pass 3: Active cells (with glow) -----
  for (const [cellIndex, intensity] of activeMap) {
    const cell = cells[cellIndex];
    if (!cell) continue;

    const baseAlpha =
      BASE_STROKE_ALPHA_MIN +
      cell.seed * (BASE_STROKE_ALPHA_MAX - BASE_STROKE_ALPHA_MIN);

    // Stroke blends from white → accent color
    const strokeAlpha =
      baseAlpha + intensity * (ACTIVE_STROKE_ALPHA_MAX - baseAlpha);
    const lineWidth =
      BASE_STROKE_WIDTH + intensity * (ACTIVE_STROKE_WIDTH - BASE_STROKE_WIDTH);

    const r = Math.round(255 * (1 - intensity) + COLOR_ACCENT.r * intensity);
    const g = Math.round(255 * (1 - intensity) + COLOR_ACCENT.g * intensity);
    const b = Math.round(255 * (1 - intensity) + COLOR_ACCENT.b * intensity);

    // Glow (only for cells with meaningful intensity)
    if (intensity > 0.15) {
      const glowAlpha = intensity * GLOW_ALPHA_MAX;
      ctx.shadowBlur = intensity * GLOW_BLUR_MAX;
      ctx.shadowColor = `rgba(${COLOR_ACCENT_GLOW.r},${COLOR_ACCENT_GLOW.g},${COLOR_ACCENT_GLOW.b},${glowAlpha})`;
    } else {
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    }

    ctx.strokeStyle = `rgba(${r},${g},${b},${strokeAlpha})`;
    ctx.lineWidth = lineWidth;

    ctx.save();
    ctx.translate(cell.cx, cell.cy);
    ctx.scale(cell.scale, cell.scale);
    ctx.stroke(hexPath);
    ctx.restore();
  }

  // Reset shadow for next frame
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}
