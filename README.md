# Jayphix Portfolio

A static portfolio site for Jayphix Consults — built with plain HTML, CSS, and JavaScript. No framework, no backend. Two pages: a home page with projects and contact, and an about page with education and tools.

**New to the project?** Read the full developer guide: **[docs/DEVELOPER.md](docs/DEVELOPER.md)**

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Structure

```
├── index.html          # Home page
├── about.html          # About / profile page
└── assets/
    ├── css/styles.css  # Main stylesheet
    ├── js/             # ES module scripts
    └── images/         # Project images (kebab-case filenames)
```

## Build

```bash
npm run build
```

Output goes to `dist/`. **Do not edit `dist/` directly** — it is regenerated on every build. Always edit source files in the repo root and `assets/`.

## Deploy

Configured for [Render](https://render.com) static sites via `render.yaml`. Push to `main` to deploy.

## Contact form

Uses [FormSubmit](https://formsubmit.co) with `oniludej65@gmail.com`. Change the `action` on `#contactForm` in `index.html` to update the recipient.
