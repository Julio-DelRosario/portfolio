"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { SkillsGrid } from "./SkillsGrid";

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

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "visible" : "hidden";

  return (
    <section id="skills" className="skills site-section" aria-labelledby="skills-heading">
      <PageContainer>
        <div className="skills__grid">
          
          <motion.div
            className="skills__header"
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <h2 id="skills-heading" className="site-section__eyebrow">
              SKILLS
            </h2>
          </motion.div>

          <div className="skills__content-area">
            <motion.p
              className="skills__statement"
              initial={initial}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={STAGGER_MS}
            >
              Tools I use to build things.
            </motion.p>
            
            <motion.div 
              className="w-full md:w-[120%] md:ml-[-10%]"
              initial={initial}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={STAGGER_MS * 4}
            >
              <SkillsGrid />
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
