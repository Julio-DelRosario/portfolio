import { HeroContent } from "@/components/hero/HeroContent";
import { HoneycombCanvas } from "@/components/hero/HoneycombCanvas";
import { PageContainer } from "@/components/layout/page-container";
import { AboutSection } from "@/components/about/AboutSection";
import { SkillsSection } from "@/components/skills/SkillsSection";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-heading">
        <HoneycombCanvas />

        <PageContainer className="hero__container">
          <HeroContent />
        </PageContainer>

        <div className="hero__bottom-fade" aria-hidden="true" />
      </section>

      <AboutSection />
      <SkillsSection />
    </main>
  );
}
