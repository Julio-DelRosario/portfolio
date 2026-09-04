const fs = require('fs');
let code = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

const oldBlock = `<motion.div
                      key={activeProject.id}
                      className="project-details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <header className="project-details__header">`;

const newBlock = `<motion.div
                      key={activeProject.id}
                      className="project-card-layout"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="project-card__image-container">
                        {activeProject.imageUrl ? (
                          <img src={activeProject.imageUrl} alt={activeProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span className="project-card__image-placeholder-text">Project Screenshot</span>
                        )}
                      </div>

                      <div className="project-details">
                        <header className="project-details__header">`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  // We need to close the extra div
  code = code.replace(
    /<\/div>\s*<\/motion\.div>\s*<\/AnimatePresence>/,
    '</div>\n                      </div>\n                    </motion.div>\n                  </AnimatePresence>'
  );
  fs.writeFileSync('src/components/projects/ProjectsSection.tsx', code);
  console.log('Success');
} else {
  console.log('Failed to find oldBlock');
}
