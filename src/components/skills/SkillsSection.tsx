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

type SkillCategory = {
  title: string;
  skills: string[];
};

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    title: "Backend",
    skills: ["Node.js", "REST APIs"],
  },
  {
    title: "Cloud & Tools",
    skills: ["Git", "GitHub", "Linux", "Vercel"],
  },
];

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
            viewport={{ once: true, margin: "-10%" }}
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
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUp}
              custom={STAGGER_MS}
            >
              Tools I use to build things.
            </motion.p>

            <div className="skills__categories">
              {SKILL_CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.title}
                  className="skills__category"
                  initial={initial}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={fadeUp}
                  custom={STAGGER_MS * (2 + index)}
                >
                  <h3 className="skills__category-title">{category.title}</h3>
                  <ul className="skills__list">
                    {category.skills.map((skill) => (
                      <li key={skill} className="skills__item">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

