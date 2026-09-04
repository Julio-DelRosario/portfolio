const fs = require('fs');

let tsx = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

const navStart = tsx.indexOf('{/* Hexagon Navigator Area */}');
const selectedInfoStart = tsx.indexOf('{/* Selected Project Information */}');

if (navStart === -1 || selectedInfoStart === -1) {
  console.error("Could not find start tokens.");
  process.exit(1);
}

const originalNavBlock = tsx.substring(navStart, selectedInfoStart);

// We need to inject the wrapper and the image placeholder
let newNavBlock = originalNavBlock.replace(
  '{/* Hexagon Navigator Area */}',
  `<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', marginBottom: '3rem', justifyContent: 'center' }}>
                  {/* Hexagon Navigator Area */}`
);

// We find the closing tag of the originalNavBlock by taking everything up to the last </div> before selectedInfoStart
// Actually, it's easier to just match `</motion.div>\n\n                {/* Selected Project Information */}`
newNavBlock = newNavBlock.replace(
  /<\/motion\.div>\s*$/,
  `</motion.div>

                  {/* Image Placeholder Beside Navigator */}
                  <motion.div
                    initial={initial}
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={fadeUp}
                    custom={STAGGER_MS * 3}
                    style={{ flex: '1 1 300px', maxWidth: '500px' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProject.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="project-card__image-container">
                          {activeProject.imageUrl ? (
                            <img src={activeProject.imageUrl} alt={activeProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span className="project-card__image-placeholder-text">Project Screenshot</span>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>\n\n                `
);

tsx = tsx.substring(0, navStart) + newNavBlock + tsx.substring(selectedInfoStart);
fs.writeFileSync('src/components/projects/ProjectsSection.tsx', tsx);
console.log('TSX rewritten successfully');
