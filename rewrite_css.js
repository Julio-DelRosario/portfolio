const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Replace .project-details grid layout with flex centered layout
css = css.replace(
/\.project-details \{[\s\S]*?\}\s*@media \(min-width: 48rem\) \{[\s\S]*?\.project-details \{[\s\S]*?\}\s*\}/,
`.project-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 42rem;
  margin: 0 auto;
  gap: var(--space-8);
}`
);

// Add align-items: center to header
css = css.replace(
/\.project-details__header \{\s*display: flex;\s*flex-direction: column;\s*gap: var\(--space-2\);\s*\}/,
`.project-details__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}`
);

// Add justify-content: center to tech
css = css.replace(
/\.project-details__tech \{\s*display: flex;\s*flex-wrap: wrap;\s*gap: var\(--space-2\) var\(--space-3\);\s*list-style: none;\s*padding: 0;\s*margin: 0 0 var\(--space-6\);\s*\}/,
`.project-details__tech {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2) var(--space-3);
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6);
}`
);

// Add justify-content: center to links
css = css.replace(
/\.project-details__links \{\s*display: flex;\s*gap: var\(--space-6\);\s*\}/,
`.project-details__links {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
}`
);

// Append the new Image Placeholder classes
css += `

/* Project Image Placeholder */
.project-card-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
  width: 100%;
}

.project-card__image-container {
  width: 100%;
  max-width: 56rem;
  aspect-ratio: 16 / 9;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.project-card__image-placeholder-text {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: var(--space-2);
}
`;

fs.writeFileSync('src/app/globals.css', css);
