# Release checklist (avant merge/déploiement)
[Docs](./README.md) • [Dév](./DEVELOPMENT.md) • [SEO](./SEO_GUIDE.md) • [A11y](./ACCESSIBILITY.md) • [Analytics](./ANALYTICS_GA4.md) • [Contenu](./CONTENT_GUIDELINES.md) • [Release](./RELEASE_CHECKLIST.md) • [Contrib](./CONTRIBUTING.md)

Cette liste permet d’éviter les régressions SEO/Perf/A11y.

## 1) Contenu & métadonnées

- [ ] 1 seul H1, titres H2/H3 hiérarchisés
- [ ] Title (≤ 65) et description (140–160) renseignés
- [ ] Canonical absolu correct
- [ ] Open Graph: og:title/description/url/type/image(1200×630)
- [ ] Twitter Cards: summary_large_image + title/description/image
- [ ] JSON-LD adapté (Service/FAQ/Breadcrumb/Article)
- [ ] Alignement meta ↔ OG/Twitter ↔ JSON-LD Service (name/description)
- [ ] Pages locales: wording “ventouseur [Ville]” présent (meta, OG/Twitter, JSON‑LD, contenu)
- [ ] `meta keywords` absents
- [ ] Skip link présent; `<main id="main-content">` existant

## 2) Liens & navigation

- [ ] Maillage interne ajouté (Services, Contact, pages locales)
- [ ] Aucune 404 interne (lychee)
- [ ] Redirections cohérentes (Netlify toml si modifié)

## 3) Performances

- [ ] Héros: `fetchpriority="high"` + `width/height`
- [ ] Images optimisées (webp + jpeg fallback)
- [ ] Lazy pour images non critiques
- [ ] Pas d’assets bloquants inutiles

## 4) Accessibilité

- [ ] Navigation clavier OK (Tab/Shift+Tab/Escape)
- [ ] Focus visible
- [ ] Alternatifs d’images utiles
- [ ] Pa11y CI sans erreurs majeures

## 5) Fichiers de base

- [ ] `sitemap.xml` mis à jour (URL + `lastmod`)
- [ ] `robots.txt` inchangé ou amélioré
- [ ] `netlify.toml` (headers/cache/redirects) validé (Taplo)

## 6) Analytics

- [ ] Snippet GA4 OK et ID correct
- [ ] Bannière consent présente
- [ ] Événements clés testés (tel/WA/CTA/email)

## 7) CI & PR

- [ ] CI `lint-and-validate` PASS
- [ ] Description PR claire (avant/après, impact)
- [ ] Captures si besoin (composants visuels)