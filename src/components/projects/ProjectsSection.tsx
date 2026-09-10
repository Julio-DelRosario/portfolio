"use client";
import Image from "next/image";
import Link from "next/link";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { PROJECTS } from "@/data/projects";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "../icons/CustomIcons";

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
  if (type === "github") return <GithubIcon className="w-4 h-4" />;
  return <ExternalLink className="w-4 h-4" />;
}

import { ProjectNavigator } from "./ProjectNavigator";


export function ProjectsSection() {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "visible" : "hidden";

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(activeIndex);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const infoScrollRef = useRef<HTMLDivElement>(null);
  const lastInteractionTime = useRef<number>(0);
  
  const activeProject = PROJECTS[activeIndex] || PROJECTS[0];
  const numProjects = PROJECTS.length;

  useEffect(() => {
    lastInteractionTime.current = Date.now();
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    if (infoScrollRef.current) {
      infoScrollRef.current.scrollTop = 0;
    }
  }, [activeIndex]);

  const markInteraction = useCallback(() => {
    lastInteractionTime.current = Date.now();
  }, []);

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

  // Auto Progression (5 seconds)
  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      // 5 seconds elapsed since last interaction
      const isAtEnd = activeIndexRef.current === numProjects - 1;
      const cooldown = isAtEnd ? 12000 : 10000;
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
            <div className="projects__grid" style={{ padding: "0 0" }}>
              
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

              <div className="projects__content-area" style={{ minWidth: 0, overflow: 'hidden' }}>
                <motion.div
                  initial={initial}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={fadeUp}
                  custom={STAGGER_MS}
                  className="projects__intro-block"
                >
                  <p className="projects__statement">What I&apos;ve built.</p>
                </motion.div>

                


                {/* Top: Honeycomb Navigation */}
                <div className="w-full max-w-full" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', minWidth: 0 }}>
                  {/* Hexagon Navigator Area */}
                <motion.div 
                  className="projects__navigator-wrapper w-full max-w-full" style={{ margin: 0, minWidth: 0 }}
                  initial={initial}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={fadeUp}
                  custom={STAGGER_MS * 2}
                  onClick={markInteraction}
                  onTouchStart={markInteraction}
                >
                  <ProjectNavigator
                    projects={PROJECTS}
                    activeIndex={activeIndex}
                    onProjectSelect={(i) => {
                      markInteraction();
                      scrollWindowToIndex(i);
                    }}
                  />
                </motion.div>
                </div>

                {/* Bottom: Two-Column Layout */}
                <div className="projects__selected-info" ref={infoScrollRef}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProject.id}
                      className="project-details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Left Column: Project Information */}
                      <div className="project-details__info" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <header className="project-details__header">
                          <p className="project-details__tag">SELECTED PROJECT — {String(activeIndex + 1).padStart(2, "0")}</p>
                          <h3 className="project-details__title">{activeProject.title}</h3>
                          {activeProject.subtitle && (
                            <h4 className="project-details__subtitle">{activeProject.subtitle}</h4>
                          )}
                          {activeProject.achievements && activeProject.achievements.length > 0 && (
                            <div className="project-details__achievements" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {activeProject.achievements.map((achievement, idx) => (
                                  <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.4 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                                      <circle cx="12" cy="8" r="6"/>
                                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                                    </svg>
                                    <span>{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </header>
                        
                        {/* Divider */}
                        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', margin: '0' }} />

                        <div className="project-details__body" style={{ gap: "0.5rem" }}>
                          <p className="project-details__description" style={{ marginBottom: 0 }}>{activeProject.description}</p>
                          
                          

                        </div>
                      </div>
                      
                      {/* Right Column: Visual + Details */}
                      <div className="project-details__media" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="project-card__image-container" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', minHeight: 'auto', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                          {activeProject.imageUrl ? (
                            <Image 
                              src={activeProject.imageUrl} 
                              alt={activeProject.title} 
                              fill
                              style={{ objectFit: 'contain' }}
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority
                            />
                          ) : (
                            <span className="project-card__image-placeholder-text">Project Screenshot</span>
                          )}
                        </div>
                        
                        <div className="project-details__meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                          
                          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <Link 
                              href={`/projects/${activeProject.id}`}
                              className="project-details__view-more"
                            >
                              View Project Details
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem', transition: 'transform 0.2s' }}>
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                              </svg>
                            </Link>
                          </div>


                        </div>
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
