/**
 * honeycomb-grid.ts
 *
 * Pure geometry for a flat-top, offset-coordinate honeycomb that overscans
 * the viewport on all sides so the pattern feels infinite.
 *
 * Flat-top hex math (circumradius R = center → vertex):
 *   width  = 2R
 *   height = R√3
 *   col step = 1.5R
 *   row step = R√3
 *   odd-col row offset = R√3 / 2
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HexCell = {
  /** Index in the cells array. */
  index: number;
  /** Offset column coordinate. */
  col: number;
  /** Offset row coordinate. */
  row: number;
  /** Center x in canvas pixels. */
  cx: number;
  /** Center y in canvas pixels. */
  cy: number;
  /** Indices of the up-to-six neighboring cells. */
  neighbors: number[];
  /** Deterministic per-cell visual seed in [0, 1). */
  seed: number;
  /** Scale variation factor in [0.95, 1.05]. */
  scale: number;
};

export type HexConnection = {
  /** Index of first endpoint cell. */
  from: number;
  /** Index of second endpoint cell. */
  to: number;
};

export type HoneycombGrid = {
  cells: HexCell[];
  connections: HexConnection[];
  /** Circumradius (center-to-vertex) in canvas pixels. */
  cellRadius: number;
};

// ---------------------------------------------------------------------------
// Deterministic hash for visual variation
// ---------------------------------------------------------------------------

/** Simple integer hash for deterministic per-cell variation. */
function cellHash(col: number, row: number): number {
  let h = (col * 374761393 + row * 668265263) | 0;
  h = (h ^ (h >>> 13)) | 0;
  h = (h * 1274126177) | 0;
  h = (h ^ (h >>> 16)) | 0;
  return (h >>> 0) / 4294967296; // normalise to [0, 1)
}

// ---------------------------------------------------------------------------
// Flat-top hex vertex computation
// ---------------------------------------------------------------------------

/** The six vertices of a flat-top hexagon centered at the origin. */
export function flatTopHexVertices(radius: number): [number, number][] {
  const vertices: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    vertices.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }
  return vertices;
}

// ---------------------------------------------------------------------------
// Grid generation
// ---------------------------------------------------------------------------

const SQRT3 = Math.sqrt(3);
const TARGET_CELL_COUNT = 200;
const MIN_RADIUS = 36;
const MAX_RADIUS = 70;
const OVERSCAN = 2; // extra cells beyond each viewport edge

export function generateHoneycombGrid(
  viewportWidth: number,
  viewportHeight: number,
): HoneycombGrid {
  // --- Compute cell radius to target ~200 cells ---
  const viewportArea = viewportWidth * viewportHeight;
  const hexArea = (3 * SQRT3) / 2; // area of unit-radius flat-top hex
  let R = Math.sqrt(viewportArea / TARGET_CELL_COUNT / hexArea);
  R = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, R));

  // --- Grid spacing ---
  const colStep = 1.5 * R;
  const rowStep = SQRT3 * R;
  const oddColRowOffset = rowStep / 2;

  // --- Determine grid bounds with overscan ---
  const cols = Math.ceil(viewportWidth / colStep) + OVERSCAN * 2 + 1;
  const rows = Math.ceil(viewportHeight / rowStep) + OVERSCAN * 2 + 1;
  const colStart = -OVERSCAN;
  const rowStart = -OVERSCAN;

  // --- Origin offset to center the grid on the viewport ---
  // Column 0, row 0 should be near the top-left (slightly off-screen due to overscan)
  const originX = colStart * colStep;
  const originY = rowStart * rowStep;

  // --- Build cells ---
  const cells: HexCell[] = [];
  const indexByPosition = new Map<string, number>();

  for (let c = colStart; c < colStart + cols; c++) {
    for (let r = rowStart; r < rowStart + rows; r++) {
      const cx = c * colStep - originX;
      const cy =
        r * rowStep + (c % 2 !== 0 ? oddColRowOffset : 0) - originY;
      const seed = cellHash(c, r);
      const index = cells.length;
      indexByPosition.set(`${c}:${r}`, index);
      cells.push({
        index,
        col: c,
        row: r,
        cx,
        cy,
        neighbors: [],
        seed,
        scale: 0.95 + seed * 0.1, // [0.95, 1.05]
      });
    }
  }

  // --- Resolve neighbors ---
  // Flat-top offset coordinates: offsets differ for even vs odd columns.
  const evenColOffsets = [
    [-1, -1],
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
  ];
  const oddColOffsets = [
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, 0],
    [1, 1],
  ];

  const connectionSet = new Set<string>();
  const connections: HexConnection[] = [];

  for (const cell of cells) {
    const offsets =
      ((cell.col % 2) + 2) % 2 === 0 ? evenColOffsets : oddColOffsets;
    for (const [dc, dr] of offsets) {
      const neighborIndex = indexByPosition.get(
        `${cell.col + dc}:${cell.row + dr}`,
      );
      if (neighborIndex !== undefined) {
        cell.neighbors.push(neighborIndex);

        // Deduplicate connections (store min|max)
        const a = Math.min(cell.index, neighborIndex);
        const b = Math.max(cell.index, neighborIndex);
        const key = `${a}|${b}`;
        if (!connectionSet.has(key)) {
          connectionSet.add(key);
          connections.push({ from: a, to: b });
        }
      }
    }
  }

  return { cells, connections, cellRadius: R };
}
