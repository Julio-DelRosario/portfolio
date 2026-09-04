const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// 1. Reduce image max-width from 56rem to 42rem
css = css.replace(
  /\.project-card__image-container \{\s*width: 100%;\s*max-width: 56rem;/,
  '.project-card__image-container {\n  width: 100%;\n  max-width: 42rem;'
);

// 2. Reduce gap between image and text from space-12 to space-6
css = css.replace(
  /\.project-card-layout \{\s*display: flex;\s*flex-direction: column;\s*align-items: center;\s*gap: var\(--space-12\);/,
  '.project-card-layout {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--space-6);'
);

// 3. Reduce padding-top on selected-info from space-6 to space-4
css = css.replace(
  /\.projects__selected-info \{\s*min-height: 24rem;\s*\/\* Prevent layout jump \*\/\s*padding-top: var\(--space-6\);/,
  '.projects__selected-info {\n  min-height: 24rem; /* Prevent layout jump */\n  padding-top: var(--space-4);'
);

// 4. Reduce margin-bottom on navigator-wrapper from space-6 to space-2
css = css.replace(
  /\.projects__navigator-wrapper \{\s*margin-bottom: var\(--space-6\);/,
  '.projects__navigator-wrapper {\n  margin-bottom: var(--space-2);'
);

fs.writeFileSync('src/app/globals.css', css);
console.log('CSS updated successfully');
