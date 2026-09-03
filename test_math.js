const R = 48;
const W = R * Math.sqrt(3);
const H = 2 * R;

const numProjects = 10;
for(let i=0; i<numProjects; i++) {
  const row = i % 2;
  const col = Math.floor(i / 2);
  const cx = col * W + (row === 1 ? 0.5 * W : 0);
  const cy = row * 1.5 * R;
  console.log(`i=${i}, row=${row}, col=${col}, cx=${cx.toFixed(1)}, cy=${cy.toFixed(1)}`);
}
