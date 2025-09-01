# BMS Ventouse – Site Portfolio (FR)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node version](https://img.shields.io/badge/node-%3E%3D%20v20-339933?logo=node.js)](https://nodejs.org/)
[![Lighthouse CI](https://github.com/Soofmax/bmsventouse.fr/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/Soofmax/bmsventouse.fr/actions/workflows/lighthouse.yml)
[![Build & Tests](https://github.com/Soofmax/bmsventouse.fr/actions/workflows/build.yml/badge.svg)](https://github.com/Soofmax/bmsventouse.fr/actions/workflows/build.yml)

Démo : [https://www.bmsventouse.fr](https://www.bmsventouse.fr)

---

## 📌 Contexte & Propriété

- Projet réel livré pour un client: **BMS Ventouse**. Site statique professionnel, en production.
- Ce dépôt sert aussi de vitrine/portfolio côté code.
- Licences:
  - Le **code** est sous licence [MIT](LICENSE).
  - Les **contenus et éléments de marque** (textes, images, logos, identité) sont réservés — voir [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
  - Les **actifs tiers** sont listés/attribués dans [NOTICE](NOTICE).
- Contributions bienvenues pour le code (performances, accessibilité, qualité), en respectant strictement les droits sur contenus/marques.

---

## 🧰 Stack & Outils

- Générateur statique: **Eleventy v3** (Nunjucks)
- Qualité: **Prettier**, **Stylelint**, **ESLint**
- Tests: **Cypress** + **cypress-axe** (accessibilité)
- Perf: **Lighthouse CI** + budgets
- Déploiement: **Netlify**
- Node: version >= 20 (voir [.nvmrc](.nvmrc))

---

## 🚀 Fonctionnalités principales

- **Performance & SEO** : HTML minifié, sitemap, robots.txt, budgets Lighthouse, responsive images (AVIF/WebP/JPEG)
- **Accessibilité** : skip-link, navigation clavier, tests automatiques axe-core/cypress-axe, ARIA, dark mode
- **UX moderne** : carrousel accessible (clavier/swipe), thème sombre/clair persistant, bouton retour en haut, transitions smooth
- **Analytics & Vie privée** : Plausible (RGPD), tracking CTA Click, Web Vitals (LCP/CLS), sans cookies
- **PWA** : Offline, assets statiques pré-cachés, registration automatique (sw.js)
- **Sécurité** : CSP forte compatible analytics, HSTS, COOP, CORP, Permissions-Policy, Netlify headers
- **Qualité continue** : Lighthouse CI, budgets, tests a11y sur pages clés
- **Images optimisées** : pipeline Eleventy Image + scripts/optimize-images.js
- **CI/CD Netlify** : build, lint, test, budgets, déploiement auto

---

## 🗂️ Structure

```
src/
  _includes/         # Gabarits layouts, macros, header/footer, SEO, etc.
  _data/             # Données globales (site.json, locales)
  pages, services/   # Pages
css/                 # Styles principaux (style.css)
js/                  # Scripts front (script.js)
images/              # Images sources (optimisées au build)
cypress/             # Tests e2e et accessibilité (cypress-axe)
netlify.toml         # Config Netlify (headers, redirects, build)
.eleventy.js         # Config Eleventy (plugins, i18n, filters)
sw.js                # Service Worker PWA
lighthouse-budgets.json # Budgets Lighthouse (poids, timings)
```

---

## ⚙️ Prérequis & Installation

- Node.js **>= 20** (voir [.nvmrc](.nvmrc))
- npm v9+
- Plausible account (pour analytics)
- Netlify (pour déploiement/preview)

```sh
npm ci
npm run dev           # Développement local (localhost:8080)
npm run build         # Génération du site statique (_site/)
npm run optimize:images  # Optimisation images (images/ -> AVIF/WebP/JPEG)
```

---

## 💡 Scripts utiles

- `npm run format` – formatage Prettier
- `npm run lint:css` – stylelint sur CSS
- `npm run lint:html` – htmlhint sur layouts/pages
- `npm run lint:js` – ESLint (zéro warning en CI)
- `npm run test:e2e` – tests end‑to‑end cypress
- `npm run test:a11y` – tests accessibilité axe sur pages clés
- `npm run ci:lh` – Lighthouse CI (budgets/perf)
- `npm run optimize:images` – pipeline d’optimisation images
- `npm run release:patch|minor|major` – release + versioning SemVer

---

## 🚀 Déploiement

- Plateforme : Netlify (config [netlify.toml])
- CI GitHub Actions : Build & Tests (Prettier, Stylelint, ESLint, a11y Cypress) + Lighthouse CI
- Build command : `npm run build`
- Publish : `_site/`
- Headers sécurité, PWA, analytics déjà intégrés

---

## 📈 Analytics et Vie Privée

- **Plausible** (server-side, sans cookies)
  - Événements suivis: `CTA Click`, Web Vitals (LCP, CLS)
  - Conversion: Goal “CTA Click” (type, label, href, location)
- **Aucune donnée nominative collectée**

---

## ♿ Accessibilité

- **Tests automatiques** : axe-core via cypress-axe, script `test:a11y`
- **Features** : skip-link, ARIA nav/landmarks, navigation clavier, dark mode, focus visible

---

## ⚡ Performance

- **Budgets Lighthouse** : voir [lighthouse-budgets.json]
- **CI** : assertion perf/a11y/SEO + budgets via workflow GitHub Actions

---

## 🛠️ PWA

- Fichier : [sw.js]
- Caching offline de /, CSS, JS, manifest, images
- Registration auto (voir base.njk)

---

## 📝 Versioning & Changelog

- [CHANGELOG.md] (Keep a Changelog + SemVer)
- Scripts de release :
  - `release:prepare`, `release:patch`, `release:minor`, `release:major`
- Version courante : voir package.json

---

## 📝 Licences

- Code (templates, CSS/JS, configuration) — [MIT](LICENSE)
- Contenus & marque (textes, images, photos, logos “BMS Ventouse”, identité) — Tous droits réservés. Voir [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
- Actifs/Marques tiers — voir [NOTICE](NOTICE) pour les attributions et conditions.