# Démarrage développeur

Prérequis
- Node.js 18+ (recommandé Node 20) ou Python 3.
- Accès au dépôt GitHub et à Netlify (si vous déployez).

Lancer en local (au choix)
- npx http-server -p 8080
- python3 -m http.server 8080

Puis ouvrir http://localhost:8080

Qualité (lint & tests rapides)
- HTML: npx -y htmlhint "**/*.html" --config .htmlhintrc
- CSS: npx -y -p stylelint -p stylelint-config-standard stylelint "css/**/*.css" --config .stylelintrc.json
- JS: npx -y eslint "js/**/*.js" --config .eslintrc.json
- Liens internes: npx -y lychee --no-progress --retry 1 --timeout 20 --exclude-mail --exclude "https?://.*" "**/*.html"
- Accessibilité: 
  - npx -y http-server -p 8080 &
  - npx -y pa11y-ci

CI GitHub (Full Quality Gate)
- Job bloquant: lint-and-validate (Super-Linter, lychee interne, Taplo).
- Job non bloquant: quality (Pa11y AAA, lychee externe).

Déploiement Netlify
- netlify.toml gère headers, cache et redirections.
- La branche principale est publiée depuis la racine du dépôt.

Outils complémentaires
- Optimisation images: utilisez des webp pour les héros/médias clés (avec fallback jpg).
- Vérification OG/Twitter Cards: https://developers.facebook.com/tools/debug/ et https://cards-dev.twitter.com/validator