import { Section } from "@/components/layout/section";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section
        id="about"
        eyebrow="01"
        title="About"
        description="A short introduction will be added here."
      >
        <p>
          This space is reserved for a concise overview of the person and the
          kind of work they do.
        </p>
      </Section>

      <Section
        id="work"
        eyebrow="02"
        title="Selected work"
        description="Selected projects will be introduced here."
      >
        <p>
          Project details, outcomes, and supporting context will appear in a
          later phase.
        </p>
      </Section>

      <Section
        id="experience"
        eyebrow="03"
        title="Experience"
        description="Professional experience will be outlined here."
      >
        <p>
          Roles, responsibilities, and milestones will be added when the
          experience section is developed.
        </p>
      </Section>

      <Section
        id="contact"
        eyebrow="04"
        title="Contact"
        description="Contact details will be shared here."
      >
        <p>
          A direct way to get in touch will be provided in a later phase.
        </p>
      </Section>
    </main>
  );
}
