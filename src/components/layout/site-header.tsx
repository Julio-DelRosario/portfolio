import { PageContainer } from "@/components/layout/page-container";
import { FileText } from "lucide-react";
import { CONTACT_DATA } from "@/data/contact";


const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.6 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.5 5.5 0 0 0-.1 3.8 5.5 5.5 0 0 0-1.5 3.8c0 4.9 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const navigationItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header border-b sticky top-0 z-50 bg-(--color-canvas)/90 backdrop-blur-md">
      <PageContainer className="grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-y-4 py-3 min-h-16 sm:min-h-20">
        <div className="flex justify-start">
          <a className="brand-link" href="#main-content" aria-label="Julio's — home">
            Julio&apos;s
          </a>
        </div>

        <nav aria-label="Primary navigation" className="order-3 lg:order-2 col-span-2 lg:col-span-1 flex justify-center w-full">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a className="nav-link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="flex items-center justify-end gap-3 sm:gap-4 order-2 lg:order-3">
          <a href={CONTACT_DATA.socials[0].url} target="_blank" rel="noopener noreferrer" className="text-(--color-text-tertiary) hover:text-(--color-accent) transition-colors" aria-label="GitHub">
            <GithubIcon className="w-5 h-5" />
          </a>
          <a href={CONTACT_DATA.socials[1].url} target="_blank" rel="noopener noreferrer" className="text-(--color-text-tertiary) hover:text-(--color-accent) transition-colors" aria-label="LinkedIn">
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-(--color-text-primary) hover:text-(--color-accent) transition-colors border border-(--color-border-subtle) rounded-full px-4 py-1.5 hover:border-(--color-accent)">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Resume</span>
          </a>
        </div>
      </PageContainer>
    </header>
  );
}
