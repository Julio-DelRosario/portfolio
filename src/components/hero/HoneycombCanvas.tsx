"use client";

/**
 * HoneycombCanvas.tsx
 *
 * Renders the full-bleed honeycomb background on a <canvas> element.
 * Owns: canvas sizing, HiDPI scaling, the animation loop, pointer events,
 * and ambient animation scheduling.
 *
 * Pointer tracking uses window-level listeners so the interaction works
 * even when hero text content overlaps the canvas.
 */

import { useCallback, useEffect, useRef } from "react";

import {
  computePulseIntensities,
  computeTwinkleIntensities,
  createTwinkles,
  isPulseComplete,
  mergeIntensityMaps,
  startPulse,
} from "@/components/hero/honeycomb-ambient";
import type { PulseState, TwinkleEntry } from "@/components/hero/honeycomb-ambient";
import { generateHoneycombGrid } from "@/components/hero/honeycomb-grid";
import { computeProximity } from "@/components/hero/honeycomb-interaction";
import { drawHoneycomb } from "@/components/hero/honeycomb-renderer";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ACTIVATION_RADIUS_FACTOR = 3.5;
const RESIZE_DEBOUNCE_MS = 200;

// Ambient timing
const PULSE_COOLDOWN_MIN_MS = 6000;
const PULSE_COOLDOWN_MAX_MS = 9000;
const TWINKLE_INTERVAL_MIN_MS = 3000;
const TWINKLE_INTERVAL_MAX_MS = 5000;

function randomInterval(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HoneycombCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef(generateHoneycombGrid(1, 1));
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number>(0);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  // Ambient state refs
  const pulseRef = useRef<PulseState | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const twinklesRef = useRef<TwinkleEntry[]>([]);
  const twinkleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef(false);

  // ---- Build / rebuild grid for current canvas size ----
  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    gridRef.current = generateHoneycombGrid(rect.width, rect.height);
  }, []);

  // ---- Lifecycle ----
  useEffect(() => {
    mountedRef.current = true;
    buildGrid();

    // -- Reduced motion --
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => {
      reducedMotionRef.current = motionQuery.matches;
      if (motionQuery.matches) {
        pointerRef.current = null;
      }
    };
    motionQuery.addEventListener("change", handleMotionChange);
    handleMotionChange();

    // -- Pointer tracking at window level --
    const handlePointerMove = (e: PointerEvent) => {
      if (reducedMotionRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const inBounds =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inBounds) {
        pointerRef.current = { x: e.clientX, y: e.clientY };
      } else {
        pointerRef.current = null;
      }
    };

    const handlePointerLeave = () => {
      pointerRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    // Clear when cursor leaves the browser window entirely
    document.addEventListener("pointerleave", handlePointerLeave);

    // -- Ambient pulse scheduling --
    function schedulePulse() {
      if (!mountedRef.current) return;
      if (reducedMotionRef.current) {
        pulseTimerRef.current = setTimeout(
          schedulePulse,
          randomInterval(PULSE_COOLDOWN_MIN_MS, PULSE_COOLDOWN_MAX_MS),
        );
        return;
      }
      const grid = gridRef.current;
      if (grid && isPulseComplete(pulseRef.current, performance.now())) {
        pulseRef.current = startPulse(grid, performance.now());
      }
      pulseTimerRef.current = setTimeout(
        schedulePulse,
        randomInterval(PULSE_COOLDOWN_MIN_MS, PULSE_COOLDOWN_MAX_MS),
      );
    }
    // First pulse after a short delay so the page feels calm on load
    pulseTimerRef.current = setTimeout(schedulePulse, 2500);

    // -- Ambient twinkle scheduling --
    function scheduleTwinkle() {
      if (!mountedRef.current) return;
      if (!reducedMotionRef.current) {
        const grid = gridRef.current;
        if (grid) {
          const newTwinkles = createTwinkles(grid, performance.now());
          twinklesRef.current = [...twinklesRef.current, ...newTwinkles];
        }
      }
      twinkleTimerRef.current = setTimeout(
        scheduleTwinkle,
        randomInterval(TWINKLE_INTERVAL_MIN_MS, TWINKLE_INTERVAL_MAX_MS),
      );
    }
    twinkleTimerRef.current = setTimeout(scheduleTwinkle, 1500);

    // -- Animation loop --
    function loop() {
      if (!mountedRef.current) return;

      const canvas = canvasRef.current;
      const grid = gridRef.current;
      if (!canvas || !grid) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const now = performance.now();

      // Cursor proximity
      let cursorMap: Map<number, number>;
      const pointer = pointerRef.current;
      if (pointer) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = pointer.x - rect.left;
        const canvasY = pointer.y - rect.top;
        cursorMap = computeProximity(
          grid.cells,
          canvasX,
          canvasY,
          grid.cellRadius * ACTIVATION_RADIUS_FACTOR,
        );
      } else {
        cursorMap = new Map();
      }

      // Ambient pulse
      const pulseMap = computePulseIntensities(pulseRef.current, now);

      // Ambient twinkles
      const { intensities: twinkleMap, active: activeTwinkles } =
        computeTwinkleIntensities(twinklesRef.current, now);
      twinklesRef.current = activeTwinkles;

      // Merge all intensity sources (cursor wins via max)
      const activeMap = mergeIntensityMaps(cursorMap, pulseMap, twinkleMap);

      drawHoneycomb(ctx, grid, activeMap);

      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);

    // -- Resize --
    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(buildGrid, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", handleResize);

    // -- Cleanup --
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(frameRef.current);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      if (twinkleTimerRef.current) clearTimeout(twinkleTimerRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="honeycomb-canvas"
    />
  );
}
