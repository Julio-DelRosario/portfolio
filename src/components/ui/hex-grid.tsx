"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useCallback, useEffect, useRef } from "react";

import { Hexagon } from "@/components/ui/hexagon";
import { cn } from "@/lib/utils";

const COLUMN_COUNT = 9;
const ROW_COUNT = 8;
const HEXAGON_SIZE = 100;
const HORIZONTAL_STEP = (Math.sqrt(3) / 2) * HEXAGON_SIZE;
const VERTICAL_STEP = (3 / 4) * HEXAGON_SIZE;
const ODD_COLUMN_OFFSET = VERTICAL_STEP / 2;
const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 700;
const PROXIMITY_RADIUS = 175;
const VERTICAL_INSET = (VIEWBOX_HEIGHT -
  (HEXAGON_SIZE + (ROW_COUNT - 1) * VERTICAL_STEP + ODD_COLUMN_OFFSET)) /
  2;

const cells = Array.from({ length: COLUMN_COUNT * ROW_COUNT }, (_, index) => {
  const column = Math.floor(index / ROW_COUNT);
  const row = index % ROW_COUNT;

  return {
    id: `${column}-${row}`,
    x: column * HORIZONTAL_STEP,
    y: VERTICAL_INSET + row * VERTICAL_STEP +
      (column % 2 === 0 ? 0 : ODD_COLUMN_OFFSET),
  };
});

type HexGridProps = Omit<ComponentPropsWithoutRef<"svg">, "children">;

/**
 * A 72-cell, pointy-top honeycomb grid. The fixed SVG coordinate system keeps
 * its structural spacing intact while the SVG scales to its container.
 */
function HexGrid({ className, ...props }: HexGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const cellElementsRef = useRef(new Map<string, SVGSVGElement>());
  const activeCellsRef = useRef(new Map<SVGSVGElement, number>());
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);

  const updateProximity = useCallback(() => {
    frameRef.current = null;

    const svg = svgRef.current;
    const pointer = pointerRef.current;
    const matrix = svg?.getScreenCTM();

    if (!svg || !pointer || !matrix) {
      for (const element of activeCellsRef.current.keys()) {
        element.classList.remove("hex-grid__cell--nearby");
        element.style.removeProperty("--hex-proximity");
      }
      activeCellsRef.current.clear();
      return;
    }

    const screenPoint = svg.createSVGPoint();
    screenPoint.x = pointer.x;
    screenPoint.y = pointer.y;
    const cursor = screenPoint.matrixTransform(matrix.inverse());
    const nextActiveCells = new Map<SVGSVGElement, number>();

    for (const cell of cells) {
      const distance = Math.hypot(
        cursor.x - (cell.x + HEXAGON_SIZE / 2),
        cursor.y - (cell.y + HEXAGON_SIZE / 2),
      );

      if (distance >= PROXIMITY_RADIUS) continue;

      const element = cellElementsRef.current.get(cell.id);
      if (!element) continue;

      const intensity = 1 - distance / PROXIMITY_RADIUS;
      nextActiveCells.set(element, intensity);
      element.classList.add("hex-grid__cell--nearby");
      element.style.setProperty("--hex-proximity", intensity.toFixed(3));
    }

    for (const element of activeCellsRef.current.keys()) {
      if (nextActiveCells.has(element)) continue;
      element.classList.remove("hex-grid__cell--nearby");
      element.style.removeProperty("--hex-proximity");
    }

    activeCellsRef.current = nextActiveCells;
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(updateProximity);
    }
  }, [updateProximity]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      scheduleUpdate();
    },
    [scheduleUpdate],
  );

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = null;
    scheduleUpdate();
  }, [scheduleUpdate]);

  useEffect(() => {
    const svg = svgRef.current;
    const cellElements = cellElementsRef.current;
    if (!svg) return;

    for (const cell of cells) {
      const element = svg.querySelector<SVGSVGElement>(
        `[data-hex-grid-cell="${cell.id}"]`,
      );
      if (element) cellElements.set(cell.id, element);
    }

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      cellElements.clear();
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      className={cn("hex-grid", className)}
      focusable="false"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      preserveAspectRatio="xMidYMid meet"
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      {...props}
    >
      {cells.map((cell) => (
        <Hexagon
          key={cell.id}
          className="hex-grid__cell"
          data-hex-grid-cell={cell.id}
          size={HEXAGON_SIZE}
          x={cell.x}
          y={cell.y}
        />
      ))}
    </svg>
  );
}

export { HexGrid };
export type { HexGridProps };
