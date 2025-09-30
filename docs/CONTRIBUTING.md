# Contribuer au projet

Flux de travail
- Créez une branche à partir de main: feature/xxx ou fix/xxx.
- Commits clairs et atomiques (français ou anglais, peu importe tant que c’est précis).
- Ouvrez une Pull Request vers main.

Règles de qualité (avant PR)
- Lancer les lints: HTMLHint, Stylelint, ESLint.
- Vérifier les liens internes (lychee).
- Tester l’accessibilité sur les pages modifiées (Pa11y CI en local si possible).
- Mettre à jour `sitemap.xml` (lastmod) pour toute nouvelle page.
- Vérifier la cohérence SEO (title, meta description, canonical, OG/Twitter).

CI et protection de branche
- Le job `lint-and-validate` est bloquant.
- Corrigez tout échec avant de demander le merge.

Style et conventions
- H1 unique par page.
- Balises alt descriptives (pas d’alt “image”).
- Og:image 1200x630 recommandé; utilisez une image dédiée si possible.
- Respecter les patterns existants (menu, footer, sections).

Gabarits utiles
- Voir docs/SEO_GUIDE.md et docs/CONTENT_GUIDELINES.md pour les modèles de pages (Service, FAQ, Local).