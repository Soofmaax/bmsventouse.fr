# Staging Deployment

If you maintain a staging environment, consider:

- Branch-based deploy previews on Netlify
- Password-protected staging (Netlify Basic Auth)
- Robots noindex on staging to avoid SEO issues
- Separate GA4 property or disabled analytics

## Netlify Setup

- Enable Deploy Previews for pull requests
- Configure environment variables per context (prod vs preview)
- Add headers to disallow indexing on preview contexts

SmarterLogicWeb — https://smarterlogicweb.com