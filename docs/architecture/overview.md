# Architecture Overview

## High-Level

- Static site (HTML/CSS/JS)
- Hosted on Netlify
- No server-side code or database
- Analytics and UX scripts are client-side and privacy‑aware

## Frontend

- HTML per page (home, services, legal, contact, many localized “ventousage / sécurité / logistique” pages).

- CSS is split into several files under `css/`:
  - `base.css` — design tokens, color palette, typography, reset, basic accessibility.
  - `layout.css` — global layout, grid, header/nav, sections, footer, responsive breakpoints.
  - `components.css` — reusable components (buttons, cards, banners, cookie banner, back‑to‑top, etc.).
  - `sections.css` — larger section blocks (hero, processes, stats, carousels, promo banner, zone cards…).
  - `pages.css` — page‑specific overrides (`.page-accueil`, `.page-contact`, legal pages, etc.).
  - `faq.css` — dedicated FAQ styling (`.faq-item`, `.faq-question`, `.faq-answer`, animations). This file is intended as the reference for the FAQ module; in the current build the active FAQ styles still live in `style.css` for backward compatibility.
  - `style.css` — entrypoint that imports the other stylesheets and still hosts some historical rules that are being gradually migrated.

- JavaScript: single bundle `js/script.js` grouped into `setupXxx()` modules, including:
  - Navigation & layout: `setupUnifiedHeader()`, `setupHamburgerMenu()`, `setupUnifiedFooter()`, `setupSkipLink()`, `setupScrollAnimations()`.
  - UX toggles: `setupThemeMode()` (dark mode), `setupHandPreference()` (left/right‑hand mode), scroll progress bar, back‑to‑top.
  - Content modules: `setupFaqAccordion()` (refactored FAQ), references carousel, Ventousage Paris gallery (`setupVentousageParisGallery()`).
  - Compliance & tracking: `setupCookieBanner()` (Consent Mode v2), `setupAnalyticsEvents()`, `setupBreadcrumbs()`, optional `setupGTM()`, Clarity (`setupClarity()` / `loadClarityIfConsented()`).
  - Perf & PWA: `setupServiceWorker()`, `enhanceImages()` (lazy/decoding + WhatsApp SVG normalization), canonical fallback and French typography cleaning.

## CI / Quality Gate

Workflow: `.github/workflows/ci.yml` (monthly + manual)
- Super‑Linter (HTML/CSS/JS/MD/Actions)
- CodeQL (SAST for JS)
- Pa11y CI (WCAG2AAA against localhost)
- npm audit (High+)

## Security Model

- No backend: minimized attack surface
- Security headers via Netlify
- Gitleaks: prevent secrets
- CodeQL: static analysis
- CSP rules documented in `netlify.toml` (or legal page)

## Deployment

- Netlify deploy from `main`
- `sitemap.xml` and `robots.txt` are kept in repo
- Set appropriate cache and headers in `netlify.toml`

SmarterLogicWeb — https://smarterlogicweb.com