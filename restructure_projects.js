const fs = require('fs');

let file = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

// The file currently has:
// 1. <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', marginBottom: '3rem', justifyContent: 'center' }}>
// 2.   Hexagon Navigator Wrapper
// 3.   Image Placeholder
// 4. </div>
// 5. Selected Project Information

// We will split the file by searching for specific markers.

const startTopContainer = `<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', marginBottom: '3rem', justifyContent: 'center' }}>`;
const startImagePlaceholder = `{/* Image Placeholder Beside Navigator */}`;
const endTopContainer = `</div>\n\n                {/* Selected Project Information */}`;
const startSelectedInfo = `{/* Selected Project Information */}`;
const endOfSelectedInfo = `</AnimatePresence>\n                </div>\n                \n              </div>`;

// 1. Extract the parts
const beforeTopContainer = file.substring(0, file.indexOf(startTopContainer));
const topContainerContent = file.substring(file.indexOf(startTopContainer), file.indexOf(startImagePlaceholder));
const imagePlaceholderCode = file.substring(file.indexOf(startImagePlaceholder), file.indexOf(endTopContainer));
const selectedInfoCode = file.substring(file.indexOf(startSelectedInfo), file.indexOf(endOfSelectedInfo) + `</AnimatePresence>\n                </div>`.length);
const afterSelectedInfo = file.substring(file.indexOf(endOfSelectedInfo) + `</AnimatePresence>\n                </div>`.length);

// 2. Inject Subtitle and Details into selectedInfoCode (since they were lost)
let newSelectedInfo = selectedInfoCode;
newSelectedInfo = newSelectedInfo.replace(
  '<h3 className="project-details__title">{activeProject.title}</h3>',
  '<h3 className="project-details__title">{activeProject.title}</h3>\n                        {activeProject.subtitle && (\n                          <h4 className="project-details__subtitle">{activeProject.subtitle}</h4>\n                        )}'
);

// Remove the old subtitle if it got duplicated
newSelectedInfo = newSelectedInfo.replace(/<h3 className="project-details__subtitle">\{activeProject\.subtitle\}<\/h3>\s*/g, '');


newSelectedInfo = newSelectedInfo.replace(
  '<p className="project-details__description">{activeProject.description}</p>',
  `<p className="project-details__description">{activeProject.description}</p>
                        
                        {activeProject.details && activeProject.details.length > 0 && (
                          <ul className="project-details__list">
                            {activeProject.details.map((detail, index) => (
                              <li key={index}>{detail}</li>
                            ))}
                          </ul>
                        )}`
);

// 3. Rebuild layout
const newLayout = `
                {/* Hexagon Navigator Centered */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
${topContainerContent.replace(startTopContainer, '').trim()}
                </div>

                {/* Details (Left) and Image (Right) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '3rem', justifyContent: 'space-between' }}>
                  
                  <div style={{ flex: '1 1 400px' }}>
${newSelectedInfo}
                  </div>

                  <div style={{ flex: '1 1 400px', maxWidth: '600px', width: '100%' }}>
${imagePlaceholderCode}
                  </div>
                </div>
`;

// Combine everything
const newFile = beforeTopContainer + newLayout + afterSelectedInfo;

fs.writeFileSync('src/components/projects/ProjectsSection.tsx', newFile);
console.log('Restructured successfully');
