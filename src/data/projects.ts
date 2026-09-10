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
  contributions?: string[];
  overview?: string;
  achievements?: string[];
  status: "Live" | "In Development" | "Completed · Archived" | "Placeholder";
  links: ProjectLink[];
  imageUrl?: string;
  galleryImages?: string[];
  logoUrl?: string;
  logoStyle?: "monochrome" | "color";
};

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "ORAS",
    subtitle: "Online Reservation Assistant System",
    logoUrl: "/logo/ORAS-logo.svg",
    imageUrl: "/screenshots/oras/oras-landing-page.png",
    galleryImages: [
      "/screenshots/oras/oras-chatbot.png",
      "/screenshots/oras/oras-equipment-reservation.png",
      "/screenshots/oras/oras-facility-reservation.png",
      "/screenshots/oras/oras-admin.png",
    ],
    description: "A full-stack campus resource management system for PUP Parañaque, supporting facility reservations, equipment borrowing, faculty supplies, lost & found, and administrative workflows.",
    overview: "ORAS is a campus resource management system designed for PUP Parañaque to centralize facility and equipment reservations and other resource-related requests. Students and faculty can check availability and submit requests, while administrators can manage reservations and resources through dedicated workflows. The system includes conflict checking for facility reservations, equipment and supply management, Lost & Found tracking, analytics, and role-based access for different types of users. It also includes a Groq AI assistant that helps users with reservation policies, availability, and system-related queries.",
    role: "Fullstack Developer",
    technologies: ["React", "Laravel", "TailwindCSS", "PostgreSQL", "Groq AI", "DigitalOcean"],
    contributions: [
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
    imageUrl: "/screenshots/skillseed/skillseed-landing-page.jpeg",
    galleryImages: [
      "/screenshots/skillseed/skillseed-greenmissions.jpeg",
      "/screenshots/skillseed/skillseed-greenchallenges.jpeg",
      "/screenshots/skillseed/skillseed-greenskills.jpeg",
    ],
    description: "A platform connecting users with environmental opportunities, skills development, community challenges, and donation initiatives, developed during Developer Camp Manila 2026.", 
    overview: "SkillSeed is an environmental skills and opportunities platform developed during Developer Camp Manila 2026. The platform connects users with environmental jobs, projects, and organizations while encouraging them to develop relevant environmental skills through skills, badges, and community challenges. It also provides opportunities to support environmental organizations through donations. The project was built during the hackathon's 48-hour development period and later continued through a one-year fellowship with the organizers as the team works toward developing SkillSeed as a startup.",
    role: "Lead Developer & Product Lead",
    technologies: ["React", "TypeScript", "TailwindCSS", "Supabase", "Vercel"],
    contributions: [
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
    imageUrl: "/screenshots/beesharp/beesharp-landing-page.png",
    galleryImages: [
      "/screenshots/beesharp/beesharp-structuredoutline.png",
      "/screenshots/beesharp/beesharp-flashcard1.png",
      "/screenshots/beesharp/beesharp-flashcard2.png",
    ],
    description: "An AI-powered study companion that transforms uploaded learning materials into interactive study resources such as study packs, quizzes, and flashcards.",
    overview: "BeeSharp is an AI-powered study companion designed to help students turn their existing learning materials into interactive study resources. Users can upload documents such as PDFs, Word files, PowerPoint presentations, and text files, which are processed to generate study packs, summaries, key points, quizzes, and flashcards. The platform also includes interactive 3D flashcards, source attribution for generated content, and Word/PDF export functionality. Input sanitization and prompt-injection defenses were incorporated to make the AI features safer when processing user-provided content.",
    role: "Fullstack Developer",
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "Groq AI", "Vercel"],
    contributions: [
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
    imageUrl: "/screenshots/littlebylittle/littlebylittle-cover2.png",
    galleryImages: [
      "/screenshots/littlebylittle/littlebylittle-start.png",
      "/screenshots/littlebylittle/littlebylittle-module.png",
      "/screenshots/littlebylittle/littlebylittle-platform.png",
      "/screenshots/littlebylittle/littlebylittle-ending.png",

    ],
    description: "A collaborative 2D post-apocalyptic platformer developed for GameDev.js Jam 2026, featuring custom movement, physics, upgrades, and collectibles.",
    overview: "Little by Little is a collaborative 2D post-apocalyptic platformer developed for GameDev.js Jam 2026. The game features movement mechanics built around variable gravity and air mobility, including air dashing to give players greater control while navigating the environment. Players can also collect items and obtain upgrades through modular progression systems. The project was developed under the time constraints of a game jam, requiring the team to coordinate programming, art, and audio while maintaining a flexible codebase. The completed game remains playable through its itch.io page.",
    role: "Project Manager & Developer",
    technologies: ["Phaser 4", "Javascript", "Node.js", "Jira"],
    contributions: [
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
