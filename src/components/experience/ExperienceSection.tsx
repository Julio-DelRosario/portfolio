"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { PROFESSIONAL_EXPERIENCE, LEADERSHIP_EXPERIENCE, Experience } from "@/data/experience";

const STAGGER_MS = 150;
const DURATION_S = 0.5;
const EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
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

function HexagonMarker() {
  return (
    <div className="experience__marker" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="experience__marker-svg">
        <polygon points="12 2 22 8 22 16 12 22 2 16 2 8" />
      </svg>
    </div>
  );
}

const ExperienceItem = ({ exp, index, offsetDelay = 0 }: { exp: Experience; index: number; offsetDelay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  // -40% top and -45% bottom creates a strict 15% window exactly in the middle of the screen
  const isInView = useInView(ref, { margin: "-40% 0px -45% 0px" });

  return (
  <motion.div
    ref={ref}
    className={`experience__item ${isInView ? "experience__item--active" : ""}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-10%" }}
    variants={fadeUp}
    custom={offsetDelay + index * STAGGER_MS}
  >
    <HexagonMarker />
    
    <div className="experience__item-content">
      <div className="experience__item-header">
        <div className="flex flex-wrap items-center gap-3">
          <span className="experience__item-period">{exp.period}</span>
        </div>
        <h3 className="experience__item-role">{exp.role}</h3>
        <p className="experience__item-org">{exp.organization}</p>
      </div>
      
      <div className="experience__item-body">
        {exp.description && <p className="experience__item-desc">{exp.description}</p>}
        
        <ul className="experience__item-contributions">
          {exp.contributions.map((contribution, i) => (
            <li key={i}>{contribution}</li>
          ))}
        </ul>
        
        {exp.technologies && exp.technologies.length > 0 && (
          <ul className="experience__item-tech">
            {exp.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </motion.div>
  );
};

export function ExperienceSection() {
  return (
    <section id="experience" className="experience site-section" aria-labelledby="experience-heading">
      <PageContainer>
        <div className="experience__grid">
          <motion.div
            className="experience__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 id="experience-heading" className="site-section__eyebrow">
              EXPERIENCE
            </h2>
          </motion.div>

          <div className="experience__content-area">
            {/* Professional Experience Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS}
              className="experience__intro-block"
            >
              <h3 className="text-2xl font-bold text-(--color-text-primary) mb-2">Professional Experience</h3>
            </motion.div>

            <div className="experience__timeline mb-16">
              <div className="experience__timeline-track" />
              {PROFESSIONAL_EXPERIENCE.map((exp, index) => (
                <ExperienceItem key={exp.id} exp={exp} index={index} offsetDelay={STAGGER_MS * 2} />
              ))}
            </div>

            {/* Leadership Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS}
              className="experience__intro-block"
            >
              <h3 className="text-2xl font-bold text-(--color-text-primary) mb-2">Leadership & Organizations</h3>
            </motion.div>

            <div className="experience__timeline">
              <div className="experience__timeline-track" />
              {LEADERSHIP_EXPERIENCE.map((exp, index) => (
                <ExperienceItem key={exp.id} exp={exp} index={index} offsetDelay={STAGGER_MS * 2} />
              ))}
            </div>
            
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
