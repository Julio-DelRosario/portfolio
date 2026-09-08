"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { EXPERIENCES } from "@/data/experience";

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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS}
              className="experience__intro-block"
            >
              <p className="experience__statement">My professional path.</p>
            </motion.div>

            <div className="experience__timeline">
              <div className="experience__timeline-track" />
              
              {EXPERIENCES.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="experience__item"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={fadeUp}
                  custom={STAGGER_MS * 2 + index * STAGGER_MS}
                >
                  <HexagonMarker />
                  
                  <div className="experience__item-content">
                    <div className="experience__item-header">
                      <span className="experience__item-period">{exp.period}</span>
                      <h3 className="experience__item-role">{exp.role}</h3>
                      <p className="experience__item-org">{exp.organization}</p>
                    </div>
                    
                    <div className="experience__item-body">
                      <p className="experience__item-desc">{exp.description}</p>
                      
                      <ul className="experience__item-contributions">
                        {exp.contributions.map((contribution, i) => (
                          <li key={i}>{contribution}</li>
                        ))}
                      </ul>
                      
                      <ul className="experience__item-tech">
                        {exp.technologies.map((tech) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
