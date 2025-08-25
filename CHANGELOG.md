# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)
et ce projet suit [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

## [1.0.0] - 2025-08-25

### Ajouté
- Pipeline de génération statique Eleventy avec layout modulaire, macros, arborescence claire.
- Optimisation performance : minification HTML, lazy-loading images, budgets Lighthouse ([lighthouse-budgets.json]), responsive images (Eleventy Image, optimize-images.js).
- Accessibilité : skip-link, ARIA, navigation clavier, focus visible, dark mode, bouton retour haut, tests automatiques axe-core/cypress-axe.
- UX moderne : carrousel accessible (clavier/swipe), thème sombre/clair persistant, transitions smooth.
- Analytics RGPD-friendly : Plausible (CTA Click, Web Vitals), sans cookies, privacy-first.
- PWA : offline, cache statique, registration automatique, sw.js.
- Sécurité : CSP, HSTS, COOP, CORP, Permissions-Policy, headers Netlify.
- Qualité continue : Lighthouse CI, assertion perf/a11y/SEO, tests accessibilité multi-pages.
- Scripts npm pour formatage, lint, tests e2e/a11y, release.
- Système i18n (locale loader, filter), puis suppression EN à la demande.

### Modifié
- Nettoyage structure, suppression EN, uniformisation alternates hreflang.
- Refactoring des macros, shortcodes, cleanups CSS/JS.

### Sécurité
- Headers Netlify durcis, CSP compatible analytics, suppression de X-XSS-Protection obsolète.

---