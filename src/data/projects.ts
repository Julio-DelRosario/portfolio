export type ProjectLink = {
  label: string;
  url: string;
  type: "github" | "demo" | "case-study";
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
  role: string;
  technologies: string[];
  details?: string[];
  status: "Live" | "In Development" | "Archived" | "Placeholder";
  links: ProjectLink[];
  imageUrl?: string;
  featured?: boolean;
};

// 10 Placeholders as requested for the navigator grid
export const PROJECTS: Project[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `project-${i + 1}`,
  title: `Project ${String(i + 1).padStart(2, '0')}`,
  summary: "Short explanation of the problem and solution.",
  description: "Placeholder description explaining what was built and the technical approach. Keep it concise but technically meaningful.",
  role: i === 0 ? "Lead Developer" : "Full-Stack Developer",
  technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  status: "Placeholder",
  links: [
    { label: "GitHub", url: "#", type: "github" },
    { label: "Live Demo", url: "#", type: "demo" }
  ],
  featured: i === 0
}));
