
"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { 
  Atom, Triangle, FileCode2, FileJson, Wind, Paintbrush, 
  Box, Code, Database, GitBranch, Cloud, Zap, Flame, Cpu,
  Server
} from "lucide-react";

type HexNode = {
  id: string;
  label?: string;
  type: "category" | "skill";
  category?: string;
  col: number;
  row: number;
  icon?: React.ElementType;
};

// Pointy-topped hex math
const RADIUS = 110; 
const W = Math.sqrt(3) * RADIUS;
const H = 2 * RADIUS;
const ROW_HEIGHT = 1.5 * RADIUS;

function getHexPath(r: number) {
  let path = "";
  for (let i = 0; i < 6; i++) {
    const angle = (60 * i - 30) * (Math.PI / 180);
    const x = (r * Math.cos(angle)).toFixed(3);
    const y = (r * Math.sin(angle)).toFixed(3);
    path += i === 0 ? `M ${x},${y} ` : `L ${x},${y} `;
  }
  return path + "Z";
}
const HEX_PATH = getHexPath(RADIUS - 2);

const ACTIVE_NODES: HexNode[] = [
  // CORE
  { id: 'Frontend', label: 'Frontend', type: 'category', category: 'Frontend', col: 0, row: 0 },
  { id: 'Backend', label: 'Backend', type: 'category', category: 'Backend', col: -0.5, row: 1 },
  { id: 'Tools', label: 'Tools', type: 'category', category: 'Tools', col: 0.5, row: 1 },

  // FRONTEND BRANCH
  { id: 'React', label: 'React', type: 'skill', category: 'Frontend', col: -0.5, row: -1, icon: Atom },
  { id: 'Next.js', label: 'Next.js', type: 'skill', category: 'Frontend', col: 0.5, row: -1, icon: Triangle },
  { id: 'Tailwind', label: 'Tailwind CSS', type: 'skill', category: 'Frontend', col: -1, row: -2, icon: Wind },
  { id: 'CSS', label: 'CSS', type: 'skill', category: 'Frontend', col: 0, row: -2, icon: Paintbrush },
  { id: 'TypeScript', label: 'TypeScript', type: 'skill', category: 'Frontend', col: 1, row: -2, icon: FileCode2 },
  { id: 'JavaScript', label: 'JavaScript', type: 'skill', category: 'Frontend', col: -0.5, row: -3, icon: FileJson },

  // BACKEND BRANCH
  { id: 'PHP', label: 'PHP', type: 'skill', category: 'Backend', col: -1.5, row: 1, icon: Code },
  { id: 'Laravel', label: 'Laravel', type: 'skill', category: 'Backend', col: -1, row: 2, icon: Box },
  { id: 'PostgreSQL', label: 'PostgreSQL', type: 'skill', category: 'Backend', col: -2, row: 2, icon: Database },
  { id: 'MySQL', label: 'MySQL', type: 'skill', category: 'Backend', col: -2.5, row: 1, icon: Server },

  // TOOLS BRANCH
  { id: 'Git', label: 'Git', type: 'skill', category: 'Tools', col: 1.5, row: 1, icon: GitBranch },
  { id: 'Vercel', label: 'Vercel', type: 'skill', category: 'Tools', col: 1, row: 2, icon: Triangle },
  { id: 'Supabase', label: 'Supabase', type: 'skill', category: 'Tools', col: 2.5, row: 1, icon: Zap },
  { id: 'AWS', label: 'AWS', type: 'skill', category: 'Tools', col: 2, row: 2, icon: Cloud },
  { id: 'Firebase', label: 'Firebase', type: 'skill', category: 'Tools', col: 3.5, row: 1, icon: Flame },
  { id: 'Groq', label: 'Groq', type: 'skill', category: 'Tools', col: 3, row: 2, icon: Cpu },
];

const SKILL_NODES = [...ACTIVE_NODES];

export function SkillsGrid() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { allNodes, viewBox } = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    SKILL_NODES.forEach(n => {
      const x = n.col * W;
      const y = n.row * ROW_HEIGHT;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });

    const paddingX = W * 0.8; // Decrease X padding to enlarge hexagons
    const paddingTop = 20; // Very tight top padding to eliminate empty space
    const paddingBottom = 40; // Tight bottom padding

    const width = maxX - minX + W + paddingX * 2;
    const height = maxY - minY + H + paddingTop + paddingBottom;

    return { 
      allNodes: SKILL_NODES.map(n => ({ 
        ...n, 
        x: Number((n.col * W).toFixed(3)), 
        y: Number((n.row * ROW_HEIGHT).toFixed(3)) 
      })), 
      viewBox: { 
        width: Number(width.toFixed(3)), 
        height: Number(height.toFixed(3)), 
        cx: Number((-minX + W * 0.5 + paddingX).toFixed(3)), 
        cy: Number((-minY + H * 0.5 + paddingTop).toFixed(3)) 
      } 
    };
  }, []);

  return (
    <div className="skills-grid-wrapper relative w-full max-w-full mx-auto">
      <div className="hidden md:block">
        <svg 
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`} 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setHoveredCategory(null)}
          role="img"
          aria-label="Interactive skill tree visualization"
        >
          {allNodes.map((node, i) => {
            const isCategory = node.type === 'category';
            const isSkill = node.type === 'skill';
            const isActive = hoveredCategory === node.category ;
            const isFaded = hoveredCategory && !isActive ;

            let fillColor = "rgba(0, 0, 0, 0)";
            let strokeColor = "var(--color-border-subtle)";
            let textColor = "var(--color-text-secondary)";
            let opacity = 1;

            if (isCategory) {
              fillColor = "var(--color-accent)";
              strokeColor = "var(--color-accent)";
              textColor = "var(--color-background)";
            } else {
              fillColor = "rgba(255, 255, 255, 0.02)"; 
              strokeColor = "var(--color-border-strong)"; 
              
              if (isActive) {
                fillColor = "rgba(224, 169, 109, 0.12)";
                strokeColor = "var(--color-accent)";
                textColor = "var(--color-text-primary)";
              }
              if (isFaded) opacity = 0.5;
            }

            const Icon = node.icon;

            return (
              <g key={node.id} transform={`translate(${(viewBox.cx + node.x).toFixed(3)}, ${(viewBox.cy + node.y).toFixed(3)})`}>
                <motion.g 
                  variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: { 
                      scale: 1, 
                      opacity: 1,
                      transition: { 
                        type: "spring", 
                        stiffness: 250, 
                        damping: 20, 
                        delay: shouldReduceMotion ? 0 : 0.6 + (i * 0.1) 
                      }
                    }
                  }}
                >
                  <motion.g
                    animate={{
                      opacity: opacity,
                      scale: isActive && !isCategory && !shouldReduceMotion ? 1.05 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => node.category && setHoveredCategory(node.category)}
                    onFocus={() => node.category && setHoveredCategory(node.category)}
                    onBlur={() => setHoveredCategory(null)}
                    style={{ cursor: node.category ? 'pointer' : 'default', outline: 'none' }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${node.label} (${node.category} category)`}
                  >
                    <motion.path 
                      d={HEX_PATH}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isActive ? 2 : 1.5}
                      animate={{
                        fill: fillColor,
                        stroke: strokeColor,
                        strokeWidth: isActive ? 2 : 1.5
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {isSkill && Icon && (
                      <g style={{ color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)", transition: "color 0.3s ease" }}>
                        <Icon x="-20" y="-32" width="40" height="40" strokeWidth={isActive ? 1.5 : 1.25} style={{ pointerEvents: 'none' }} />
                      </g>
                    )}

                    <text 
                        textAnchor="middle" 
                        alignmentBaseline="middle"
                        fill={textColor}
                        fontSize={isCategory ? "26px" : "22px"}
                        fontWeight={isCategory ? "700" : "600"}
                        letterSpacing={isCategory ? "0.05em" : "normal"}
                        y={isCategory ? 0 : 38}
                        style={{ pointerEvents: 'none', transition: 'fill 0.3s ease' }}
                      >
                        {node.label}
                      </text>
                  </motion.g>
                </motion.g>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="md:hidden flex flex-col gap-6 mt-8 w-full max-w-md mx-auto">
        {[
          {
            category: 'Frontend',
            skills: SKILL_NODES.filter(n => n.type === 'skill' && n.category === 'Frontend')
          },
          {
            category: 'Backend',
            skills: SKILL_NODES.filter(n => n.type === 'skill' && n.category === 'Backend')
          },
          {
            category: 'Tools',
            skills: SKILL_NODES.filter(n => n.type === 'skill' && n.category === 'Tools')
          }
        ].map((group) => (
          <div key={group.category} className="bg-(--color-surface) border border-(--color-border-subtle) rounded-2xl p-6">
            <h3 className="text-(--color-accent) font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-(--color-accent) inline-block" />
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map(skill => {
                const Icon = skill.icon;
                return (
                  <div key={skill.id} className="flex items-center gap-2 bg-white/5 border border-(--color-border-strong) rounded-lg px-3 py-2 text-sm text-(--color-text-primary)">
                    {Icon && <Icon className="w-4 h-4 text-(--color-text-secondary)" />}
                    {skill.label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
