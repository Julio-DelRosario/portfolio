const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Append the image container styles if they don't exist
if (!css.includes('.project-card__image-container')) {
  css += `

/* Project Side-by-Side Image Placeholder */
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
  console.log('CSS added');
} else {
  console.log('CSS already exists');
}
