# Plan d’action SEO/Accessibilité/Qualité - BMS Ventouse

Dernière mise à jour : 2025-12-29

> Ce fichier est le **backlog vivant** SEO/A11y/Qualité.  
> Les audits historiques détaillés sont dans `rapport_audit_complet.md` et `seo-analysis.md`.

## Objectifs

- Renforcer SEO technique (métadonnées, données structurées, sitemap, robots).
- Améliorer l’accessibilité et l’expérience (menu, FAQ, consentement, dark mode).
- Outiller le dépôt pour garantir la qualité continue (lint, accessibilité, liens, CI).
- Garder une trace claire des évolutions pour ton « toi du futur ».

## Priorités

### P0 : Déjà fait

SEO / contenu

- Harmonisation Open Graph (og:site_name) et Twitter Cards sur pages clés (services principaux, villes, sécurité, logistique).
- Suppression des meta keywords résiduels (index, contact).
- Ajout liens « Infos IA » (llms.txt principal, ai.txt alias) en pied de page.
- Page « Infos IA » lisible humain (/infos-ia/) + ajout au sitemap.
- Ajout contenus de référence (contenu_markdown/*.md) pour ventousage, sécurité, villes, etc.
- Pages locales principales et pages spécialisées créées (ventousage grandes villes, logistique 93/77/95, shootings & défilés, convoyage, sécurité/gardiennage).
- Politique IA enrichie dans llms.txt (cibles, personas, zones France+Belgique, déclencheurs) et simplification de ai.txt en alias vers llms.txt.
- Page « Politique de confidentialité » dédiée (/politique-confidentialite/) créée, avec lien dans le footer (colonne « Légal »).
- Conditions Générales de Prestation publiées (/conditions-generales-prestation/), avec lien footer.

Accessibilité / UX

- Corrections accessibilité/perf (width/height/fetchpriority sur images héros).
- Menu unifié injecté par JS (`setupUnifiedHeader` + `setupHamburgerMenu`) sur toutes les pages standards.
- Footer unifié injecté par JS (coordonnées, liens légaux, liens villes).
- FAQs harmonisées (titres, structure HTML `.faq-item` / `.faq-question` / `.faq-answer`, contenu cohérent par page).
- Module JS FAQ (`setupFaqAccordion`) refondu pour que la hauteur des réponses s’adapte automatiquement (plus de texte coupé) tout en gardant l’animation d’ouverture/fermeture.

Tracking / conformité

- GA4 + Consent Mode v2 en place (ID : G-V7QXQC5260) et unification de l’ID sur toutes les pages.
- Lien persistant « Gérer les cookies » dans le footer qui réinitialise le consentement et réaffiche la bannière.
- Styles du breadcrumb et de la bannière cookies déplacés dans le CSS (plus de styles inline JS).
- Événements Analytics paramétrés : `phone_click`, `whatsapp_click`, `email_click`, `cta_contact_click`, `contact_submitted` (événement prévu pour la future page hub contact).

Icônes / assets

- Remplacement global des anciennes icônes Font Awesome `<i class="fas …">` et SVG 448x512 WhatsApp par des SVG inline cohérents (Bootstrap `bi-whatsapp` et icônes personnalisées).
- Suppression de la logique de migration legacy d’anciens emails (tout est en dur en `contact@bmsventouse.fr` côté HTML).

Contact / formulaires

- Suppression de toute référence à un « formulaire » dans les pages publiques (HTML).
- Mise en cohérence de la Politique de confidentialité et de `llms.txt` avec la réalité : contact via téléphone / WhatsApp / email, pas de formulaire général pour le moment.
- Le module JS de formulaire complexe (multi-services) reste dans `script.js` mais n’est plus utilisé par aucune page (prêt pour une future page hub dédiée).

### P1 : À faire ensuite (1–2 jours homme)

Tâches côté outils externes / CI (non gérables uniquement par le code) :

- Soumettre `sitemap.xml` dans Google Search Console (propriété domaine + URL-prefix).
- Activer les règles de protection de branche GitHub : PR obligatoire + check CI requis.
- Créer/configurer proprement les comptes externes :
  - GA4 : vérifier la propriété dédiée BMS Ventouse, déclarer `contact_submitted` comme conversion principale (pour le futur formulaire hub) + micro‑conversions `phone_click` / `whatsapp_click`, et créer 1–2 audiences utiles (ventousage Paris, shootings & défilés).
  - Google Search Console : propriété domaine, rapports réguliers (performances, couvertures, sitemaps).
  - Bing Webmaster Tools : ajouter le site, déclarer le sitemap (couvre Bing / Yahoo / DuckDuckGo / Brave Search) et vérifier le flux IndexNow.
  - Microsoft Clarity : confirmer l’ID de projet, filtrer les IP internes si besoin, vérifier au moins une session réelle.

### P2 : À planifier (semaine à venir)

Qualité / CI

- Mettre en place Lighthouse CI (perf/SEO/A11Y) sur PR non bloquant au début.
- Étendre Pa11y (AAA) à davantage d’URLs internes (pages locales).
- Uniformiser « Twitter Cards » sur toutes les futures pages (gabarit commun).

Sécurité

- CSP consolidée via `netlify.toml` (headers) et meta CSP résiduelles supprimées dans les HTML (à surveiller lors des prochaines évolutions pour ne pas les réintroduire).

UX / contenu

- Ajouter une page 404 plus riche (liens vers pages locales supplémentaires, mini FAQ ou bloc explicatif).
- Nouveau flux contact (NFC / QR) :
  - Créer une landing « hub contact » dédiée (ex. `/contact-direct/`) pensée pour les cartes NFC / QR :
    - 4 entrées claires : téléphone, WhatsApp, email, mini‑formulaire unique.
    - Garder cette page comme **seul endroit** où un formulaire vit à terme.
    - Prévoir un texte court + mini FAQ pour rassurer (RGPD, réponse sous 24h, etc.).

Icônes / assets

- Remplacer globalement les derniers SVG WhatsApp hérités de Font Awesome dans le HTML par les SVG inline Bootstrap déjà utilisés (CTA, cartes, zones), pour un rendu cohérent et sans dépendance à la normalisation JS.

### P3 : Opportunités

- Créer de nouvelles pages locales (villes supplémentaires) avec maillage interne renforcé.
- Ajouter témoignages clients visibles si vous souhaitez activer des Ratings plus tard (AggregateRating).
- Blog court « opérations / tournage » (glossaire, procédures, checklists).
- Pages « coulisses » / études de cas détaillées (reliées aux Réalisations).

## Découpage par tâches

- SEO
  - [x] Page Confidentialité + lien footer
  - [ ] Lighthouse CI (performance/SEO/accessibilité)
  - [ ] GSC : vérification, sitemaps, inspection d’URLs
- Accessibilité/UX
  - [x] Lien « Gérer les cookies » (ouvre consent manager)
  - [x] Styles du breadcrumb en CSS (supprimer styles inline JS)
  - [ ] Pa11y URLs étendues
- Technique
  - [x] CSP finalisée uniquement via `netlify.toml` (meta CSP supprimées dans les HTML)
  - [x] Variables CONFIG pour constantes (JS) documentées
- Contenu
  - [ ] Pages locales nouvelles (3+) + intégration sitemap + liens internes
  - [ ] Témoignages visibles (si activation schema AggregateRating à terme)
  - [ ] Page de contact rapide / hub NFC (WhatsApp, téléphone, email + formulaire léger) via `/contact-direct/`
  - [ ] Landing « hub contact » NFC/QR dédiée (ex. `/contact-direct/`) avec 4 entrées (téléphone, WhatsApp, email, mini‑formulaire unique)

## Estimation

- P1 : 1–2 jours homme total (GSC, branch rules, premiers réglages).
- P2 : 2–3 jours homme (Lighthouse CI, Pa11y étendu, CSP, gabarits Twitter Cards, landing NFC/QR).
- P3 : au fil de l’eau selon la disponibilité et les priorités business.

## Ordre d’exécution recommandé

1) Côté outils externes : GSC (sitemap), règles de protection de branche GitHub, paramétrage GA4/Clarity/Bing.
2) Mettre en place Lighthouse CI non bloquant + étendre Pa11y.
3) Finaliser la CSP via headers `netlify.toml` (et retirer les meta CSP redondantes).
4) Créer la landing « hub contact » NFC/QR (`/contact-direct/`) et la brancher sur `/contact/` / supports physiques.
5) Continuer les pages locales + maillage interne + mise à jour sitemap.