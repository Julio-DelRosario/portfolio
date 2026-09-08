export type ProjectLink = {
  label: string;
  url: string;
  type: "github" | "demo" | "case-study";
};

export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  role: string;
  technologies: string[];
  details?: string[];
  achievements?: string[];
  status: "Live" | "In Development" | "Completed · Archived" | "Placeholder";
  links: ProjectLink[];
  imageUrl?: string;
  imagePosition?: string;
  logoUrl?: string;
  logoStyle?: "monochrome" | "color";
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "ORAS",
    subtitle: "Online Reservation Assistant System",
    logoUrl: "/logo/ORAS-logo.svg",
    imageUrl: "/screenshots/oras-landing-page.png",
    description: "A full-stack campus resource management system for PUP Parañaque, supporting facility reservations, equipment borrowing, faculty supplies, lost & found, and administrative workflows.",
    role: "Fullstack Developer",
    technologies: ["React", "Laravel", "TailwindCSS", "PostgreSQL", "Groq AI", "DigitalOcean"],
    details: [
      "Implemented core features using React and TypeScript.",
      "Developed and managed PostgreSQL database.",
      "Implemented facility reservation and conflict checking.",
      "Built equipment reservation/supply inventory management system.",
      "Integrated Groq AI assistant for users with reservation policies, availability, and system-related queries.",
    ],
    status: "Completed · Archived",
    links: [ { label: "GitHub", url: "https://github.com/Julio-DelRosario/Project-ORAS-Online-Reservation-System", type: "github" } ],
  },
  {
    id: "project-2",
    title: "SkillSeed",
    subtitle: "Environmental Skills and Opportunities Platform",
    logoUrl: "/logo/SkillSeed-logo.svg",
    imageUrl: "/screenshots/skillseed-landing-page.jpeg",
    description: "A platform connecting users with environmental opportunities, skills development, community challenges, and donation initiatives, developed during Developer Camp Manila 2026.", 
    role: "Lead Developer & Product Lead",
    technologies: ["React", "TypeScript", "TailwindCSS", "Supabase", "Vercel"],
    details: [
      "Lead the initial product idea and development",
      "Developed core application logic",
      "Developed and managed Supabase database",
      "Deployed the application on Vercel",
      "Contributed to product direction and feature planning after the hackathon",
    ],
    achievements: ["Dev Camp Manila 2026 - Future of Work Track Winner"],
    status: "In Development",
    links: [ 
      { label: "GitHub", url: "https://github.com/SkillSeedClimate/SkillSeed", type: "github" },
      { label: "Demo", url: "https://skill-seed-climate-learning-website.vercel.app/", type: "demo" }
     ]

  },
  {
    id: "project-3",
    title: "BeeSharp",
    subtitle: "AI Study Buddy",
    logoUrl: "/logo/BeeSharp-logo.svg",
    imageUrl: "/screenshots/beesharp-landing-page.png",
    description: "An AI-powered study companion that transforms uploaded learning materials into interactive study resources such as study packs, quizzes, and flashcards.",
    role: "Fullstack Developer",
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "Groq AI", "Vercel"],
    details: [
      "Designed and developed the frontend and backend",
      "Integrated Groq AI for AI-powered study resources",
      "Implemented document upload and processing features",
      "Developed interactive 3D flashcards",
      "Implemented input sanitization and prompt-injection defenses",
    ],
    status: "Live",
    links: [ 
      { label: "GitHub", url: "https://github.com/Julio-DelRosario/bee-sharp-app", type: "github" },
      { label: "Demo", url: "https://beesharp-ai.vercel.app/", type: "demo" }
     ]  },
  {
    id: "project-4",
    title: "Little by Little",
    logoStyle: "monochrome",
    subtitle: "2D Post-Apocalyptic Platformer Game",
    logoUrl: "/logo/LittleByLittle-sprite.svg",
    imageUrl: "/screenshots/littlebylittle-cover2.png",
    description: "A collaborative 2D post-apocalyptic platformer developed for GameDev.js Jam 2026, featuring custom movement, physics, upgrades, and collectibles.",
    role: "Project Manager & Developer",
    technologies: ["Phaser 4", "Javascript", "Node.js", "Jira"],
    details: [
      "Managed project tasks and tracked development using Jira",
      "Developed and tuned custom player movement and physics",
      "Developed modular upgrade and collectible systems",
      "Worked on browser performance and development workflows",
      "Helped maintain a flexible codebase under the jam's time constraints",
    ],
    achievements: ["GameDev.js Jam 2026 - #99 Overall / 484 Entries · #17 Graphics"],    
    status: "Live",
    links: [ 
      { label: "GitHub", url: "https://github.com/ReiiiBriii/Little-by-Little", type: "github" },
      { label: "Demo", url: "https://itch.io/jam/gamedevjs-2026/rate/4515255", type: "demo" }
     ]  },
];
