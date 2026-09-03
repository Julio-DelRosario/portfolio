#!/bin/bash
# Remove everything below /* Projects Section */
sed -i '/\/\* Projects Section \*\//,$d' src/app/globals.css

# Append the new Projects section CSS
cat << 'CSS_EOF' >> src/app/globals.css
/* --------------------------------------------------------------------------- */
/* Projects Section (Interactive Honeycomb) */
/* --------------------------------------------------------------------------- */

.projects {
  position: relative;
}

.projects__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  padding: clamp(5rem, 12vh, 8rem) 0;
}

@media (min-width: 48rem) {
  .projects__grid {
    grid-template-columns: 1fr 3fr;
    gap: var(--space-12);
  }
}

.projects__intro-block {
  margin-bottom: var(--space-12);
}

.projects__statement {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.15;
  letter-spacing: -0.03em;
  text-wrap: balance;
  margin: 0 0 var(--space-4);
}

.projects__intro {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 38rem;
  margin: 0;
}

/* Navigator Layout */
.projects__navigator-wrapper {
  margin-bottom: var(--space-12);
  position: relative;
}

/* Fades for horizontal edges */
.projects__navigator-wrapper::before,
.projects__navigator-wrapper::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2rem;
  z-index: 10;
  pointer-events: none;
}

.projects__navigator-wrapper::before {
  left: 0;
  background: linear-gradient(to right, var(--color-background), transparent);
}

.projects__navigator-wrapper::after {
  right: 0;
  background: linear-gradient(to left, var(--color-background), transparent);
}

.projects__navigator-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
  scroll-behavior: smooth; /* Base smooth scroll, controlled by React for active */
  padding: var(--space-4) 0;
}

.projects__navigator-scroll::-webkit-scrollbar {
  display: none; /* WebKit */
}

.projects__navigator-canvas {
  position: relative;
  /* Width and height are set inline by React */
}

.navigator-hex-container {
  position: absolute;
  /* Width/Height/Top/Left set inline by React */
}

/* Individual Hexagon Button */
.navigator-hex {
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  outline: none;
}

.navigator-hex:focus-visible {
  transform: scale(1.05);
}

.navigator-hex__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.navigator-hex__shape {
  fill: var(--color-surface);
  stroke: var(--color-border-subtle);
  stroke-width: 1px;
  transition: fill 0.3s ease, stroke 0.3s ease, filter 0.3s ease;
}

/* Hover state for inactive */
.navigator-hex--inactive:hover .navigator-hex__shape {
  stroke: var(--color-text-secondary);
  fill: var(--color-surface-raised);
}

/* Active State */
.navigator-hex--active {
  z-index: 10;
}

.navigator-hex--active .navigator-hex__shape {
  fill: var(--color-accent);
  stroke: var(--color-accent);
  stroke-width: 2px;
  filter: drop-shadow(0 0 12px rgba(244, 180, 0, 0.4));
}

/* Label Inside */
.navigator-hex__content {
  position: relative;
  z-index: 2;
}

.navigator-hex__label {
  font-family: monospace;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-tertiary);
  transition: color 0.3s ease;
}

.navigator-hex--active .navigator-hex__label {
  color: var(--color-background); /* Dark text on amber fill */
}

.navigator-hex--inactive:hover .navigator-hex__label {
  color: var(--color-text-primary);
}

/* Project Details (Information below navigator) */
.projects__selected-info {
  min-height: 24rem; /* Prevent layout jump */
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border-subtle);
}

.project-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 48rem) {
  .project-details {
    grid-template-columns: 1fr 1.5fr;
    gap: var(--space-12);
  }
}

.project-details__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.project-details__tag {
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  margin: 0;
  text-transform: uppercase;
}

.project-details__title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.1;
}

.project-details__role {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.project-details__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.project-details__summary {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.project-details__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0 0 var(--space-4);
}

.project-details__tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6);
}

.project-details__tech-item {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
}

.project-details__tech-item:not(:last-child)::after {
  content: "·";
  color: var(--color-border-strong);
  margin-left: var(--space-3);
}

.project-details__links {
  display: flex;
  gap: var(--space-6);
}

.project-details__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.project-details__link:hover {
  color: var(--color-accent);
}
CSS_EOF
chmod +x update-css.sh
./update-css.sh
