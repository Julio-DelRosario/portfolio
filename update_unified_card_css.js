const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Remove old project-card-layout and image placeholders at the end of the file
const startIdx = css.indexOf('/* Project Image Placeholder */');
if (startIdx !== -1) {
  css = css.substring(0, startIdx);
}

// Add the new Unified Project Card styles
css += `
/* Unified Project Card Carousel */
.unified-project-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  width: 100%;
}

.unified-project-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--color-surface-raised);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.unified-project-card__placeholder-text {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: var(--space-2);
}

.unified-project-card__content {
  display: flex;
  flex-direction: column;
  padding: var(--space-6) var(--space-6);
  gap: var(--space-6);
}

@media (min-width: 48rem) {
  .unified-project-card__content {
    padding: var(--space-8) var(--space-10);
  }
}

.unified-project-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.unified-project-card__tag {
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  margin: 0;
  text-transform: uppercase;
}

.unified-project-card__title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.1;
}

.unified-project-card__role {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.unified-project-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.unified-project-card__summary {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.unified-project-card__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0;
}

.unified-project-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
  list-style: none;
  padding: 0;
  margin: var(--space-4) 0 0 0;
}

.unified-project-card__tech-item {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
}

.unified-project-card__tech-item:not(:last-child)::after {
  content: "·";
  color: var(--color-border-strong);
  margin-left: var(--space-3);
}

.unified-project-card__links {
  display: flex;
  gap: var(--space-6);
  margin-top: var(--space-2);
}

.unified-project-card__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.unified-project-card__link:hover {
  color: var(--color-accent);
}
`;

// Also clean up the old .project-details replacements if they exist
css = css.replace(/\.project-details \{\s*display: flex;\s*flex-direction: column;\s*align-items: center;[\s\S]*?\}\s*\}/g, '');

fs.writeFileSync('src/app/globals.css', css);
console.log('CSS updated successfully');
