import { PageContainer } from "@/components/layout/page-container";

const navigationItems = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header border-b">
      <PageContainer className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3 sm:min-h-20">
        <a className="brand-link" href="#main-content" aria-label="Portfolio home">
          Portfolio
        </a>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-7">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a className="nav-link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageContainer>
    </header>
  );
}
