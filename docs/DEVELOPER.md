# Developer Guide — Jayphix Portfolio

Read this document first if you are new to the project. It explains how the codebase is organized, what changed during the refactor, and how to make common updates without breaking production.

---

## What this project is

This is a **static portfolio website** for Jayphix Consults. There is no backend, no database, and no React/Astro framework.

| Page | File | What it shows |
|------|------|---------------|
| Home | `index.html` | Hero, about, projects, services, testimonials, contact |
| About | `about.html` | Education, hobbies, tools, nationality |

The site is deployed on [Vercel](https://vercel.com) at **jay-s-portfolio-nine.vercel.app**. After each push to `main`, Vercel runs `npm run build` and serves the `dist/` folder.

---

## How the files connect

```
index.html ──┬── assets/css/styles.css
             └── assets/js/main.js ──┬── theme.js
about.html ──┘                       ├── ui.js
                                     ├── projects.js
                                     └── form.js
```

Both HTML pages share the same CSS and JavaScript. When the page loads, `main.js` imports the other modules and initializes each feature (theme, menu, projects, form).

---

## What changed and why

The project was refactored to fix problems that caused broken images, duplicate files, and deploy failures on Linux servers.

| Before (do not go back to this) | After (current) | Why it matters |
|--------------------------------|-----------------|----------------|
| `styles copy.css`, `script copy.js` | `assets/css/styles.css`, `assets/js/*.js` | Filenames with spaces break URLs on Linux servers (Vercel) |
| Images at repo root (`image copy.png`) | `assets/images/profile.png` | Predictable paths; images load in production |
| One 267-line JavaScript file | 5 small ES modules | Easier to find and edit one feature at a time |
| `index copy.html` + `dashboard copy.html` | `index.html` + `about.html` | One file per page — no confusion about which is "real" |
| Broken image paths | All paths use `assets/images/...` | No more 404 images |

**Takeaway:** Always use clean filenames (kebab-case, no spaces) and keep assets inside the `assets/` folder.

---

## Folder guide — what goes where

| Path | Purpose | Edit when you need to… |
|------|---------|------------------------|
| `index.html` | Home page HTML | Change homepage text, projects, or contact section |
| `about.html` | About page HTML | Update education, tools, hobbies, nationality |
| `assets/css/styles.css` | Custom styles and design tokens | Change colors, animations, button/card styles |
| `assets/js/main.js` | Entry point — runs everything on load | Add a new JS module to the site |
| `assets/js/theme.js` | Dark / light mode toggle | Change theme behavior |
| `assets/js/ui.js` | Mobile menu, scroll animations, typewriter, back-to-top | Change general UI interactions |
| `assets/js/projects.js` | Project filters, image slider, lightbox modal | Change portfolio section behavior |
| `assets/js/form.js` | Contact form validation and toast messages | Change form behavior |
| `assets/images/` | All project and profile images | Add or replace images |
| `dist/` | **Build output — never edit this** | Nothing — it is auto-generated |
| `vite.config.js` | Dev server and build settings | Add a new HTML page to the build |
| `vercel.json` | Deploy configuration for Vercel | Change build or output settings |

---

## How JavaScript works

### Load order

1. HTML includes: `<script type="module" src="assets/js/main.js"></script>`
2. `main.js` imports `theme.js`, `ui.js`, `projects.js`, and `form.js`
3. On `DOMContentLoaded`, each `init*` function runs and attaches event listeners

### HTML ↔ JavaScript contract

Each JS file expects specific IDs and classes in the HTML. If you rename or remove these, the feature will stop working.

| Module | Selectors it needs |
|--------|-------------------|
| `theme.js` | `#themeToggle`, `data-theme` on `<html>` |
| `ui.js` | `#mobileMenu`, `#menuToggle`, `#menuClose`, `.mobile-link`, `#backToTop`, `.reveal`, `.typewriter-text`, `#cursorGlow`, `#toast` |
| `projects.js` | `.filter-btn`, `.project-card`, `.project-thumb`, `.project-slider`, `#imageModal`, `#modalImage`, `#modalTitle`, `#modalCategory` |
| `form.js` | `#contactForm` (with `name`, `email`, `message` fields) |

### Theme flash prevention

Both HTML pages include a small inline script in `<head>` that reads `localStorage` before the page paints. This prevents a flash of the wrong theme on reload. Do not remove it.

```html
<script>
  (function () {
    var saved = localStorage.getItem('jayphix-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  })();
</script>
```

### Adding new JavaScript

1. Create a new file in `assets/js/` (e.g. `analytics.js`)
2. Export an `initAnalytics()` function
3. Import and call it from `main.js`:

```js
import { initAnalytics } from './analytics.js';

window.addEventListener('DOMContentLoaded', () => {
  // ...existing inits...
  initAnalytics();
});
```

---

## How CSS works

The site uses **two layers of styling**:

1. **Tailwind CDN** (loaded in HTML) — utility classes like `flex`, `grid`, `px-6`, `rounded-full`
2. **`assets/css/styles.css`** — the design system: CSS variables, components, animations

### Design tokens (CSS variables)

Colors and spacing are defined as variables in `styles.css`:

```css
:root {
  --bg: #FFFFFF;
  --fg: #111111;
  --muted: #5F5B55;
  --accent-bright: #FDE047;
  /* ... */
}

[data-theme="dark"] {
  --bg: #070B17;
  --fg: #F7F7F2;
  /* ... */
}
```

Dark mode works by setting `data-theme="dark"` on `<html>`. All components automatically pick up the new colors.

### Prefer classes over inline styles

Use `.text-muted` instead of `style="color: var(--muted)"`.

| Instead of | Use |
|------------|-----|
| `style="color: var(--muted)"` | `class="text-muted"` |
| `style="border-color: var(--border)"` | Tailwind `border-[var(--border)]` or a CSS class |

### Key component classes

| Class | What it styles |
|-------|---------------|
| `.btn-primary` | Yellow CTA buttons |
| `.btn-secondary` | Outlined buttons |
| `.project-card` | Portfolio item cards |
| `.project-thumb` | Clickable project image (opens lightbox) |
| `.filter-btn` | Project category filter buttons |
| `.nav-link` / `.mobile-link` | Header navigation links |
| `.text-muted` | Secondary/muted text color |
| `.toast` | Form success/error notification |

---

## Common tasks

### Add a new project card

1. Save the image as `assets/images/my-project.png` (kebab-case, no spaces)
2. Open `index.html` and find the projects grid (`<div class="grid gap-8 lg:grid-cols-3">`)
3. Copy an existing `<article class="project-card">` block
4. Update these attributes:

```html
<article class="project-card" data-category="graphic">
  <button type="button" class="project-thumb mb-6"
    data-full="assets/images/my-project.png"
    data-title="My Project Title"
    data-category="Graphic Design">
    <img src="assets/images/my-project.png" alt="My project" loading="lazy">
  </button>
  <div class="project-category mb-4">Graphic Design</div>
  <h3 class="text-2xl font-semibold mb-3">MY PROJECT TITLE</h3>
  <p class="text-sm leading-relaxed text-muted">Short description here.</p>
</article>
```

5. Set `data-category` on the `<article>` to one of: `graphic`, `web`, or `branding` (must match the filter buttons)
6. Run `npm run dev` and test: filter buttons, image click (lightbox), mobile view

### Add a project with an external link (like the Miracle website)

Use a regular link instead of only the lightbox:

```html
<div class="project-category mb-4">
  <a href="https://example.com" class="project-link" target="_blank" rel="noreferrer">View</a>
</div>
```

### Change the contact email

Update all three places in `index.html`:

1. Form action: `<form id="contactForm" action="https://formsubmit.co/YOUR_EMAIL@example.com" ...>`
2. `mailto:` link in the contact icons section
3. Email text in the mobile menu footer

### Add FitHub branding slider images

The FitHub card currently uses a single placeholder image. To add the full 12-slide carousel:

1. Add images to `assets/images/` as `fithub-01.jpeg`, `fithub-02.jpeg`, etc.
2. In `index.html`, inside the `.project-slider` div, add one button per image:

```html
<button type="button" class="project-thumb project-slide"
  data-full="assets/images/fithub-02.jpeg"
  data-title="Visual Identity System"
  data-category="Branding"
  aria-label="Open branding slide 2">
  <img src="assets/images/fithub-02.jpeg" alt="Branding slide 2" loading="lazy">
</button>
```

3. Mark the first slide with `active` class
4. Update `.project-slider-count` to `1 / 12` (or whatever the total is)

### Update about page content

Edit `about.html` directly. Each section is a `.dashboard-card` inside the grid. Update the text inside `<ul class="dashboard-list">` items or paragraph tags.

---

## Dev workflow

```bash
# First time setup
npm install

# Local development (hot reload)
npm run dev
# → open http://localhost:5173

# Production build
npm run build
# → outputs to dist/

# Preview the production build locally
npm run preview
```

**Important:** Always edit source files (`index.html`, `about.html`, `assets/`). Never edit files inside `dist/` — they are overwritten on every build.

---

## Rules to follow

### Do

- Use **kebab-case** filenames: `my-project.png`, not `My Project.png`
- Keep all images in `assets/images/`
- Keep all custom CSS in `assets/css/styles.css`
- Put new JavaScript in `assets/js/` and import from `main.js`
- Test **dark mode** and **mobile menu** after making changes
- Run `npm run build` before pushing to confirm nothing breaks

### Don't

- Create files with ` copy` in the name (e.g. `styles copy.css`)
- Put images at the repo root
- Edit `dist/` directly
- Duplicate entire HTML pages for small content changes
- Use inline `style="color: var(--muted)"` when `.text-muted` exists
- Reference images with spaces or wrong casing (`Md's website.jpeg` vs `miracle-website.jpeg`)

---

## Known limitations (intentional)

These are not bugs — they were left out of scope during the refactor:

| Feature | Status | Notes |
|---------|--------|-------|
| Testimonial carousel | Partial | Only one testimonial exists; dot buttons in HTML are decorative |
| Modal prev/next | Not implemented | Buttons exist in HTML but are hidden |
| FitHub 12-slide carousel | Placeholder | Uses `profile.png` until branding images are provided |
| Tailwind build pipeline | Not used | Tailwind loads via CDN — fine for this project size |
| Image compression | Not done | PNGs are large; consider WebP later if load time matters |

---

## Deploy

### Vercel (configured)

Live URL: **https://jay-s-portfolio-nine.vercel.app**

`vercel.json` tells Vercel to:

1. Run `npm run build`
2. Serve the `dist/` folder

Push to `main` and Vercel deploys automatically when the repo is connected.

### Troubleshooting production issues

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| Image 404 | Wrong path or filename casing | Check `assets/images/` name matches HTML exactly (Linux is case-sensitive) |
| JS not working | Wrong script path | Confirm `<script type="module" src="assets/js/main.js">` |
| Styles missing | Wrong CSS path | Confirm `<link rel="stylesheet" href="assets/css/styles.css">` |
| Form not sending | FormSubmit email wrong | Check `action` URL on `#contactForm` |
| Dark mode flash | Inline theme script removed | Restore the `<head>` localStorage script |

---

## Quick reference

```
jay-s-portfolio/
├── index.html              ← Home page
├── about.html              ← About page
├── assets/
│   ├── css/styles.css      ← All custom styles
│   ├── js/
│   │   ├── main.js         ← Start here for JS
│   │   ├── theme.js
│   │   ├── ui.js
│   │   ├── projects.js
│   │   └── form.js
│   └── images/             ← All images (kebab-case)
├── docs/
│   └── DEVELOPER.md        ← You are here
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

If you are stuck, read the relevant section above, check the browser console for errors, and compare your changes against an existing working block in the HTML.
