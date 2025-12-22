# Plan d’action SEO/Accessibilité/Qualité - BMS Ventouse

Dernière mise à jour : 2025-12-22

## Objectifs

- Renforcer SEO technique (métadonnées, données structurées, sitemap, robots).
- Améliorer l’accessibilité et l’expérience (skip‑link, gestion focus, consentement).
- Outiller le dépôt pour garantir la qualité continue (lint, accessibilité, liens, CI).

## Priorités

### P0 : Déjà fait

- Harmonisation Open Graph (og:site_name) et Twitter Cards sur pages clés.
- Suppression des meta keywords résiduels (index, contact).
- Ajout liens « Infos IA » (llms.txt principal, ai.txt alias) en pied de page.
- Page « Infos IA » lisible humain (/infos-ia/) + ajout au sitemap.
- Corrections accessibilité/perf (width/height/fetchpriority sur images héros).
- Ajout contenus de référence (contenu_markdown/*.md).
- GA4 + Consent Mode v2 en place (ID : G-VCB3QB5P4L).
- Pages locales principales et pages spécialisées créées (ventousage grandes villes, logistique 93/77/95, shootings & défilés, convoyage, sécurité/gardiennage).
- Politique IA enrichie dans llms.txt (cibles, personas, zones France+Belgique, déclencheurs) et simplification de ai.txt en alias vers llms.txt.

### P1 : À faire ensuite (1–2 jours homme)

- Créer une page « Confidentialité / Politique de confidentialité » et l’ajouter au footer.
- Ajouter un lien persistant « Gérer les cookies » pour rouvrir le choix de consentement.
- Déporter les styles inline de la bannière cookies et du breadcrumb vers /css/style.css.
- Soumettre sitemap.xml dans Google Search Console (propriété domaine + URL-prefix).
- Activer les règles de protection de branche GitHub : PR obligatoire + check CI requis.

### P2 : À planifier (semaine à venir)

- Mettre en place Lighthouse CI (perf/SEO/A11Y) sur PR non bloquant au début.
- Étendre Pa11y (AAA) à davantage d’URLs internes (pages locales).
- Uniformiser « Twitter Cards » sur toutes les futures pages (gabarit commun).
- Renforcer CSP via netlify.toml (et retirer les meta CSP redondantes).
- Ajouter une page 404 plus riche (liens vers pages locales supplémentaires).
- Remplacer globalement les anciennes icônes Font Awesome `<i class="fas …">` par les SVG inline déjà utilisés (CTA, cartes, zones), pour un rendu cohérent et sans dépendance externe.
- Créer/configurer proprement les comptes externes :
  - GA4 : vérifier la propriété dédiée BMS Ventouse, déclarer `contact_submitted` comme conversion principale + micro‑conversions `phone_click` / `whatsapp_click`, et créer 1–2 audiences utiles (ventousage Paris, shootings & défilés).
  - Google Search Console : propriété domaine déjà prévue en P1, compléter avec quelques rapports réguliers (performances, couvertures, sitemaps).
  - Bing Webmaster Tools : ajouter le site, déclarer le sitemap (couvre Bing / Yahoo / DuckDuckGo / Brave Search) et vérifier que le flux IndexNow du dépôt fonctionne bien.
  - Microsoft Clarity : confirmer l’ID de projet, filtrer les IP internes si besoin, vérifier au moins une session de navigation réelle.

### P3 : Opportunités

- Créer nouvelles pages locales (Lyon, Marseille, Bordeaux…) et maillage interne.
- Ajouter témoignages clients visibles si vous souhaitez activer des Ratings plus tard.
- Blog court « opérations / tournage » (glossaire, procédures, checklists).

## Découpage par tâches

- SEO
  - [ ] Page Confidentialité + lien footer
  - [ ] Lighthouse CI (performance/SEO/accessibilité)
  - [ ] GSC : vérification, sitemaps, inspection d’URLs
- Accessibilité/UX
  - [ ] Lien « Gérer les cookies » (ouvre consent manager)
  - [ ] Styles du breadcrumb en CSS (supprimer styles inline JS)
  - [ ] Pa11y URLs étendues
- Technique
  - [ ] CSP via netlify.toml (script-src, style-src, img-src, font-src)
  - [ ] Variables CONFIG pour constantes (JS) documentées
- Contenu
  - [ ] Pages locales nouvelles (3+) + intégration sitemap + liens internes
  - [ ] Témoignages visibles (si activation schema AggregateRating à terme)

## Estimation

- P1 : 1–2 jours homme total (Confidentialité, consent link, CSS, GSC, branch rules).
- P2 : 2–3 jours homme (Lighthouse CI, Pa11y étendu, CSP, gabarits Twitter Cards).
- P3 : au fil de l’eau selon la disponibilité et les priorités business.

## Ordre d’exécution recommandé

1) Page Confidentialité + lien footer + lien « Gérer les cookies ».
2) Déporter styles cookies/breadcrumb en CSS, variables CONFIG JS.
3) GSC : soumission sitemap + inspection des principales URLs.
4) Branch protection + checks CI requis.
5) Lighthouse CI non bloquant, Pa11y étendu, CSP via headers.
6) Pages locales + maillage interne + mise à jour sitemap.