"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";

const STAGGER_MS = 100;
const DURATION_S = 0.6;
const EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (customDelay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_S,
      ease: EASE,
      delay: customDelay / 1000,
    },
  }),
};

function HexIcon() {
  return (
    <svg 
      width="14" 
      height="12" 
      viewBox="0 0 14 12" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      aria-hidden="true"
    >
      <path 
        d="M3.5 1H10.5L13 6L10.5 11H3.5L1 6L3.5 1Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "visible" : "hidden";
  
  return (
    <section id="about" className="about site-section" aria-labelledby="about-heading">
      <PageContainer>
        <div className="about__grid">
          
          {/* Eyebrow / Section Title */}
          <motion.div 
            className="about__header"
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 id="about-heading" className="site-section__eyebrow">
              ABOUT
            </h2>
          </motion.div>

          {/* Main Content Area */}
          <div className="about__content-area">
            <motion.p 
              className="about__statement"
              initial={initial}
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS}
            >
              I like building things that are useful, not just impressive.
            </motion.p>
            
            <motion.p 
              className="about__description"
              initial={initial}
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS * 2}
            >
              I focus on solving real problems through clean architecture and thoughtful product design. 
              Software shouldn&apos;t just work—it should make sense for the people using it and the systems supporting it.
            </motion.p>
            
            {/* Supporting Attributes */}
            <motion.div 
              className="about__focus-list"
              initial={initial}
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS * 3}
            >
              <div className="about__focus-item">
                <span className="about__focus-icon"><HexIcon /></span>
                <div>
                  <h3 className="about__focus-title">Full-Stack Engineering</h3>
                  <p className="about__focus-desc">End-to-end development focused on scalable, maintainable architecture.</p>
                </div>
              </div>
              
              <div className="about__focus-item">
                <span className="about__focus-icon"><HexIcon /></span>
                <div>
                  <h3 className="about__focus-title">Product-Minded</h3>
                  <p className="about__focus-desc">Aligning technical decisions with user needs and practical business outcomes.</p>
                </div>
              </div>

              <div className="about__focus-item">
                <span className="about__focus-icon"><HexIcon /></span>
                <div>
                  <h3 className="about__focus-title">Systems & Cloud</h3>
                  <p className="about__focus-desc">Building resilient infrastructure and practical deployment pipelines.</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </PageContainer>
    </section>
  );
}

