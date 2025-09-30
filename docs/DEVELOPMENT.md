# Guide de développement

Ce guide explique comment travailler localement, lancer les vérifications, et ajouter des pages.

## Prérequis

- Node.js 20 (voir `.nvmrc`)
- Un serveur statique local (http-server, live-server, VS Code Live Server)

## Lancer le site en local

```
npx http-server -p 8080
# Ouvrez http://localhost:8080
```

## Vérifications locales

- HTML:
  ```
  npx htmlhint "**/*.html" --config .htmlhintrc
  ```
- CSS:
  ```
  npx stylelint "css/**/*.css" --config .stylelintrc.json
  ```
- JS:
  ```
  npx eslint "js/**/*.js" --config .eslintrc.json
  ```
- Accessibilité (Pa11y):
  ```
  npx pa11y-ci -c .pa11yci.json
  ```
- Liens (local HTML):
  Utiliser la CI (lychee) ou un outil local de votre choix.

## Ajouter une nouvelle page

- Créer un dossier `ma-page/` avec un `index.html`
- Inclure:
  - `<link rel="canonical">` pointant vers l’URL finale
  - OG/Twitter Cards
  - JSON-LD adapté si besoin (Service, Article, FAQPage, BreadcrumbList)
  - Skip link en début de `<body>`
  - `<main id="main-content">` avec un seul `<h1>`
  - Image héro avec `fetchpriority="high"` + `width/height`
- Mettre à jour `sitemap.xml` (ajouter la page, `lastmod`, `changefreq`, `priority`).

## Analytics

- L’ID GA4 (Consent Mode v2) est défini dans chaque page.
- Éviter la duplication: conserver l’ordre des scripts, ne pas déplacer le snippet.
- Le consentement utilisateur est géré par `js/script.js` (bannière cookies).

## Netlify

- `netlify.toml` définit:
  - Headers de sécurité
  - Caching des assets
  - Redirections (ex: `/services` → `/services/`)
- Déployer via Netlify (push sur `main` déclenche le build/deploy).

## Conseils qualité

- Garder les textes concis, utiles et orientés SEO.
- Préserver la cohérence de la navigation, des CTA et du footer.
- Tester les interactions au clavier (Tab, Shift+Tab, Escape).