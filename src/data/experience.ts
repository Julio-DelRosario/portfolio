export type Experience = {
  id: string;
  period: string;
  role: string;
  organization: string;
  description: string;
  contributions: string[];
  technologies: string[];
};

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    period: "2024 - Present",
    role: "Senior Software Engineer",
    organization: "Tech Company Placeholder",
    description: "Led the development of a high-performance web application, focusing on architectural scalability and user experience.",
    contributions: [
      "Architected the migration from legacy systems to a modern Next.js stack, reducing load times by 40%.",
      "Mentored a team of 4 junior developers and established code review best practices.",
      "Implemented a comprehensive CI/CD pipeline using GitHub Actions."
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js"]
  },
  {
    id: "exp-2",
    period: "2021 - 2024",
    role: "Full-Stack Developer",
    organization: "Agency Placeholder",
    description: "Developed and maintained multiple client-facing applications across various industries.",
    contributions: [
      "Built resilient REST APIs serving over 50,000 requests per minute.",
      "Integrated third-party payment gateways and authentication providers.",
      "Collaborated closely with designers to ensure pixel-perfect implementations."
    ],
    technologies: ["React", "Express", "MongoDB", "Tailwind CSS"]
  },
  {
    id: "exp-3",
    period: "2019 - 2021",
    role: "Front-End Developer",
    organization: "Startup Placeholder",
    description: "Founding engineering team member responsible for the initial product launch.",
    contributions: [
      "Developed the initial MVP responsive web application.",
      "Established the core design system and component library.",
      "Optimized application state management."
    ],
    technologies: ["JavaScript", "React", "CSS", "Firebase"]
  }
];
