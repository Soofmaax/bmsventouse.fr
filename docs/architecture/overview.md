# Architecture Overview

## High-Level

- Static site (HTML/CSS/JS)
- Hosted on Netlify
- No server-side code or database
- Analytics and UX scripts are client-side and privacy‑aware

## Frontend

- HTML per page (home, services, contact, legal, city pages)
- `css/style.css` — design system variables, layout, components, responsive behavior
- `js/script.js` — navigation (hamburger), accessibility (focus trap), FAQ, breadcrumbs, basic analytics

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