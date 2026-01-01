# Troubleshooting — Common Issues

## 1) Menu hamburger doesn’t toggle on mobile
- Ensure `#hamburger`, `#navLinks`, and `#navOverlay` exist in the DOM
- JS initializes in `js/script.js` on `DOMContentLoaded`

## 2) Hero image not loading on first paint
- Check `images/` asset path
- Verify `fetchpriority="high"` is present on the main hero `<img>`

## 3) Accessibility regressions
- Run: `npx http-server -p 8080 & npx pa11y-ci`
- Check focus visibility, heading order, and alt attributes

## 4) Incorrect canonical or OG image
- Verify meta tags on each page
- Ensure `og:image` is an absolute URL

## 5) CI failures on Super‑Linter
- See logs for the specific linter failing (HTML, CSS, JS, MD, Actions)
- Run the corresponding linter locally with the project config

## 6) CSP blocks GA4 or Clarity
- Symptoms:
  - GA4 hits missing in real‑time reports.
  - Clarity sessions not recorded.
  - Errors like “Refused to load the script because it violates the following Content Security Policy directive…” in the browser console.
- Checks:
  - Open DevTools → Console and look for CSP errors on `https://www.googletagmanager.com`, `https://www.google-analytics.com` or `https://www.clarity.ms`.
  - Inspect the response headers to confirm CSP is coming from `netlify.toml` and that there is **no** conflicting `<meta http-equiv="Content-Security-Policy">` tag in the HTML.
- Fix:
  - Update the `Content-Security-Policy` header in `netlify.toml` to explicitly allow the required scripts/images/fonts.
  - Avoid adding or keeping CSP `<meta>` tags in individual HTML files; keep CSP centralized in Netlify headers.

SmarterLogicWeb — https://smarterlogicweb.com