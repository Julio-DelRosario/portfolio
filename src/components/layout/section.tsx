import type { ReactNode } from "react";

import { PageContainer } from "@/components/layout/page-container";

type SectionProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  id: string;
  title: string;
};

export function Section({
  children,
  description,
  eyebrow,
  id,
  title,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-24 border-b border-black/10 py-16 sm:py-20 lg:py-28"
    >
      <PageContainer>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div>
            <p className="text-sm font-medium tracking-[0.08em] text-black/55">
              {eyebrow}
            </p>
            <h2
              id={headingId}
              className="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl"
            >
              {title}
            </h2>
          </div>
          <div className="max-w-2xl space-y-5 text-base leading-7 text-black/70 sm:text-lg sm:leading-8">
            <p className="font-medium text-black/90">{description}</p>
            {children}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
