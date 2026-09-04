#!/bin/bash
cat << 'TSX_EOF' > src/components/projects/ProjectsSection.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { PROJECTS, Project } from "@/data/projects";
import { ExternalLink, GitBranch, ImageIcon } from "lucide-react";

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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div className="project-card">
      <div className="project-card__image-container">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon className="w-8 h-8 text-[var(--color-text-tertiary)]" />
            <span className="project-card__image-placeholder-text">Image Placeholder</span>
          </div>
        )}
      </div>
      
      <div className="project-details">
        <header className="project-details__header">
          <p className="project-details__tag">PROJECT — {String(index + 1).padStart(2, "0")}</p>
          <h3 className="project-details__title">{project.title}</h3>
          <p className="project-details__role">{project.role}</p>
        </header>

        <div className="project-details__body">
          <p className="project-details__summary">{project.summary}</p>
          <p className="project-details__description">{project.description}</p>
          
          <ul className="project-details__tech">
            {project.technologies.map((tech) => (
              <li key={tech} className="project-details__tech-item">{tech}</li>
            ))}
          </ul>

          {project.links.length > 0 && (
            <div className="project-details__links">
              {project.links.map((link) => (
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
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "visible" : "hidden";

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(activeIndex);
  
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastInteractionTime = useRef<number>(Date.now());
  const wheelAccumulator = useRef<number>(0);
  const lastWheelTime = useRef<number>(Date.now());
  
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

  // Center the active hexagon by scrolling the grid container
  useEffect(() => {
    if (!scrollRef.current) return;
    const cx = getProjectCx(activeIndex);
    
    scrollRef.current.scrollTo({
      left: Math.max(0, cx),
      behavior: shouldReduceMotion ? "auto" : "smooth"
    });
  }, [activeIndex, getProjectCx, shouldReduceMotion]);

  // Perfect Wheel Hijack - Locks precisely when centered and releases at boundaries
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onWheel = (e: globalThis.WheelEvent) => {
      // Check if section is perfectly centered in viewport
      const rect = el.getBoundingClientRect();
      // Lock threshold: Top of section is near the top of the viewport
      const isLocked = rect.top > -50 && rect.top < 150;

      if (!isLocked) return; // Allow native page scroll to continue

      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime.current;
      lastWheelTime.current = now;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const isAtStart = activeIndexRef.current === 0;
        const isAtEnd = activeIndexRef.current === numProjects - 1;

        if (e.deltaY < 0 && isAtStart) {
          if (timeSinceLastWheel > 250) return; // Allow scroll up out of the section
          e.preventDefault(); // Absorb momentum
          return;
        }

        if (e.deltaY > 0 && isAtEnd) {
          if (timeSinceLastWheel > 250) return; // Allow scroll down out of the section
          e.preventDefault(); // Absorb momentum
          return;
        }

        // We are locked and navigating
        e.preventDefault();
        markInteraction();
        
        wheelAccumulator.current += e.deltaY;
        const THRESHOLD = 80;

        if (wheelAccumulator.current > THRESHOLD) {
          setActiveIndex((prev) => Math.min(prev + 1, numProjects - 1));
          wheelAccumulator.current = 0;
        } else if (wheelAccumulator.current < -THRESHOLD) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          wheelAccumulator.current = 0;
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [numProjects, markInteraction]);

  // TIMER FOR AUTOMATIC PROGRESSION
  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      const isAtEnd = activeIndexRef.current === numProjects - 1;
      
      const cooldown = isAtEnd ? 5500 : 2500; 
      
      if (Date.now() - lastInteractionTime.current > cooldown) {
        lastInteractionTime.current = Date.now();
        setActiveIndex((prev) => (prev + 1) % numProjects);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, numProjects]);

  return (
    <section ref={sectionRef} id="projects" className="projects site-section" aria-labelledby="projects-heading">
      <PageContainer>
        <div className="projects__grid">
          
          <motion.div
            className="projects__header"
            initial={initial}
            animate="visible"
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
              animate="visible"
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
              animate="visible"
              variants={fadeUp}
              custom={STAGGER_MS * 2}
            >
              <div 
                className="projects__navigator-scroll"
                ref={scrollRef}
                onClick={markInteraction}
                onTouchStart={markInteraction}
                style={{ padding: '0 50%', overflowX: 'hidden' }}
              >
                <div 
                  className="projects__navigator-canvas" 
                  style={{ width: totalWidth, height: totalHeight }}
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
                            setActiveIndex(i);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Holy Grail Fluid Grid Carousel */}
            <div className="projects__cards-viewport" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <div style={{ display: 'grid' }}>
                {PROJECTS.map((project, i) => {
                  const isActive = activeIndex === i;
                  const offset = i - activeIndex;
                  
                  return (
                    <motion.div
                      key={project.id}
                      style={{
                        gridArea: '1 / 1',
                        width: '80%', // Slightly wider to ensure content fits well
                        margin: '0 auto',
                        pointerEvents: isActive ? 'auto' : 'none',
                      }}
                      initial={false}
                      animate={{
                        x: `${offset * 105}%`,
                        opacity: isActive ? 1 : 0.3,
                        scale: isActive ? 1 : 0.95,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <ProjectCard project={project} index={i} />
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
TSX_EOF
