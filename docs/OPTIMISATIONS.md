# OPTIMISATIONS — BMS Ventouse (2025)

Ce document recense les optimisations réalisées sur le site et les axes d’amélioration restants pour viser des scores proches de 100/100 sur Lighthouse (Performance, Accessibilité, Bonnes pratiques, SEO) et une note A+ sur Mozilla Observatory.

## 1. Objectifs et périmètre

Objectifs:

- PageSpeed Insights:
  - Performance (mobile): ≥ 90
  - Accessibilité: 100
  - Bonnes pratiques: 100
  - SEO: 100
- Sécurité:
  - Mozilla Observatory: A/A+
  - CSP sans `'unsafe-inline'` sur `script-src` et `style-src`
- Accessibilité:
  - Éliminer les erreurs de contraste et de hiérarchie de titres.
  - Respecter au mieux WCAG 2.1 AA (voir Pa11y CI).

Périmètre:

- Pages principales: `/`, `/services/`, `/ventousage-paris/`, `/contact/`, `/mentions/`, `/realisations/`.
- Templates réutilisés: header, hero, sections `.section`, footer, cartes services/villes, FAQ.

---

## 2. Optimisations de performance

### 2.1. Images & LCP

- Héros:
  - Ajout de `width`/`height` explicites sur les images héro pour supprimer le CLS.
  - `fetchpriority="high"` et `loading="eager"` uniquement sur l’image hero principale.
  - Sources responsive:
    - WebP + JPEG de fallback, `srcset` + `sizes` adaptés.
- Lazy loading:
  - `loading="lazy"` sur toutes les images non critiques (cartes de services, références, images de sections).
- Cache:
  - `netlify.toml`: `Cache-Control` agressif sur `/css/*`, `/js/*`, `/images/*` (1 an, `immutable`).

Impact attendu:

- Réduction du LCP (objectif: 2,5–3,5 s en 4G lente).
- CLS ~ 0.
- Meilleure note “Serve images in next-gen formats / Properly size images”.

### 2.2. CSS & JS

- CSS:
  - Consolidation dans `css/style.css` (design system + composants).
  - Suppression de doublons de blocs.
  - Déplacement de corrections spécifiques (FAQ, hero, menu mobile) dans des sections finales pour éviter la dispersion.
- JS:
  - Passages à l’IntersectionObserver pour les animations de scroll (pas de timers/pièges).
  - Suppression des `element.style.*` dans `js/script.js` (remplacés par des classes CSS).
  - Usage systématique de `addEventListener` (pas d’`onclick` inline).
  - `defer` sur `<script src="/js/script.js">` sur les pages clés.

Impact attendu:

- Diminution du Total Blocking Time (TBT).
- Meilleure note Lighthouse “Réduisez les ressources JS/CSS inutilisées”.
- JS plus compatible avec CSP stricte (pas de style inline généré).

---

## 3. Optimisations d’accessibilité

### 3.1. Contraste

- Global:
  - Couleur des liens en mode clair:
    - Avant: basé sur `var(--color-primary)` (orange) → risques de contraste insuffisant sur fond blanc.
    - Maintenant: `a { color: #1a56db; }` / `a:hover { color: #0d3d8f; }` (ratio ≥ 4,5:1).
- Texte secondaire:
  - `.section-subtitle` → `#4b5563` au lieu d’un gris trop clair.
- Footer:
  - Fond: `#1e293b`.
  - Texte: `#f1f5f9`.
  - Liens: `#f1f5f9` → `#ffffff` au hover.
  - Description: `#cbd5e1`.
- Bannière promo:
  - Fond: `linear-gradient(135deg, #ff8c42, #ff6b35)`.
  - Texte: `#000000 !important`.

### 3.2. Dark mode

- Mode sombre (via `prefers-color-scheme: dark`):
  - Fond global: `#0f172a`, textes `#f1f5f9`.
  - Sections/cartes/FAQ: fond `#1e293b`, bordures `#475569`, texte clair.
  - Liens: `#60a5fa` / hover `#93c5fd`.
  - Boutons secondaires: bordures/texte bleus (`#60a5fa`).
  - Bannière promo: texte noir (`#000000`), fond dégradé orange.
- Compatibilité:
  - Hero: overlay sombre garantissant la lisibilité du texte en clair et en sombre.
  - Menu header:
    - `.header.header-transparent .nav-link` forcés en blanc pour rester visibles.

### 3.3. Sémantique & structure

- Headers:
  - 1 seul `<h1>` par page (hero).
  - `<h2>` pour les sections principales (`.section-title`).
  - `<h3>` pour les titres de cartes (services, villes, FAQ, etc.).
  - Sur plusieurs pages, les `<h4>` de footer ont commencé à être remplacés par des `<p class="footer-title">` pour éviter les sauts de niveau. (TODO: généraliser à toutes les pages).
- Navigation:
  - Header:
    - Bouton hamburger avec `aria-expanded`, `aria-controls`, gestion clavier.
  - Sous-menu “Pages”:
    - Bouton avec `aria-haspopup="true"`, `aria-expanded`, fermeture via ESC/clic extérieur.
- FAQ:
  - Boutons `.faq-question` avec `aria-expanded`, `aria-controls`, `role="button"`, activation via clavier (Enter/Space).
  - `.faq-answer` en `role="region"` avec `aria-labelledby`.

### 3.4. Composants spécifiques

- Bannière cookie:
  - Role `dialog`, `aria-live="polite"`.
  - Liens vers mentions légales pour les détails.
- Bouton “Retour en haut”:
  - Lien avec texte visuel et `aria-label` implicite par le contenu (flèche + contexte).
- Bouton WhatsApp flottant:
  - Taille et emplacement adaptés en mobile, contraste fort.

---

## 4. Optimisations SEO

- Métadonnées:
  - Titles & meta descriptions uniques, cohérents et optimisés sur les pages clés.
  - Canonical absolues (`https://www.bmsventouse.fr/...`).
  - Open Graph/Twitter homogènes, images 16:9.
- JSON‑LD:
  - Home:
    - `ProfessionalService` / `LocalBusiness`.
  - Pages services:
    - `Service` + `FAQPage` si Q/R disponibles.
  - Fil d’Ariane:
    - `BreadcrumbList` en JSON‑LD et fil visuel injecté par JS.
- Maillage interne:
  - Liens contextuels entre:
    - Ventousage, affichage riverains, signalisation, sécurité, convoyage, etc.
    - Pages ville `/ventousage-*` et pages métier.

Impact:

- SEO Lighthouse déjà à 100.
- Meilleure compréhension du site par Google (services, zones, FAQ).

---

## 5. Optimisations de sécurité

- Headers Netlify:
  - `X-Frame-Options = DENY`.
  - `X-Content-Type-Options = nosniff`.
  - `Referrer-Policy = strict-origin-when-cross-origin`.
  - `Strict-Transport-Security` (1 an, includeSubDomains, preload).
  - `Permissions-Policy` (caméra, micro, géoloc, USB, payment désactivés).
  - Isolation:
    - `Cross-Origin-Opener-Policy = same-origin`.
    - `Cross-Origin-Embedder-Policy = require-corp`.
    - `Cross-Origin-Resource-Policy = same-origin`.
  - `Trusted-Types = default`.
- CSP (sans `'unsafe-inline'`):
  - `default-src 'self'`.
  - `style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com`.
  - `script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms`.
  - `img-src 'self' data: https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms`.
  - `connect-src` limité à self + GA + Clarity.
  - `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`.

- JavaScript:
  - Suppression de tout `element.style` dans `js/script.js`.
  - Aucune dépendance tierce lourde (pas de jQuery, pas de framework).

Impact attendu:

- Gain de note sur Mozilla Observatory (visé: A/A+).
- Résistance accrue aux XSS et attaques de type injection.

---

## 6. Autres améliorations

- Nettoyage email:
  - `replaceLegacyEmail()` remplace systématiquement `bms.ventouse@gmail.com` par `contact@bmsventouse.fr`.
- Harmonisation contact:
  - Numéros, mail et WhatsApp alignés sur toutes les pages + footer.
- Documentation:
  - Ajout / consolidation de:
    - `docs/ARCHITECTURE.md`.
    - `docs/DEPLOYMENT.md`.
    - `docs/OPTIMISATIONS.md`.
    - `docs/SCORES.md`.
    - `docs/TODO.md`.

---

## 7. Pistes restantes (haut niveau)

Voir `docs/TODO.md` pour la liste détaillée. En résumé:

- Remplacer tous les `style="..."` inline par des classes CSS (surtout marges/line-height/max-width).
- Harmoniser tous les footers:
  - `<h4>` → `<p class="footer-title">` sur 100 % des pages.
- Vérifier et ajuster les “tap targets” en mobile pour les petits liens texte (footer/maillage interne).
- Affiner la compression des plus grosses images héro (WebP/JPEG) pour gagner quelques dizaines de Ko et améliorer le LCP.
- Optionnel: supprimer `X-XSS-Protection` (header obsolète) si Lighthouse le signale encore comme “API obsolète”.

Ces actions visent à gratter les derniers points pour atteindre ou approcher le 100/100 sur toutes les métriques et les outils d’audit (PageSpeed, WAVE, Observatory).