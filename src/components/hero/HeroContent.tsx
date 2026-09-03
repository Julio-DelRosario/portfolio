"use client";

/**
 * HeroContent.tsx
 *
 * Editorial hero composition with a five-level typographic hierarchy:
 *
 *   1. Name        — largest, boldest → immediate personal identity
 *   2. Role        — small accent label → establishes profession
 *   3. Tagline     — medium secondary headline → value proposition
 *   4. Description — quiet body copy → supporting detail
 *   5. Actions     — CTAs
 *
 * Animations are fully disabled when prefers-reduced-motion is active.
 */

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Animation configuration
// ---------------------------------------------------------------------------

const STAGGER_MS = 90;
const DURATION_S = 0.6;
const EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_S,
      ease: EASE,
      delay: delay / 1000,
    },
  }),
};

const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_S,
      ease: EASE,
      delay: delay / 1000,
    },
  }),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroContent() {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "visible" : "hidden";
  const animate = "visible";

  return (
    <div className="hero__copy">
      {/* ---- 1. Name — dominant identity ---- */}
      <motion.h1
        id="hero-heading"
        className="hero__name"
        variants={fadeUp}
        initial={initial}
        animate={animate}
        custom={0}
      >
        Julio Del Rosario
      </motion.h1>

      {/* ---- 2. Role — profession label ---- */}
      <motion.p
        className="hero__role"
        variants={fadeUpSmall}
        initial={initial}
        animate={animate}
        custom={STAGGER_MS}
      >
        Full-Stack Developer
      </motion.p>

      {/* ---- Accent divider ---- */}
      <motion.hr
        className="hero__divider"
        aria-hidden="true"
        variants={fadeUpSmall}
        initial={initial}
        animate={animate}
        custom={STAGGER_MS * 1.5}
      />

      {/* ---- 3. Tagline — value proposition ---- */}
      <motion.p
        className="hero__tagline"
        variants={fadeUp}
        initial={initial}
        animate={animate}
        custom={STAGGER_MS * 2}
      >
        I build software with intention.
      </motion.p>

      {/* ---- 4. Description — supporting detail ---- */}
      <motion.p
        className="hero__description"
        variants={fadeUpSmall}
        initial={initial}
        animate={animate}
        custom={STAGGER_MS * 2.5}
      >
        Full-stack developer focused on building useful, thoughtful, and
        technically solid digital products.
      </motion.p>

      {/* ---- 5. Actions ---- */}
      <motion.div
        className="hero__actions"
        aria-label="Hero actions"
        variants={fadeUpSmall}
        initial={initial}
        animate={animate}
        custom={STAGGER_MS * 3}
      >
        <a className="ds-button ds-button--primary ds-button--lg" href="#work">
          View my work
        </a>
        <a
          className="ds-button ds-button--secondary ds-button--lg"
          href="#contact"
        >
          Contact me
        </a>
      </motion.div>
    </div>
  );
}
