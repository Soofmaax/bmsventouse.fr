[← Retour à l’index de la documentation](./README.md)

# Accessibilité (A11y)
[Docs](./README.md) • [Dév](./DEVELOPMENT.md) • [SEO](./SEO_GUIDE.md) • [A11y](./ACCESSIBILITY.md) • [Analytics](./ANALYTICS_GA4.md) • [Contenu](./CONTENT_GUIDELINES.md) • [Release](./RELEASE_CHECKLIST.md) • [Contrib](./CONTRIBUTING.md)

Objectifs
- Garantir une navigation clavier fluide.
- Fournir des informations alternatives suffisantes.
- Maintenir un contraste et une hiérarchie clairs.

Principes clés
- Navigation
  - Skip link au début du body: <a href="#main-content" class="skip-link">Aller au contenu</a>
  - Menu mobile: focus trap, fermeture via Échap.
  - Ordre du tab cohérent; pas de tabindex > 0.
- Titres
  - Un H1 unique par page.
  - Hiérarchie H2/H3 logique et continue.
- Images
  - Alt text utile, contextualisé.
  - Images décoratives: alt="" uniquement si strictement décoratives.
- Couleurs/contrastes
  - Respecter WCAG AA a minima; éviter le texte faible contraste.
- Composants interactifs
  - Boutons et liens: rôle par défaut suffisant; aria-* si nécessaire.
  - Zones dynamiques: aria-live si besoin (ex. bannières).
- Formulaires (si ajoutés plus tard)
  - Label associé, messages d’erreur explicites, champs requis indiqués.

Audit automatique
- Pa11y CI (WCAG2AAA) présent en CI (non bloquant).
- Lancer en local:
  - npx http-server -p 8080 &
  - npx pa11y-ci

Performance liée à l’a11y
- Héros avec width/height limite le CLS.
- fetchpriority="high" pour l’image LCP (1 par page).