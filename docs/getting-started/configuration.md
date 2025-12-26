# Configuration

This project is static by design. However, a few configuration points exist:

## Netlify (headers, caching, redirects)

- File: `netlify.toml`
- Controls:
  - Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
  - Caching policies
  - Redirect rules

## Analytics (GA4, GTM, Clarity)

- **GA4** is implemented in HTML with **Consent Mode v2** (measurement ID currently `G-V7QXQC5260`).
- The main JS integration lives in `js/script.js`:
  - Consent defaults to **denied** for analytics.
  - A cookie banner (`setupCookieBanner`) lets users accept/refuse analytics and updates Consent Mode.
  - Several events are tracked out of the box (both via `gtag` and `dataLayer`):  
    - `phone_click`, `whatsapp_click`, `email_click`, `cta_contact_click`  
    - `contact_submitted` (form on `/contact/`, with detailed payload).
- **Google Tag Manager (GTM)** support is built‑in:
  - A `<meta name="gtm-id" content="">` tag exists in the main templates.
  - The function `setupGTM()` reads this meta (or `window.GTM_ID`) and loads the container dynamically.
  - To enable GTM, create a container in the GTM UI and set `content="GTM-XXXXXXX"` in that meta.
- **Microsoft Clarity** is integrated, but loaded **only if** the user accepts analytics:
  - Implementation: `setupClarity()` and `loadClarityIfConsented()` in `js/script.js`.
  - Clarity ID can be changed in the script if needed.

If you rotate the GA4 property or GTM container, update:

- The GA4 measurement ID in the inline `gtag('config', '...')` calls.
- The `gtm-id` meta content on the relevant HTML templates.

## Sitemap & Robots

- File: `sitemap.xml` and `robots.txt`
- Keep them updated when adding new pages

## Linting

- `.htmlhintrc`, `.stylelintrc.json`, `.eslintrc.json`, `.markdownlint.json`
- The CI quality gate runs monthly and on demand

SmarterLogicWeb — https://smarterlogicweb.com