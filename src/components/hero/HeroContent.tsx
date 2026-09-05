"use client";

/**
 * HeroContent.tsx
 *
 * Wraps the hero copy (name, headline, description, CTAs) with Framer Motion
 * entrance animations. Each element fades in and slides up with a staggered
 * delay for a natural cascade effect.
 *
 * Animations are fully disabled when prefers-reduced-motion is active.
 */

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Animation configuration
// ---------------------------------------------------------------------------

const STAGGER_MS = 80;
const DURATION_S = 0.6;
const EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
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

const fadeSlideUpSmall: Variants = {
  hidden: { opacity: 0, y: 12 },
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
      <motion.p
        className="hero__name"
        variants={fadeSlideUpSmall}
        initial={initial}
        animate={animate}
        custom={0}
      >
        Julio del Rosario
      </motion.p>

      <motion.h1
        id="hero-heading"
        className="hero__headline"
        variants={fadeSlideUp}
        initial={initial}
        animate={animate}
        custom={STAGGER_MS}
      >
        Building considered digital experiences.
      </motion.h1>

      <motion.p
        className="hero__description"
        variants={fadeSlideUpSmall}
        initial={initial}
        animate={animate}
        custom={STAGGER_MS * 2}
      >
        I am a software engineer who turns ambitious ideas into clear,
        dependable products — where thoughtful systems meet purposeful
        interfaces.
      </motion.p>

      <motion.div
        className="hero__actions"
        aria-label="Hero actions"
        variants={fadeSlideUpSmall}
        initial={initial}
        animate={animate}
        custom={STAGGER_MS * 3}
      >
        <a className="ds-button ds-button--primary ds-button--lg" href="#work">
          View selected work
        </a>
        <a
          className="ds-button ds-button--secondary ds-button--lg"
          href="#contact"
        >
          Start a conversation
        </a>
      </motion.div>
    </div>
  );
}

