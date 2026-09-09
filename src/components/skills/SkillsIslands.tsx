"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

type SkillIslandProps = {
  title: string;
  skills: string[];
  delayOffset: number;
};

// Math for pointy-topped hex
const RADIUS = 45;
const W = Math.sqrt(3) * RADIUS;
const H = 2 * RADIUS;

function getHexPath(r: number) {
  let path = "";
  for (let i = 0; i < 6; i++) {
    const angle = (60 * i - 30) * (Math.PI / 180);
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    path += i === 0 ? `M ${x},${y} ` : `L ${x},${y} `;
  }
  return path + "Z";
}

const HEX_PATH = getHexPath(RADIUS - 2);

const POSITIONS_6 = [
  { dx: -W / 2, dy: -1.5 * RADIUS }, // TL
  { dx: W / 2, dy: -1.5 * RADIUS },  // TR
  { dx: W, dy: 0 },                  // R
  { dx: W / 2, dy: 1.5 * RADIUS },   // BR
  { dx: -W / 2, dy: 1.5 * RADIUS },  // BL
  { dx: -W, dy: 0 },                 // L
];

const POSITIONS_3 = [
  { dx: -W, dy: 0 },                 // L
  { dx: W / 2, dy: -1.5 * RADIUS },  // TR
  { dx: W / 2, dy: 1.5 * RADIUS },   // BR
];

function HoneycombIsland({ title, skills, delayOffset }: SkillIslandProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  
  const isHovered = hovered !== null;
  const positions = skills.length === 3 ? POSITIONS_3 : POSITIONS_6;

  // viewBox size to fit a 3-radius cluster
  // W is ~78, max dx is W, max dy is 1.5R (67.5). 
  // We need enough space so edges don't clip.
  const svgWidth = W * 4;
  const svgHeight = H * 3.5;
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;

  return (
    <div 
      className="skills-island" 
      style={{ width: '100%', maxWidth: '300px', margin: '0 auto', aspectRatio: '1/1' }}
      onMouseLeave={() => setHovered(null)}
    >
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        
        {/* Draw Center Node */}
        <g transform={`translate(${cx}, ${cy})`}>
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: delayOffset }}
          >
            <motion.path 
              d={HEX_PATH}
              fill="var(--color-surface)"
              stroke="var(--color-accent)"
              strokeWidth={2}
            />
            <text 
              textAnchor="middle" 
              alignmentBaseline="middle"
              fill="var(--color-accent)"
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.05em"
              style={{ pointerEvents: 'none' }}
            >
              {title}
            </text>
          </motion.g>
        </g>

        {/* Draw Skill Nodes */}
        {skills.map((skill, i) => {
          const pos = positions[i];
          if (!pos) return null; // safety
          
          const isActive = hovered === skill;
          const isFaded = isHovered && !isActive;

          return (
            <g key={skill} transform={`translate(${cx + pos.dx}, ${cy + pos.dy})`}>
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: isFaded ? 0.4 : 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: delayOffset + 0.1 + (i * 0.05) }}
                animate={{
                  opacity: isFaded ? 0.4 : 1,
                  scale: isActive ? 1.08 : 1,
                }}
                onMouseEnter={() => setHovered(skill)}
                style={{ cursor: 'pointer' }}
              >
                <motion.path 
                  d={HEX_PATH}
                  fill={isActive ? "rgba(224, 169, 109, 0.15)" : "var(--color-surface)"}
                  stroke={isActive ? "var(--color-accent)" : "var(--color-border-subtle)"}
                  strokeWidth={isActive ? 2 : 1.5}
                  transition={{ duration: 0.2 }}
                />
                <text 
                  textAnchor="middle" 
                  alignmentBaseline="middle"
                  fill={isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)"}
                  fontSize="11px"
                  fontWeight="500"
                  style={{ pointerEvents: 'none', transition: 'fill 0.2s ease' }}
                >
                  {skill}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SkillsIslands() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
      <HoneycombIsland 
        title="FRONTEND" 
        skills={["CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"]} 
        delayOffset={0.1} 
      />
      
      <HoneycombIsland 
        title="BACKEND" 
        skills={["Laravel", "PostgreSQL", "MySQL"]} 
        delayOffset={0.3} 
      />
      
      <HoneycombIsland 
        title="TOOLS & APIs" 
        skills={["Git", "Supabase", "Firebase", "Vercel", "AWS", "Groq"]} 
        delayOffset={0.5} 
      />
    </div>
  );
}
