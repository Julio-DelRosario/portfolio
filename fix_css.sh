#!/bin/bash

# Update active fill color to be less aggressive (transparent honey)
sed -i 's/fill: var(--color-accent);/fill: rgba(244, 180, 0, 0.15);/g' src/app/globals.css

# Update active label text color since background is no longer solid dark
sed -i 's/color: var(--color-background); \/\* Dark text on amber fill \*\//color: var(--color-accent);/g' src/app/globals.css

# Reduce upper empty space by modifying intro-block margin
sed -i 's/margin-bottom: var(--space-12);/margin-bottom: var(--space-6);/g' src/app/globals.css
sed -i 's/margin-bottom: var(--space-8);/margin-bottom: var(--space-6);/g' src/app/globals.css

