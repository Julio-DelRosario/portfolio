import { PageContainer } from "@/components/layout/page-container";

export function SiteFooter() {
  return (
    <footer className="py-8 sm:py-10">
      <PageContainer className="flex flex-col gap-3 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
        <p>Portfolio — more details coming soon.</p>
        <a className="footer-link" href="#main-content">
          Back to top
        </a>
      </PageContainer>
    </footer>
  );
}
