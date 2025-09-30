# BMS Ventouse — Site vitrine statique

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.bmsventouse.fr)](https://www.bmsventouse.fr)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-blue)](.github/workflows/ci.yml)
[![A11y](https://img.shields.io/badge/A11y-WCAG_2.1_AAA-5c2)](docs/ACCESSIBILITY.md)
[![Analytics](https://img.shields.io/badge/Analytics-GA4_Consent_Mode_v2-ff7f50)](docs/ANALYTICS_GA4.md)
[![Hosting](https://img.shields.io/badge/Hosting-Netlify-00ad9f)](https://www.netlify.com)

Dépôt du site officiel de BMS Ventouse (logistique pour tournages et événements).
Empilement simple et robuste: HTML, CSS, JavaScript.

Lien production: https://www.bmsventouse.fr/

---

Sommaire
- Points forts techniques
- Démarrer en local
- Qualité & CI
- Déploiement Netlify
- SEO: bonnes pratiques
- Accessibilité
- Analytics (GA4 + Consent Mode)
- Structure du projet
- Contribution
- Licence

Points forts techniques
- Performance
  - Preload CSS, preconnect fonts, lazy-loading des images non prioritaires.
  - Héros prioritaire: fetchpriority="high" + dimensions pour limiter CLS et améliorer LCP.
  - Cache long sur assets statiques (Netlify) via netlify.toml.
- SEO
  - Meta essentielles, canonical, OG, Twitter Cards.
  - JSON‑LD avancé: ProfessionalService, LocalBusiness, Service, FAQPage, BreadcrumbList.
  - Sitemap.xml et robots.txt propres.
- Accessibilité
  - Skip link “Aller au contenu”.
  - Menu mobile accessible (focus trap, ESC).
  - Pa11y CI en WCAG2AAA (job qualité non bloquant).
- Sécurité
  - En-têtes de sécurité via Netlify (X-Frame-Options, X-Content-Type-Options, etc.).
  - CSP côté page Mentions; headers côté Netlify pour le reste.
- Observabilité
  - GA4 avec Consent Mode v2 et anonymisation d’IP. Événements de base (tél, WhatsApp, email, CTA).

Démarrer en local
Prérequis
- Node 18+ recommandé (Node 20 utilisé en CI) ou Python 3 pour un serveur local.

Lancer un serveur local (au choix)
- npx http-server -p 8080
- python3 -m http.server 8080

Ensuite ouvrez http://localhost:8080/

Qualité & CI
- Workflow GitHub Actions: .github/workflows/ci.yml
  - Job bloquant lint-and-validate:
    - Super‑Linter (HTML, XML, YAML, Actions, CSS, JS, Markdown) avec configs du dépôt:
      - .htmlhintrc, .stylelintrc.json, .eslintrc.json, .markdownlint.json
    - Link check interne (lychee) sur *.html
    - Lint netlify.toml (Taplo)
  - Job non bloquant quality:
    - Serveur local + Pa11y CI (WCAG2AAA) via .pa11yci.json
    - Link check externe (HTML + Markdown)

Lancer les lint localement (exemples)
- npx -y htmlhint "**/*.html" --config .htmlhintrc
- npx -y -p stylelint -p stylelint-config-standard stylelint "css/**/*.css" --config .stylelintrc.json
- npx -y eslint "js/**/*.js" --config .eslintrc.json
- npx -y lychee --no-progress --retry 1 --timeout 20 --exclude-mail --exclude "https?://.*" "**/*.html"
- npx -y http-server -p 8080 & npx -y pa11y-ci

Déploiement Netlify
- Le site est statique; le dossier racine est publié (publish = ".") tel que défini dans netlify.toml.
- Headers et redirects gérés via netlify.toml.
- Règle notable: /services redirigé vers /services/ (301) pour éviter le conflit avec une ancre (#services).

SEO: bonnes pratiques (résumé)
- Titre, description, canonical, lang=fr, viewport: sur chaque page.
- Réseaux sociaux
  - og:title, og:description, og:url, og:type, og:image 1200x630.
  - twitter:card = summary_large_image + twitter:title/description/image.
- JSON‑LD
  - LocalBusiness/ProfessionalService sur la home; Service/FAQPage selon les pages; BreadcrumbList visible + JSON‑LD sur pages internes.
  - Éviter AggregateRating si aucun avis n’est effectivement visible sur la page.
- Sitemap et robots
  - sitemap.xml mis à jour pour toute nouvelle page (penser à lastmod).
  - robots.txt référence le sitemap public.
- Performance
  - Héros avec width/height + fetchpriority="high".
  - Images webp/jpg optimisées; lazy loading pour les non‑critiques.

Accessibilité (résumé)
- 1 H1 par page; ordre hiérarchique H2/H3.
- Skip link, focus visible, navigation clavier: OK.
- Alternatifs d’images pertinents.
- Couleurs/contrastes à surveiller sur nouveaux éléments.
- Voir docs/ACCESSIBILITY.md.

Analytics (GA4 + Consent Mode)
- GA4 intégré sur toutes les pages, ID actuel: G-VCB3QB5P4L.
- Consent Mode v2: analytics_storage à denied par défaut; IP anonymisée.
- Cookie banner simple (js/script.js) permettant Accepter/Refuser (stocké dans localStorage).
- Événements envoyés:
  - phone_click (tel:…), whatsapp_click (wa.me), email_click (mailto:), cta_contact_click (/contact/).
- Détails: docs/ANALYTICS_GA4.md.

Structure du projet
- index.html, services/, realisations/, contact/, mentions/, pages régionales, etc.
- css/style.css: styles principaux.
- js/script.js: modules UI, accessibilité, events GA4, breadcrumb, cookie banner.
- netlify.toml: headers, cache, redirects.
- sitemap.xml et robots.txt.
- .github/workflows/ci.yml: Quality Gate.
- .pa11yci.json, .htmlhintrc, .stylelintrc.json, .eslintrc.json, .markdownlint.json: configs de qualité.

Contribution
- Règles: docs/CONTRIBUTING.md
- Guides:
  - docs/SEO_GUIDE.md
  - docs/CONTENT_GUIDELINES.md
  - docs/ACCESSIBILITY.md
  - docs/ANALYTICS_GA4.md
  - docs/RELEASE_CHECKLIST.md

Licence
- MIT — voir LICENSE.

