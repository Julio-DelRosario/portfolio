"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { PROJECTS } from "@/data/projects";
import { ExternalLink, GitBranch } from "lucide-react";

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

function ProjectLinkIcon({ type }: { type: string }) {
  if (type === "github") return <GitBranch className="w-4 h-4" />;
  return <ExternalLink className="w-4 h-4" />;
}

function NavigatorHexagon({
  index,
  isActive,
  title,
  onClick,
}: {
  index: number;
  isActive: boolean;
  title: string;
  onClick: () => void;
}) {
  const row = index % 2;
  const numberLabel = String(index + 1).padStart(2, "0");
  
  const pts = "41.569,0 83.138,24 83.138,72 41.569,96 0,72 0,24";

  return (
    <div className={`navigator-hex-group ${isActive ? "navigator-hex-group--active" : "navigator-hex-group--inactive"}`}>
      {row === 0 && (
        <div className="navigator-label navigator-label--top">
          <div className="navigator-label__text">{title}</div>
          <div className="navigator-label__line" />
        </div>
      )}

      <button
        className={`navigator-hex ${isActive ? "navigator-hex--active" : "navigator-hex--inactive"}`}
        onClick={onClick}
        aria-label={`Select Project ${numberLabel}`}
        aria-pressed={isActive}
      >
        <svg className="navigator-hex__svg" viewBox="-2 -2 87.138 100" style={{ overflow: "visible" }}>
          <polygon transform="translate(2, 2)" points={pts} className="navigator-hex__shape" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="navigator-hex__content">
          <span className="navigator-hex__label">{numberLabel}</span>
        </div>
      </button>

      {row === 1 && (
        <div className="navigator-label navigator-label--bottom">
          <div className="navigator-label__line" />
          <div className="navigator-label__text">{title}</div>
        </div>
      )}
    </div>
  );
}

export function ProjectsSection() {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "visible" : "hidden";

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(activeIndex);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastInteractionTime = useRef<number>(Date.now());
  
  const activeProject = PROJECTS[activeIndex] || PROJECTS[0];
  const numProjects = PROJECTS.length;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const R = 48;
  const W = R * Math.sqrt(3); 
  const H = 2 * R;            
  const SPACING_FACTOR = 1.08; 
  const labelHeight = 32;     
  
  const maxCol = Math.floor((numProjects - 1) / 2);
  const totalWidth = (maxCol * W + 0.5 * W) * SPACING_FACTOR + W * 1.5; 
  const totalHeight = (1.5 * R) * SPACING_FACTOR + H + labelHeight * 2;

  const getProjectCx = useCallback((index: number) => {
    const row = index % 2;
    const col = Math.floor(index / 2);
    const basePathX = col * W + (row === 1 ? 0.5 * W : 0);
    return basePathX * SPACING_FACTOR + 0.5 * W;
  }, [W, SPACING_FACTOR]);

  const markInteraction = useCallback(() => {
    lastInteractionTime.current = Date.now();
  }, []);

  // Sync scrollable grid to perfectly center the active hexagon
  useEffect(() => {
    if (!scrollRef.current) return;
    const cx = getProjectCx(activeIndex);
    const containerWidth = scrollRef.current.clientWidth;
    const targetScroll = cx - containerWidth / 2;
    
    scrollRef.current.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: shouldReduceMotion ? "auto" : "smooth"
    });
  }, [activeIndex, getProjectCx, shouldReduceMotion]);

  // Framer Motion Scroll Progress for Scroll-Pinning (Sticky)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    markInteraction();
    const clamped = Math.max(0, Math.min(1, latest));
    const newIdx = Math.round(clamped * (numProjects - 1));
    if (newIdx !== activeIndexRef.current) {
      setActiveIndex(newIdx);
    }
  });

  // Programmatically scroll the window to the correct fraction of the 350vh sticky section
  const scrollWindowToIndex = useCallback((index: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const scrollableY = sectionRef.current.offsetHeight - window.innerHeight;
    
    const targetY = absoluteTop + (index / (numProjects - 1)) * scrollableY;
    
    window.scrollTo({ top: targetY, behavior: shouldReduceMotion ? "auto" : "smooth" });
  }, [numProjects, shouldReduceMotion]);

  // Auto Progression (1.5 seconds)
  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      // 1.5 seconds elapsed since last interaction
      const isAtEnd = activeIndexRef.current === numProjects - 1;
      const cooldown = isAtEnd ? 4500 : 1500;
      if (Date.now() - lastInteractionTime.current > cooldown) {
        lastInteractionTime.current = Date.now();
        
        const nextIdx = (activeIndexRef.current + 1) % numProjects;
        
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          // Only auto-scroll the window if the section is actively pinned
          const isPinning = rect.top <= 0 && rect.bottom >= window.innerHeight;
          
          if (isPinning) {
            scrollWindowToIndex(nextIdx);
          } else {
            setActiveIndex(nextIdx);
          }
        } else {
          setActiveIndex(nextIdx);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, numProjects, scrollWindowToIndex]);

  return (
    <div ref={sectionRef} style={{ height: '350vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <section id="projects" className="projects site-section" aria-labelledby="projects-heading">
          <PageContainer>
            <div className="projects__grid">
              
              <motion.div
                className="projects__header"
                initial={initial}
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                variants={fadeUp}
                custom={0}
              >
                <h2 id="projects-heading" className="site-section__eyebrow">
                  PROJECTS
                </h2>
              </motion.div>

              <div className="projects__content-area">
                <motion.div
                  initial={initial}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={fadeUp}
                  custom={STAGGER_MS}
                  className="projects__intro-block"
                >
                  <p className="projects__statement">Things I&apos;ve built.</p>
                </motion.div>

                {/* Hexagon Navigator Area */}
                <motion.div 
                  className="projects__navigator-wrapper"
                  initial={initial}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={fadeUp}
                  custom={STAGGER_MS * 2}
                >
                  <div 
                    className="projects__navigator-scroll"
                    ref={scrollRef}
                    onClick={markInteraction}
                    onTouchStart={markInteraction}
                  >
                    <div 
                      className="projects__navigator-canvas" 
                      style={{ width: totalWidth, height: totalHeight, margin: '0 auto' }}
                    >
                      {PROJECTS.map((project, i) => {
                        const row = i % 2;
                        const cx = getProjectCx(i);
                        const cy = (row * 1.5 * R) * SPACING_FACTOR + labelHeight;
                        
                        const left = cx - 0.5 * W;
                        const top = cy;

                        return (
                          <div
                            key={project.id}
                            className="navigator-hex-container"
                            style={{ left, top, width: W, height: H }}
                          >
                            <NavigatorHexagon 
                              index={i} 
                              isActive={activeIndex === i}
                              title={project.title}
                              onClick={() => {
                                markInteraction();
                                scrollWindowToIndex(i);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Selected Project Information */}
                <div className="projects__selected-info">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProject.id}
                      className="project-details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <header className="project-details__header">
                        <p className="project-details__tag">SELECTED PROJECT — {String(activeIndex + 1).padStart(2, "0")}</p>
                        <h3 className="project-details__title">{activeProject.title}</h3>
                        <p className="project-details__role">{activeProject.role}</p>
                      </header>

                      <div className="project-details__body">
                        <p className="project-details__summary">{activeProject.summary}</p>
                        <p className="project-details__description">{activeProject.description}</p>
                        
                        <ul className="project-details__tech">
                          {activeProject.technologies.map((tech) => (
                            <li key={tech} className="project-details__tech-item">{tech}</li>
                          ))}
                        </ul>

                        {activeProject.links.length > 0 && (
                          <div className="project-details__links">
                            {activeProject.links.map((link) => (
                              <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-details__link"
                              >
                                <ProjectLinkIcon type={link.type} />
                                <span>{link.label}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
              </div>
            </div>
          </PageContainer>
        </section>
      </div>
    </div>
  );
}
