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
      className="site-section scroll-mt-24 border-b py-16 sm:py-20 lg:py-28"
    >
      <PageContainer>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div>
            <p className="site-section__eyebrow">
              {eyebrow}
            </p>
            <h2
              id={headingId}
              className="site-section__title mt-3 sm:text-3xl"
            >
              {title}
            </h2>
          </div>
          <div className="site-section__content max-w-2xl space-y-5 sm:text-lg sm:leading-8">
            <p className="site-section__description">{description}</p>
            {children}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
