#!/bin/bash
cat << 'CSS_EOF' >> src/app/globals.css

/* Hexagon Navigator Group */
.navigator-hex-group {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.navigator-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.navigator-hex-group--active .navigator-label {
  opacity: 1;
}

.navigator-label--top {
  bottom: 100%;
  margin-bottom: -16px;
}

.navigator-label--bottom {
  top: 100%;
  margin-top: -16px;
}

.navigator-label__text {
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text-primary);
  text-transform: uppercase;
  white-space: nowrap;
}

.navigator-label__line {
  width: 1px;
  height: 24px;
  background-color: var(--color-border-strong);
}

.navigator-hex-group--active .navigator-label__line {
  background-color: var(--color-accent);
}

/* We need to override the navigator-hex from absolute inset 0 */
.navigator-hex {
  position: absolute;
  inset: 0;
}
CSS_EOF
chmod +x append_css.sh
./append_css.sh
