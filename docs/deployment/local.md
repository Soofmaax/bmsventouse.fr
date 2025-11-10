# Local Deployment

For local validation and QA:

1) Serve from the repo root
```bash
# Node
npx http-server -p 8080

# or Python
python3 -m http.server 8080
```

2) Run accessibility checks (optional)
```bash
npx http-server -p 8080 -c-1 . & 
npx wait-on http://localhost:8080
npx pa11y-ci
```

3) Manual checks
- Keyboard navigation
- Contrast and focus indicators
- Hero image loading (LCP)
- Links and sitemap coverage

SmarterLogicWeb — https://smarterlogicweb.com