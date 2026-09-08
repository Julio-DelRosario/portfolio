# Learning Document: Julio's Portfolio Codebase

Welcome to the learning guide for your portfolio! This document is designed to help you understand the *actual code* running your site. Instead of abstract theory, we will look at how your Next.js application, React components, styling, and animations are built.

---

## SECTION 1 — PROJECT ARCHITECTURE

**What it is:** The folder structure and mental model of your application.
**Why this portfolio needs it:** To keep your components, data, and styles organized as the app grows.

### Mental Model

When a user visits your site, here is how the pieces connect:

1. **Browser** requests the site.
2. **Next.js** (the framework) receives the request and looks in the `src/app/` folder.
3. **`page.tsx`** is loaded. This is your "homepage".
4. The homepage calls **Sections** (like `<HeroContent />`, `<ProjectsSection />`).
5. Sections are built using smaller **Components** (like `<NavigatorHexagon />` or `<Button />`).
6. **State & Events** (React) manage what happens when users click or scroll.
7. The final result is rendered to the **DOM** (what the user actually sees).

### Key Directories

- **`src/app/`**: The heart of Next.js routing.
  - `page.tsx`: Your main homepage.
  - `layout.tsx`: Wraps your entire site. It includes your `<SiteHeader />` and `<SiteFooter />` so they appear on every page.
  - `globals.css`: All your global CSS variables and styling.
- **`src/components/`**: Where your UI pieces live.
  - `ui/`: Reusable, generic parts (e.g., `button.tsx`).
  - `projects/`, `hero/`, `experience/`: Feature-specific sections.
- **`src/data/`**: Where your content lives (`projects.ts`, `experience.ts`, `contact.ts`). Separating data from UI means you can update your resume without touching React code.
- **`package.json`**: Lists your project's dependencies (like React, Tailwind, Framer Motion) and scripts (like `npm run dev`).

---

## SECTION 2 — NEXT.JS

Next.js is a framework built on top of React. It handles routing, compiling, and rendering.

### App Router (`src/app`)
Next.js uses folder structures for URLs. Because everything is in `src/app/page.tsx`, you currently have a single-page portfolio. 

### Server vs. Client Components
By default, Next.js components are **Server Components** (they render on the server to send fast, lightweight HTML to the browser). But if a component needs browser interaction (like tracking mouse scrolls or clicking buttons), it must be a **Client Component**.

**Where it appears in the code:**
Look at the very top of `src/components/projects/ProjectsSection.tsx`:

```tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
```
**Why we chose this approach:** The `ProjectsSection` uses `useState` (to track the active project) and listens to browser scroll events. These require the browser's JavaScript engine, so we must declare `"use client"` at the top.

If you removed `"use client"`, Next.js would throw an error because it would try to run browser features (`useState`, `window`) on a server.

---

## SECTION 3 — REACT FUNDAMENTALS

React is a library for building UI out of reusable "Components".

### Components and Props
A component is just a JavaScript function that returns HTML-like syntax (JSX). **Props** are arguments passed to that function.

**Where it appears in the code:** (`src/components/projects/ProjectsSection.tsx`)
```tsx
<NavigatorHexagon 
  index={i} 
  isActive={activeIndex === i}
  title={project.title}
  onClick={() => { ... }}
/>
```
**What this is doing:** We are telling the `<NavigatorHexagon>` component what its `title` is, whether it is `isActive`, and what to do when clicked (`onClick`). 

### State (`useState`)
State is memory. It allows a component to remember things and update the screen when those things change.

**Where it appears:** (`src/components/projects/ProjectsSection.tsx`)
```tsx
const [activeIndex, setActiveIndex] = useState(0);
```
**What happens at runtime:** 
1. React creates a variable `activeIndex` starting at `0`.
2. When the user clicks a hexagon, we call `setActiveIndex(2)`.
3. React sees the state changed, **re-renders** the component, and the 3rd project appears on screen.

### `map()` and Keys
When rendering a list of items from your `src/data/` folder, React uses the JavaScript `map()` function.

```tsx
{EXPERIENCES.map((exp, index) => (
  <motion.div key={exp.id} className="experience__item">
    {/* ... */}
  </motion.div>
))}
```
**Why this is needed:** `map()` loops through your data. The `key={exp.id}` is crucial. It gives React a unique identifier for each item so if the list changes, React knows exactly which item to update instead of redrawing everything.

---

## SECTION 4 — TYPESCRIPT

TypeScript is JavaScript with strict type rules. It catches errors before you even run the code.

**Where it appears in the code:** (`src/data/experience.ts`)
```ts
export type Experience = {
  id: string;
  period: string;
  role: string;
  contributions: string[]; // This means an array of strings
  technologies: string[];
};
```
**Why this is useful:** In your `ExperienceSection.tsx`, if you tried to type `exp.technologys.map(...)` (misspelled), TypeScript would instantly throw a red underline error in your editor. Pure JavaScript wouldn't warn you until the website crashed in the browser.

---

## SECTION 5 — TAILWIND CSS

Tailwind uses "utility classes"—predefined CSS rules you apply directly in HTML. 

**Where it appears in the code:** (`src/components/layout/site-footer.tsx`)
```tsx
<footer className="py-8 sm:py-10 flex flex-col gap-3">
```
**Explanation line-by-line:**
- `py-8`: Padding top and bottom (Y-axis) of 2rem (32px).
- `sm:py-10`: On small screens (tablets) and larger, increase padding to 2.5rem.
- `flex`: Turns the container into a flexbox layout.
- `flex-col`: Stacks items vertically.
- `gap-3`: Adds a gap of 0.75rem between the stacked items.

*Note: Your project heavily utilizes standard CSS in `globals.css` with BEM class names (e.g., `.contact__grid`) for complex layouts, but leverages Tailwind for quick utility spacing and layout in places like the footer.*


---

## SECTION 6 — RESPONSIVE DESIGN

Responsive design ensures your site looks good on all devices. 

**Where it appears in the code:** (`src/app/globals.css`)
```css
.experience__grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 column */
}

@media (min-width: 48rem) {
  .experience__grid {
    grid-template-columns: 4rem 1fr; /* Tablet: 2 columns */
  }
}
```
**Why this approach:** We use **Mobile-first CSS**. The default CSS rule applies to mobile phones. Then, we use `@media (min-width: ...)` to *override* the layout for larger screens. It is easier to scale a simple design up than to force a complex desktop design to squeeze into a phone.

---

## SECTION 7 — FRAMER MOTION

Framer Motion is the library powering your slick scroll reveals and smooth transitions.

**Where it appears in the code:** (`src/components/contact/ContactSection.tsx`)
```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-10%" }}
  variants={fadeUp}
>
```
**What happens here:**
1. **Initial state:** `initial="hidden"` applies the `hidden` variant (invisible, pushed 20px down).
2. **Trigger:** `whileInView="visible"` tells Framer Motion to wait until this element scrolls into the screen.
3. **Viewport tweak:** `margin: "-10%"` means the animation won't trigger until the element crosses 10% into the screen (preventing it from animating while barely visible at the bottom edge).
4. **Animation:** It transitions to `opacity: 1` and `y: 0` (sliding up to its normal position).
5. `once: true` ensures the animation doesn't repeat every time you scroll up and down.

---

## SECTION 8 — PROJECTS SECTION

This is the most complex frontend logic in your portfolio. It relies on a "sticky scroll-jacking" mechanism.

### The Mechanism
Instead of a normal webpage scroll, the Projects section pins itself to the screen while you scroll, using that scrolling motion to navigate through horizontal projects instead.

**Where it appears in the code:** (`src/components/projects/ProjectsSection.tsx`)
```tsx
<div ref={sectionRef} style={{ height: '350vh', position: 'relative' }}>
  <div style={{ position: 'sticky', top: 0, height: '105vh' }}>
```
**The sequence of events:**
1. **The Container:** The outer `div` is artificially tall (`350vh`, which is 3.5x the height of your screen).
2. **The Pin:** The inner `div` has `position: 'sticky'`. As you scroll down the 350vh container, the inner div "sticks" to the top of your screen. To the user, the screen appears completely frozen.
3. **Tracking the scroll:** 
   ```tsx
   const { scrollYProgress } = useScroll({ target: sectionRef });
   useMotionValueEvent(scrollYProgress, "change", (latest) => { ... })
   ```
   Framer Motion calculates how far down the `350vh` container you have scrolled (from `0.0` to `1.0`).
4. **Math conversion:** `Math.round(latest * (numProjects - 1))` converts that `0.0 - 1.0` percentage into an index (e.g., Project 0, 1, 2, 3).
5. **State update:** `setActiveIndex(newIdx)` updates React state.
6. **Result:** The active hexagon lights up, and the project card seamlessly changes data without the page actually moving down.
7. **Release:** Once you scroll past the 350vh mark, the sticky lock releases, and normal page scrolling resumes down to the Experience section.

### Autoplay Timer
```tsx
const interval = setInterval(() => {
   // ... setActiveIndex(nextIdx)
}, 500);
```
A browser `setInterval` runs every 500ms checking if enough time (e.g., 5 seconds) has passed since your `lastInteractionTime.current`. If it has, it automatically advances the active project.

---

## SECTION 9 — DOM AND BROWSER CONCEPTS

React abstracts the browser, but your portfolio occasionally interacts with the browser directly.

**Browser API: `window.scrollTo`**
```tsx
window.scrollTo({ top: targetY, behavior: "smooth" });
```
When you click a hexagon, we bypass React entirely and tell the browser's DOM window to physically scroll the page to a specific pixel coordinate (`targetY`). 

**Browser API: `getBoundingClientRect`**
```tsx
const rect = sectionRef.current.getBoundingClientRect();
const absoluteTop = window.scrollY + rect.top;
```
This asks the browser DOM: "Exactly where is this HTML element right now on the user's physical screen?" We need this math to figure out exactly how far down to scroll.

---

## SECTION 10 — STATE AND DATA FLOW

Data always flows strictly downward in React (from parent to child).

**Example Data Flow in your Portfolio:**
1. **Source of Truth:** `src/data/projects.ts` contains all project details.
2. **Component State:** `ProjectsSection` loads this data and sets local state `activeIndex = 0`.
3. **Derived Values:** `const activeProject = PROJECTS[activeIndex];` (We calculate which project to show based on the state).
4. **Rendering:** `<h3>{activeProject.title}</h3>` displays the title.
5. **User Interaction:** User clicks Hexagon 3.
6. **State Update:** `setActiveIndex(2)`.
7. **Re-render:** React re-runs the entire function. `activeProject` is now `PROJECTS[2]`. The DOM updates with the new title.

---

## SECTION 11 — ACCESSIBILITY

Accessibility (a11y) ensures your site is usable by everyone, including screen readers.

**Semantic HTML:** 
```tsx
<section aria-labelledby="experience-heading">
  <h2 id="experience-heading">EXPERIENCE</h2>
```
Using `<section>` instead of `<div>` tells a screen reader "this is a distinct region of the page." `aria-labelledby` ensures the screen reader announces the section's name.

**Keyboard Navigation & Focus:**
All your buttons and links (`<a>`, `<button>`) receive keyboard focus automatically. A custom `focus-visible` ring (styled in your CSS) ensures users navigating with the `Tab` key can see exactly where they are.

**Reduced Motion:**
```tsx
const shouldReduceMotion = useReducedMotion();
const initial = shouldReduceMotion ? "visible" : "hidden";
```
If a user has configured their OS to disable animations (often due to vestibular disorders), `useReducedMotion()` detects this. Your code skips the `hidden` state entirely, ensuring they see the static content immediately without dizzying scroll animations.

---

## SECTION 12 — PERFORMANCE

**React `useCallback` and `useRef`**
In `ProjectsSection.tsx`, the `scrollWindowToIndex` function is wrapped in `useCallback`.
```tsx
const scrollWindowToIndex = useCallback((index: number) => { ... }, [numProjects]);
```
If we didn't use `useCallback`, React would recreate this function entirely from scratch every single time the user scrolled a pixel. This would cause memory churn and lag.

Similarly, we use `useRef` for things like `lastInteractionTime.current = Date.now()`. Unlike `useState`, updating a `useRef` variable does *not* trigger a component re-render. We don't want the screen to re-draw 60 times a second just because a background timer is ticking.

---

## SECTION 13 — GIT AND DEVELOPMENT WORKFLOW

To develop your app:
1. `npm run dev`: Starts a local server. Next.js watches your files and uses "Fast Refresh" to instantly update your browser when you hit save in your editor.
2. `npm run build`: Compiles your TypeScript, optimizes your images, and turns your React code into highly optimized static HTML, CSS, and JS bundles ready for a production server.
3. `npm run lint`: Scans your code for bad practices (like using `img` instead of Next.js `<Image>` or missing alt tags).

---

## SECTION 14 — "FOLLOW THE CODE" WALKTHROUGHS

### Walkthrough: A User clicks a Project Hexagon
1. **USER ACTION:** User clicks the 3rd hexagon.
2. **EVENT:** The `<button>` fires its `onClick` prop.
3. **FUNCTION:** The anonymous function `() => { markInteraction(); scrollWindowToIndex(2); }` executes.
4. **STATE / DOM:** 
   - `markInteraction()` updates `lastInteractionTime.current` so the autoplay timer doesn't fire immediately.
   - `scrollWindowToIndex(2)` calculates exactly how far down the 350vh container represents the 3rd project.
   - It tells the browser DOM to `window.scrollTo()` that exact physical pixel position.
5. **RENDER / ANIMATION:** Because the user scrolled, the `useScroll` hook notices the new position, runs its math, and calls `setActiveIndex(2)`. React re-renders, the new project text crossfades via `AnimatePresence`.

---

## SECTION 15 — THINGS I SHOULD EXPERIMENT WITH

Don't just read—break things safely! 

1. **Change the Hexagon math**
   - **What to change:** Open `src/components/projects/ProjectsSection.tsx`. Find `const SPACING_FACTOR = 1.08;` and change it to `1.50`.
   - **What to expect:** The hexagons in your grid will spread far apart.
   - **What it teaches:** How derived variables affect complex visual SVG math in React.

2. **Disable the Sticky Lock**
   - **What to change:** In `ProjectsSection.tsx`, find `position: 'sticky'` (around line 198) and change it to `position: 'relative'`.
   - **What to expect:** The entire Projects section will immediately break and scroll past you rapidly.
   - **What it teaches:** The fundamental CSS mechanism that powers the scroll-jacking effect.

3. **Modify the Autoplay Timer**
   - **What to change:** Find `const cooldown = isAtEnd ? 7000 : 5000;` and change `5000` (5 seconds) to `1000` (1 second).
   - **What to expect:** The projects will cycle aggressively fast.
   - **What it teaches:** How `Date.now()` and `setInterval` dictate application timing in React.

4. **Change a Framer Motion Animation**
   - **What to change:** Open `src/components/experience/ExperienceSection.tsx`. Find `hidden: { opacity: 0, y: 20 }` and change it to `hidden: { opacity: 0, x: -100 }`.
   - **What to expect:** Instead of floating up (`y: 20`), the experience items will fly in from the far left (`x: -100`).
   - **What it teaches:** The power and simplicity of Framer Motion variants.

5. **Remove a "use client" directive**
   - **What to change:** Remove the `"use client";` string from the very top of `src/components/projects/ProjectsSection.tsx`.
   - **What to expect:** Your app will crash with an error like `useState only works in Client Components`.
   - **What it teaches:** The strict boundary in Next.js App Router between server environments and browser environments.

---

## SECTION 16 — BEGINNER → ADVANCED ROADMAP

To master your own codebase, study in this order:

**LEVEL 1: Data & Content Separation**
- Study: `src/data/experience.ts` and `src/data/contact.ts`. 
- Understand how raw JavaScript objects hold data without caring about how it looks.

**LEVEL 2: Pure UI Components**
- Study: `src/components/layout/site-footer.tsx` and `src/components/contact/ContactSection.tsx`.
- Learn how data from Level 1 is imported and mapped over using `.map()` to create HTML elements.

**LEVEL 3: CSS & Layout**
- Study: `src/app/globals.css`. 
- Understand CSS Grid (`display: grid`), Flexbox (`display: flex`), and responsive media queries (`@media (min-width: 48rem)`).

**LEVEL 4: Framer Motion basics**
- Study: `src/components/experience/ExperienceSection.tsx`.
- Look specifically at how `motion.div` replaces standard `div` tags to enable the `whileInView` prop.

**LEVEL 5: Complex State & Browser APIs**
- Study: `src/components/projects/ProjectsSection.tsx`.
- This is the final boss. Understand `useState`, `useRef`, `useCallback`, `useEffect`, and how they interact with `window.scrollTo`.

---

## SECTION 17 — GLOSSARY

- **Component:** A reusable block of UI (like a Lego brick). E.g., `<Button>`.
- **JSX:** The syntax that allows you to write HTML directly inside JavaScript.
- **Props:** Variables passed into a component. Similar to arguments passed to a standard function.
- **State:** Memory. Data that changes over time (like the currently selected project). When state changes, the screen updates.
- **Hook:** Special React functions starting with `use` (e.g., `useState`, `useEffect`) that let you hook into React internals.
- **DOM:** Document Object Model. The physical HTML elements rendered in the browser.
- **Client Component:** A component explicitly tagged to run in the user's browser, allowing interactivity.
- **Viewport:** The visible area of a web page on a display device.
- **Sticky:** A CSS positioning rule (`position: sticky`) that makes an element scroll normally until it hits a boundary, at which point it locks onto the screen.
