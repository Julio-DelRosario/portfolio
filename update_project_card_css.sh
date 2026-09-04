#!/bin/bash
cat << 'CSS_EOF' >> src/app/globals.css

/* Project Card & Carousel */
.projects__cards-viewport {
  overflow: hidden;
  width: 100%;
  padding-bottom: var(--space-8);
}

.projects__cards-track {
  display: flex;
  gap: 5%;
  padding-left: 15%; /* centers the 70% width card */
}

.project-card-wrapper {
  min-width: 70%;
  flex-shrink: 0;
  will-change: transform, opacity;
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.project-card__image-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--color-surface);
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

@media (min-width: 64rem) {
  .project-card {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
    gap: var(--space-8);
  }
  
  .project-card .project-details {
    grid-template-columns: 1fr; /* stack header and body vertically */
    padding-top: 0;
    border-top: none;
  }
}
CSS_EOF
