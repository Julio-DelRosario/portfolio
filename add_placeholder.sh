#!/bin/bash
cat << 'CSS_EOF' >> src/app/globals.css

/* Project Image Placeholder additions */
.project-card-layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 64rem) {
  .project-card-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
    align-items: start;
  }
}

.project-card__image-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--color-surface-alt, #1a1e24);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.project-card__image-placeholder-text {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
CSS_EOF
