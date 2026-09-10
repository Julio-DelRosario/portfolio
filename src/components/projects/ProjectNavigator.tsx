"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { Project } from "@/data/projects";

function LockedHexagon() {
  const pts = "41.569,0 83.138,24 83.138,72 41.569,96 0,72 0,24";
  return (
    <div className="navigator-hex-group" style={{ opacity: 1, pointerEvents: 'none' }}>
      <div className="navigator-hex">
        <svg className="navigator-hex__svg" viewBox="-2 -2 87.138 100" style={{ overflow: "visible" }}>
          <polygon transform="translate(2, 2)" points={pts} style={{ fill: 'rgba(255, 255, 255, 0.02)', stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

function NavigatorHexagon({
  index,
  isActive,
  title,
  logoUrl,
  logoStyle = 'monochrome',
  onClick,
}: {
  index: number;
  isActive: boolean;
  title: string;
  logoUrl?: string;
  logoStyle?: "monochrome" | "color";
  onClick: () => void;
}) {
  const row = index % 2;
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
        aria-label={`Select Project ${title}`}
        aria-pressed={isActive}
      >
        <svg className="navigator-hex__svg" viewBox="-2 -2 87.138 100" style={{ overflow: "visible" }}>
          <polygon transform="translate(2, 2)" points={pts} className="navigator-hex__shape" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="navigator-hex__content">
          {logoUrl ? (
            logoStyle === 'color' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={logoUrl} 
                alt={`${title} logo`} 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  objectFit: 'contain',
                  filter: isActive ? 'none' : 'grayscale(100%) opacity(0.6)',
                  transition: 'filter 0.3s ease'
                }} 
              />
            ) : (
              <div 
                className="navigator-hex__logo"
                aria-label={`${title} logo`}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  WebkitMaskImage: `url(${logoUrl})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: `url(${logoUrl})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }} 
              />
            )
          ) : (
            <span className="navigator-hex__label" style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700 }}>
              {title.charAt(0)}
            </span>
          )}
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

export function ProjectNavigator({
  projects,
  activeIndex,
  onProjectSelect,
}: {
  projects: Project[];
  activeIndex: number;
  onProjectSelect: (index: number) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const numProjects = projects.length;

  const R = 48;
  const W = R * Math.sqrt(3); 
  const H = 2 * R;            
  const SPACING_FACTOR = 1.0; 
  const labelHeight = 32;     
  
  const renderHexCount = Math.max(9, numProjects);

  const getProjectCx = useCallback((index: number) => {
    const row = index % 2;
    const col = Math.floor(index / 2);
    const basePathX = col * W + (row === 1 ? 0.5 * W : 0);
    return basePathX * SPACING_FACTOR + 0.5 * W;
  }, [W, SPACING_FACTOR]);

  const maxRightEdge = Math.max(
    getProjectCx(renderHexCount - 1) + 0.5 * W,
    renderHexCount > 1 ? getProjectCx(renderHexCount - 2) + 0.5 * W : 0
  );

  const totalWidth = maxRightEdge; 
  const totalHeight = (1.5 * R) * SPACING_FACTOR + H + labelHeight * 2;

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

  return (
    <div className="w-full max-w-full" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', minWidth: 0 }}>
      <div 
        className="projects__navigator-scroll w-full overflow-x-auto overflow-y-hidden"
        ref={scrollRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div 
          className="projects__navigator-canvas" 
          style={{ width: totalWidth, height: totalHeight, margin: '0 auto', position: 'relative' }}
        >
          {Array.from({ length: renderHexCount }).map((_, i) => {
            const project = projects[i];
            const row = i % 2;
            const cx = getProjectCx(i);
            const cy = (row * 1.5 * R) * SPACING_FACTOR + labelHeight;
            
            const left = cx - 0.5 * W;
            const top = cy;

            return (
              <div
                key={project ? project.id : `locked-${i}`}
                className="navigator-hex-container"
                style={{ left, top, width: W, height: H, position: 'absolute' }}
              >
                {project ? (
                  <NavigatorHexagon 
                    index={i} 
                    isActive={activeIndex === i}
                    title={project.title}
                    logoUrl={project.logoUrl}
                    logoStyle={project.logoStyle}
                    onClick={() => onProjectSelect(i)}
                  />
                ) : (
                  <LockedHexagon />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

