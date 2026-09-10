export type Experience = {
  id: string;
  period: string;
  role: string;
  organization: string;
  description?: string;
  contributions: string[];
  technologies?: string[];
};

export const PROFESSIONAL_EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    period: "Mar 2026 - June 2026",
    role: "IT Intern / On-the-Job Trainee",
    organization: "Parañaque City Government - IT Development Department",
    contributions: [
      "Managed appointments and encoded data within the LGU administrative portal.",
      "Performed data QA by cross-referencing physical IDs against encoded system records to ensure high data integrity.",
      "Provided technical troubleshooting and onboarding support for non-technical users."
    ],
    technologies: []
  }
];

export const LEADERSHIP_EXPERIENCE: Experience[] = [
  {
    id: "lead-1",
    period: "Nov 2025 - Present",
    role: "Treasurer",
    organization: "AWS Cloud Club - Celestia",
    contributions: [
      "Managed budgeting and documentation for technical workshops.",
      "Assisted in organizing and supporting AWS-focused technical events and activities for student members."
    ],
    technologies: []
  },
  {
    id: "lead-2",
    period: "Oct 2025 - July 2026",
    role: "Auditor",
    organization: "Building Bytes Guild (Game Development Club)",
    contributions: [
      "Reviewed financial records and helped monitor organizational expenses.",
      "Supported planning and coordination of game development activities.",
      "Helped maintain accurate documentation for organizational transactions and activities."
    ],
    technologies: []
  },
  {
    id: "lead-3",
    period: "Oct 2024 - July 2025",
    role: "Vice President",
    organization: "Association of Information and Communications Technology Students",
    contributions: [
      "Co-led the executive board in planning and coordinating IT-related student events.",
      "Delegated tasks across the organization to support effective event execution and student participation."
    ],
    technologies: []
  }
];
