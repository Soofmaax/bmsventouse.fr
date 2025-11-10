# Configuration

This project is static by design. However, a few configuration points exist:

## Netlify (headers, caching, redirects)

- File: `netlify.toml`
- Controls:
  - Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
  - Caching policies
  - Redirect rules

## Analytics (GA4)

- Implemented in HTML with Consent Mode v2
- JS integration lives in `js/script.js`:
  - Consent defaults to denied for analytics
  - A simple cookie banner toggles consent and reloads analytics settings
- Replace the GA4 ID if needed

## Sitemap & Robots

- File: `sitemap.xml` and `robots.txt`
- Keep them updated when adding new pages

## Linting

- `.htmlhintrc`, `.stylelintrc.json`, `.eslintrc.json`, `.markdownlint.json`
- The CI quality gate runs monthly and on demand

SmarterLogicWeb — https://smarterlogicweb.com