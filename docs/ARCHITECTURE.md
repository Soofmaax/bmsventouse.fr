# ARCHITECTURE — BMS Ventouse

Ce document décrit l’architecture technique actuelle du site bmsventouse.fr après les optimisations 2025.

## 1. Vue d’ensemble

- Type: site vitrine statique (HTML/CSS/JS, aucun backend).
- Hébergement: Netlify (déploiement depuis la branche `main`).
- Objectifs:
  - Scores élevés Lighthouse (Performance / Accessibilité / Bonnes pratiques / SEO).
  - Conformité RGAA/WCAG au maximum.
  - Sécurité renforcée (CSP stricte, headers HTTP, pas de secrets).
  - Maintenance simple: pas de build, aucun bundler, pas de framework lourd.

Arborescence principale:

- Racine:
  - `index.html` – page d’accueil.
  - Multiples pages de services / villes (`/services/`, `/ventousage-paris/`, etc.).
  - `robots.txt`, `sitemap.xml`, `site.webmanifest`.
- CSS:
  - `css/style.css` – feuille unique, organisée par blocs (variables, reset, layout, composants, responsive, dark mode, patches).
- JS:
  - `js/script.js` – unique script client modulé par fonctions.
- Config:
  - `netlify.toml` – build, headers, cache, redirects.
  - Lint: `.htmlhintrc`, `.stylelintrc.json`, `.eslintrc.json`, `.markdownlint.json`.
  - Sécurité: `.gitleaks.toml`, `SECURITY.md`.

## 2. Frontend — HTML

Chaque page HTML suit un gabarit commun:

- `<head>`:
  - SEO:
    - `<title>`, `<meta name="description">`, `<link rel="canonical">`.
    - Open Graph / Twitter Cards.
    - JSON‑LD (Service, FAQPage, BreadcrumbList selon la page).
  - Performance:
    - `<meta name="color-scheme" content="light dark">`.
    - `preload` CSS et JS, `preconnect` vers Google Tag Manager/Analytics.
    - `fetchpriority="high"` sur l’image héro principale.
  - Accessibilité:
    - `lang="fr"`, viewport mobile, charset UTF‑8.
  - Analytics:
    - Script GA4 (gtag.js) + consent mode dans le head.
    - Meta `gtm-id` pour GTM (chargement dynamique côté JS).

- `<body>`:
  - Header:
    - `<header class="header">` sticky, avec logo, nav et menu mobile.
    - Bannière promo `.promo-banner` sous le header.
  - Navigation:
    - Menu desktop: `<ul id="navLinks" class="nav-links">`.
    - Menu mobile: bouton `.hamburger`, overlay `.nav-overlay`.
    - Sous‑menu global “Pages” injecté dynamiquement à partir de `sitemap.xml`.
  - Contenu:
    - `main#main-content` avec:
      - Section héro `.hero`.
      - Sections `.section` (services, villes, FAQ, CTA, etc.).
  - Footer:
    - `.footer` avec 4 colonnes: Branding, Navigation, Territoires, Contact/Légal.
    - Liens de contact (tel, mail, WhatsApp) + gestion cookies.
  - Éléments transverses:
    - Bouton flottant WhatsApp `.whatsapp-float`.
    - Bouton “Retour en haut” `.back-to-top`.
    - Bannière cookies injectée par JS.

## 3. Frontend — CSS (`css/style.css`)

Organisation:

1) Variables & fondations:
   - `:root` définit:
     - Palette de couleurs (orange primaire, tons sombres/clairs).
     - Typographie (Inter, tailles relatives).
     - Layout (container, spacing, hauteurs header/bannière).
     - Composants (rayons, shadows, transitions).
   - Mode sombre:
     - `body.dark-theme` (optionnel) + `@media (prefers-color-scheme: dark)` pour couleurs.
     - Palette adaptée pour contrastes (fond #0f172a, cartes #1e293b, textes #f1f5f9, liens bleus).

2) Reset & accessibilité:
   - Reset basique (margin, padding, box-sizing).
   - `.skip-link` visible au focus.
   - `.visually-hidden`.
   - `:focus-visible` pour outline cohérent.

3) Structure:
   - `.container`, `.section`, `.section-title`, `.section-subtitle`.
   - Header/nav:
     - `.header`, `.nav`, `.logo`, `.nav-links`, `.nav-link`, `.nav-link.btn`.
     - Menu mobile via `.hamburger` + `.nav-links.active` + `.nav-overlay.active`.
     - Sous-menu `.nav-submenu` + `.nav-submenu-group`.

4) Composants:
   - Boutons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-whatsapp`.
   - Cartes: `.service-card`, `.service-card-visual`, `.reference-card`, `.zone-card`, `.contact-card`, `.stat-item`, `.coverage-note-card`, `.legal-section`.
   - Bannière urgence: `.urgency-banner`, `.urgency-content`, `.urgency-buttons`.
   - FAQ: `.faq-container`, `.faq-item`, `.faq-question`, `.faq-answer`.
   - Carrousel: `.references-carousel`, `.carousel-track`, `.carousel-control`.
   - Divers:
     - `.whatsapp-float`.
     - `.back-to-top`.
     - `.scroll-progress` + classes discrètes `.scroll-progress-p0`…`p20`.

5) Footer:
   - `.footer`, `.footer-main`, `.footer-content`, `.footer-brand`, `.footer-links`, `.footer-column`.
   - Contraste renforcé:
     - Fond #1e293b, texte #f1f5f9.
     - Liens footer `#f1f5f9` → `#ffffff` au hover.

6) Dark mode:
   - Blocs dédiés pour:
     - `body`, `.section`, cartes, FAQ, boutons secondaires, bannière.

7) Responsive:
   - Breakpoints principaux: 600px, 768px.
   - Adaptations:
     - Hero (taille texte, hauteur, disposition).
     - Grilles (.services-grid, .zones-grid…).
     - Footer en colonne sur mobile.
     - Dimensionnement du bouton WhatsApp.

## 4. Frontend — JavaScript (`js/script.js`)

Approche: script unique mais découpé en modules (fonctions) initialisés dans un `DOMContentLoaded` global.

Modules principaux:

- Navigation:
  - `setupHamburgerMenu()`:
    - Gère ouverture/fermeture menu mobile.
    - Focus trap (Tab, Shift+Tab) + fermeture via ESC / click overlay.
    - ARIA: `aria-expanded`, `aria-controls`.
  - `setupAllPagesSubmenu()`:
    - Récupère `sitemap.xml` (fetch).
    - Construit un sous‑menu “Pages” groupé (Services, Ventousage, Sécurité, Villes, Autres).
    - Lazy build au premier clic pour alléger le DOM initial.

- Animations & UX:
  - `setupScrollAnimations()`:
    - IntersectionObserver sur `.animated-item`.
    - Ajout `.is-visible` pour transition (stagger géré en CSS).
  - `setupBackToTop()`:
    - Affiche/masque `.back-to-top` selon scroll.
  - `setupScrollProgress()`:
    - Barre fixe en haut, met à jour classe `.scroll-progress-pX` basée sur la progression de page.

- Contenus:
  - `setupFaqAccordion()`:
    - Accordion accessible (ARIA, clavier).
    - Gère ouverture exclusive d’un item.
  - `setupReferencesCarousel()`:
    - Carrousel horizontal simple via scrollTo.
  - `setupBreadcrumbs()`:
    - Injecte un fil d’ariane visible sous le header + JSON‑LD `BreadcrumbList`.

- Cookies & Analytics:
  - `setupCookieBanner()`:
    - Crée une bannière cookie (dialog).
    - Stocke la décision dans `localStorage` (`bms_cookie_consent`).
    - Met à jour GA4 `analytics_storage` selon consentement.
  - `setupAnalyticsEvents()`:
    - Enregistre les clics sur:
      - `tel:`, `mailto:`, liens WhatsApp, liens vers `/contact/`.
    - Émet vers `gtag` + `dataLayer` (GA4/GTM).
  - `setupClarity()` + `loadClarityIfConsented()`:
    - Charge Microsoft Clarity uniquement si consentement accepté.

- Intégrations:
  - `setupGTM()`:
    - Charge GTM dynamiquement via meta `gtm-id` ou `window.GTM_ID`.
  - `setupContactSuccessNotice()`:
    - Ajoute un message de succès sur /contact/ ou /devis/ si `?success=1`.
  - `setupContactLeadCapture()`:
    - Capture les champs du formulaire contact.
    - Envoie vers fonction Netlify `/.netlify/functions/zoho_lead` (non bloquant).
    - Stocke email/téléphone dans `localStorage` pour promotions.
  - `replaceLegacyEmail()`:
    - Remplace automatiquement `bms.ventouse@gmail.com` par `contact@bmsventouse.fr` dans les liens mailto et le texte.

- Parallax:
  - `setupHeroParallax()`:
    - Module neutre: l’effet parallax est volontairement désactivé (commenté) pour respecter une CSP stricte (pas de styles inline). Le visuel du hero est géré uniquement via le CSS.

## 5. Sécurité & CSP

Configuré principalement dans `netlify.toml`:

- Headers:
  - `X-Frame-Options = DENY`
  - `X-Content-Type-Options = nosniff`
  - `Referrer-Policy = strict-origin-when-cross-origin`
  - `Strict-Transport-Security` (HSTS 1 an, includeSubDomains, preload).
  - `Permissions-Policy` (caméra/micro/géoloc/USB/payment désactivés).
  - COOP/COEP/CORP pour isolation d’origine.
  - `Trusted-Types = default`.

- CSP (sans `'unsafe-inline'`):
  - `style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com`
  - `script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms`
  - `img-src 'self' data: https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms`
  - `frame-ancestors 'none'`, `form-action 'self'`, `base-uri 'self'`.

Conséquences:
- Pas de `element.style` dans JS (remplacé par classes CSS).
- Le maximum d’inline styles a été réduit; ce qui reste est décoratif / legacy (documenté dans TODO).

## 6. CI / Qualité

CI GitHub Actions (voir `.github/workflows/ci.yml`):

- Super‑Linter:
  - HTMLHint, Stylelint, ESLint, Markdownlint, GitHub Actions lints.
- Pa11y CI:
  - Audit WCAG2AAA sur pages clés.
- CodeQL:
  - Analyse de sécurité JS.
- Gitleaks:
  - Détection de secrets.
- npm audit:
  - Contrôle des dépendances (tooling).

Exécution:
- Sur push/PR.
- Tâcha planifiée mensuelle.

## 7. Pages clés et patterns

- Pages principales:
  - `/` — accueil.
  - `/services/`, `/realisations/`, `/contact/`, `/mentions/`.
  - Pages locales: `/ventousage-paris/`, `/ventousage-lyon/`, etc.
  - Pages verticales: `/securite-plateaux/`, `/signalisation-barrierage/`, etc.

- Patterns réutilisés:
  - Layout: header + hero + sections + CTA + footer.
  - Sections:
    - Grilles `.services-grid-visual`, `.zones-grid`.
    - Cartes `.service-card-visual`, `.zone-card`, `.reference-card`.
    - FAQ `.faq-container`.
  - Footers:
    - Même structure sur toutes les pages pour cohérence UX et SEO local (NAP).

Cette architecture reste volontairement simple, lisible, et orientée “static site” pour maximiser la performance, la sécurité et la maintenabilité.