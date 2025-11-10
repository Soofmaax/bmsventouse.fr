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

SmarterLogicWeb — https://smarterlogicweb.com