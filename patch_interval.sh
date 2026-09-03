#!/bin/bash
sed -i 's/if (Date.now() - lastInteractionTime.current > 1500) {/const isAtEnd = activeIndexRef.current === numProjects - 1;\n      const cooldown = isAtEnd ? 4500 : 1500;\n      if (Date.now() - lastInteractionTime.current > cooldown) {/g' src/components/projects/ProjectsSection.tsx
