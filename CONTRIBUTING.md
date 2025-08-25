# Contribuer au site BMS Ventouse

Bienvenue ! Ce projet applique des standards élevés de qualité, accessibilité et performance.

## Branches & PR
- Travaillez sur une branche dédiée (`feature/`, `fix/`, `chore/`)
- Ouvrez une Pull Request claire : description, screenshots si pertinent, lien issue

## Commits
- Utilisez [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/)
  - `feat: ...`, `fix: ...`, `chore: ...`
- Un seul sujet par commit

## Code style & qualité
- Formatage : `npm run format`
- Lint CSS : `npm run lint:css`
- Lint JS : `npm run lint:js`
- Lint HTML : `npm run lint:html`
- Accessibilité : `npm run test:a11y`
- Performance: vérifiez LHCI budgets (`npm run ci:lh` localement)

## Images & médias
- Maximum 900 Ko par image (voir budgets Lighthouse)
- Toujours optimiser : `npm run optimize:images`

## Avant de pousser une PR
- [ ] `npm run format`
- [ ] `npm run lint:css && npm run lint:js && npm run lint:html`
- [ ] `npm run test:a11y`
- [ ] CHANGELOG.md mis à jour si amélioration/fix
- [ ] Screenshots pour changements UI

## Budgets de perf (voir lighthouse-budgets.json)
- Respectez les seuils (total, images, scripts...)
- FCP < 1.8s, LCP < 2.2s, CLS < 0.1, TBT < 150ms

Merci !