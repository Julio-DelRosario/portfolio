import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <PageContainer>
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-lg mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Project Not Found
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              The project you are looking for does not exist or has been removed.
            </p>
          </div>
          <Link
            href="/#projects"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)]"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}

