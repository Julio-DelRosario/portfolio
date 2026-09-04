const fs = require('fs');

let tsx = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

const startIndex = tsx.indexOf('{/* Selected Project Information */}');
if (startIndex === -1) {
    console.error("Could not find start index");
    process.exit(1);
}

// Find the closing </div> of projects__selected-info block by matching indentation
// It's easier to just match until exactly before "</div>\n                \n              </div>"
const endToken = '                \n              </div>\n            </div>\n          </PageContainer>';
const endIndex = tsx.indexOf(endToken, startIndex);

if (endIndex === -1) {
    console.error("Could not find end index");
    process.exit(1);
}

const replacement = `{/* Selected Project Information (Carousel) */}
                <div className="projects__selected-info" style={{ position: 'relative', overflow: 'hidden', padding: '1rem 0' }}>
                  <div style={{ display: 'grid' }}>
                    {PROJECTS.map((project, index) => {
                      const offset = index - activeIndex;
                      const isActive = index === activeIndex;

                      return (
                        <motion.div
                          key={project.id}
                          style={{
                            gridArea: '1 / 1',
                            width: '100%',
                            maxWidth: '44rem',
                            margin: '0 auto',
                            pointerEvents: isActive ? 'auto' : 'none',
                          }}
                          initial={false}
                          animate={{
                            x: \`\${offset * 105}%\`,
                            scale: isActive ? 1 : 0.95,
                            opacity: isActive ? 1 : 0.4,
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <div className="unified-project-card">
                            <div className="unified-project-card__image">
                              {project.imageUrl ? (
                                <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span className="unified-project-card__placeholder-text">Project Screenshot</span>
                              )}
                            </div>
                            <div className="unified-project-card__content">
                              <header className="unified-project-card__header">
                                <p className="unified-project-card__tag">SELECTED PROJECT — {String(index + 1).padStart(2, "0")}</p>
                                <h3 className="unified-project-card__title">{project.title}</h3>
                                <p className="unified-project-card__role">{project.role}</p>
                              </header>
                              <div className="unified-project-card__body">
                                <p className="unified-project-card__summary">{project.summary}</p>
                                <p className="unified-project-card__description">{project.description}</p>
                                <ul className="unified-project-card__tech">
                                  {project.technologies.map((tech) => (
                                    <li key={tech} className="unified-project-card__tech-item">{tech}</li>
                                  ))}
                                </ul>
                                {project.links.length > 0 && (
                                  <div className="unified-project-card__links">
                                    {project.links.map((link) => (
                                      <a
                                        key={link.label}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="unified-project-card__link"
                                      >
                                        <ProjectLinkIcon type={link.type} />
                                        <span>{link.label}</span>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
`;

tsx = tsx.substring(0, startIndex) + replacement + tsx.substring(endIndex);

// Also remove `activeProject` if it's no longer used
tsx = tsx.replace(/const activeProject = PROJECTS\[activeIndex\] \|\| PROJECTS\[0\];\n/, '');

fs.writeFileSync('src/components/projects/ProjectsSection.tsx', tsx);
console.log("TSX replaced successfully");
