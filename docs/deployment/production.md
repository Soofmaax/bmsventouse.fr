# Production Deployment

This project targets Netlify for production hosting.

## Checklist

- [ ] Main branch is green on CI (quality gate)
- [ ] `sitemap.xml` updated (new pages)
- [ ] `robots.txt` references the public sitemap
- [ ] Security headers and CSP defined in `netlify.toml`
- [ ] Analytics (GA4) ID verified
- [ ] No secrets present (Gitleaks passes)

## Post-Deploy

- Validate core pages return 200
- Spot-check LCP and CLS in Lighthouse
- Validate structured data (Rich Results Test)
- Confirm robots and sitemap live URLs

SmarterLogicWeb — https://smarterlogicweb.com