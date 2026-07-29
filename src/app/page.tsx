import { PageContainer } from "@/components/layout/page-container";
import { HexGrid } from "@/components/ui/hex-grid";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-heading">
        <PageContainer className="hero__container">
          <div className="hero__copy">
            <p className="hero__name">Julio del Rosario</p>
            <h1 id="hero-heading" className="hero__headline">
              Building considered digital experiences.
            </h1>
            <p className="hero__description">
              I am a software engineer who turns ambitious ideas into clear,
              dependable products — where thoughtful systems meet purposeful
              interfaces.
            </p>
            <div className="hero__actions" aria-label="Hero actions">
              <a className="ds-button ds-button--primary ds-button--lg" href="#work">
                View selected work
              </a>
              <a className="ds-button ds-button--secondary ds-button--lg" href="#contact">
                Start a conversation
              </a>
            </div>
          </div>

          <div className="hero__hex-grid-slot" aria-hidden="true">
            <HexGrid />
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
