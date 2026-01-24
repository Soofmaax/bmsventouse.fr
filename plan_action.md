# Plan d’action SEO/Accessibilité/Qualité - BMS Ventouse

Dernière mise à jour : 2026-01-24

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
- Création de la page régionale `/ventousage-ile-de-france/` (Service + FAQ + JSON-LD) pour couvrir explicitement l’Île-de-France et les départements proches de Paris (Oise, Somme, Aisne, Eure, Eure-et-Loir, Loiret, Yonne, Aube, Marne).
- Mise à jour des pages `ventousage-paris/` et `ventousage/` pour mieux refléter la couverture Paris + Île-de-France + villes proches (Fontainebleau, Melun, Nemours, Étampes, etc.) et renforcer le maillage interne.
- Enrichissement du `areaServed` JSON-LD de la home (LocalBusiness) avec les principales villes et départements proches de Paris où BMS intervient.
- Ajustement des H1 des sections héros (Accueil, Services, etc.) + règles CSS responsive pour éviter le texte tronqué sur mobile tout en gardant une bonne lisibilité.
- Suppression des meta keywords résiduels (index, contact).
- Ajout liens « Infos IA » (llms.txt principal, ai.txt alias) en pied de page.
- Page « Infos IA » lisible humain (/infos-ia/) + ajout au sitemap.
- Ajout contenus de référence (contenu_markdown/*.md) pour ventousage, sécurité, villes, etc.
- Pages locales principales et pages spécialisées créées (ventousage grandes villes, logistique 93/77/95, shootings & défilés, convoyage, sécurité/gardiennage).
- Politique IA enrichie dans llms.txt (cibles, personas, zones France+Belgique, déclencheurs) et simplification de ai.txt en alias vers llms.txt.
- Page « Politique de confidentialité » dédiée (/politique-confidentialite/) créée, avec lien dans le footer (colonne « Légal »).
- Conditions Générales de Prestation publiées (/conditions-generales-prestation/), avec lien footer.
- Page « Définition du ventousage » optimisée (CTA vers les services de ventousage + maillage interne renforcé) et page « Mentions légales » passée en `index, follow` pour être éligible à l’index.
- Pop-up « Paris Fashion Week 2026 » ajoutée côté JS/CSS, responsive (desktop/mobile), n’apparaissant qu’aux vraies dates FHCM (homme 20–25 janvier, femme 2–10 mars) et au plus une fois par jour et par visiteur.

Accessibilité / UX

- Corrections accessibilité/perf (width/height/fetchpriority sur images héros).
- Menu unifié injecté par JS (`setupUnifiedHeader` + `setupHamburgerMenu`) sur toutes les pages standards.
- Footer unifié injecté par JS (coordonnées, liens légaux, liens villes).
- Héros visuel unifié sur les pages principales (Accueil, Services, Réalisations, Contact, pages légales) avec le fond rue de nuit `hero-background-custom-*` (WebP + JPEG responsive).
- FAQs harmonisées (titres, structure HTML `.faq-item` / `.faq-question` / `.faq-answer`, contenu cohérent par page).
- Module JS FAQ (`setupFaqAccordion`) refondu pour que la hauteur des réponses s’adapte automatiquement (plus de texte coupé) tout en gardant l’animation d’ouverture/fermeture.

Tracking / conformité

- GA4 + Consent Mode v2 en place (ID : G-V7QXQC5260) et unification de l’ID sur toutes les pages.
- Lien persistant « Gérer les cookies » dans le footer qui réinitialise le consentement et réaffiche la bannière.
- Styles du breadcrumb et de la bannière cookies déplacés dans le CSS (plus de styles inline JS).
- Événements Analytics paramétrés : `phone_click`, `whatsapp_click`, `email_click`, `cta_contact_click`, `contact_submitted` (émis par le mini‑formulaire de la page hub `/contact-direct/`).

Icônes / assets

- Remplacement global des anciennes icônes Font Awesome `<i class="fas …">` et SVG 448x512 WhatsApp par des SVG inline cohérents (Bootstrap `bi-whatsapp` et icônes personnalisées).
- Suppression de la logique de migration legacy d’anciens emails (tout est en dur en `contact@bmsventouse.fr` côté HTML).

Contact / formulaires

- Suppression de toute référence à un « formulaire » dans les pages publiques (HTML).
- Mise en cohérence de la Politique de confidentialité et de `llms.txt` avec la réalité : contact via téléphone / WhatsApp / email, pas de formulaire général pour le moment.
- Le module JS de formulaire complexe (multi-services) reste dans `script.js` mais n’est plus utilisé par aucune page (prêt pour une future page hub dédiée).

Technique / Netlify

- Redirections Netlify consolidées : normalisation `www` → domaine nu, rattrapage des anciennes URLs `/services/...` (ventousage, régie, cantine, loges, etc.) et de `/en` vers les pages canoniques, afin de nettoyer progressivement les 404 dans Search Console.

### P1 : À faire ensuite (1–2 jours homme)

Tâches côté outils externes / CI (non gérables uniquement par le code) :

- Soumettre `sitemap.xml` dans Google Search Console (propriété domaine + URL-prefix).
- Activer les règles de protection de branche GitHub : PR obligatoire + check CI requis.
- Créer/configurer proprement les comptes externes :
  - GA4 : vérifier la propriété dédiée BMS Ventouse, déclarer `contact_submitted` comme conversion principale (pour le futur formulaire hub) + micro‑conversions `phone_click` / `whatsapp_click`, et créer 1–2 audiences utiles (ventousage Paris, shootings & défilés).
  - Google Search Console : propriété domaine, rapports réguliers (performances, couvertures, sitemaps).
  - Bing Webmaster Tools : ajouter le site, déclarer le sitemap (couvre Bing / Yahoo / DuckDuckGo / Brave Search) et vérifier le flux IndexNow.
  - Microsoft Clarity : confirmer l’ID de projet, filtrer les IP internes si besoin, vérifier au moins une session réelle.
- Sur 3–4 semaines, suivre dans Search Console les performances des pages `/definition-ventousage/`, `/ventousage-cinema/` et `/convoyage-vehicules-decors/` (requêtes, CTR, positions) et ajuster le plan (nouvelles définitions, renforcement du maillage) en fonction des retours.

### P2 : À planifier (semaine à venir)

Qualité / CI

- [x] Lighthouse CI (perf/SEO/A11Y) en place via GitHub Actions (non bloquant, rapports sur URLs clés).
- [x] Pa11y (AAA) étendu à davantage d’URLs internes (pages locales ventousage/sécurité principales).
- Uniformiser « Twitter Cards » sur toutes les futures pages (gabarit commun) — à garder comme réflexe lors de la création de nouvelles pages.

Sécurité

- [x] CSP consolidée via `netlify.toml` (headers) et meta CSP résiduelles supprimées dans les HTML (à surveiller lors des prochaines évolutions pour ne pas les réintroduire).

UX / contenu

- [x] Page 404 enrichie (liens vers pages ventousage villes, sécurité tournage, logistique + texte d’accompagnement).
- [x] Nouveau flux contact (NFC / QR) :
  - Landing « hub contact » dédiée (`/contact-direct/`) pensée pour les cartes NFC / QR :
    - 4 entrées claires : téléphone, WhatsApp, email, mini‑formulaire unique.
    - Cette page est le **seul endroit** où un formulaire public vit (mini‑form).
    - Texte court + micro‑explications intégrés, `contact_submitted` envoyé vers GA4 + dataLayer.

Icônes / assets

- [x] Remplacement des derniers SVG WhatsApp hérités de Font Awesome dans le HTML par des SVG inline Bootstrap (`bi-whatsapp`), normalisation finale via HTML + fallback JS dans `enhanceImages()`.

### P3 : Opportunités

- Créer de nouvelles pages locales (villes supplémentaires) avec maillage interne renforcé.
- Ajouter témoignages clients visibles si vous souhaitez activer des Ratings plus tard (AggregateRating).
- Blog court « opérations / tournage » (glossaire, procédures, checklists).
- Pages « coulisses » / études de cas détaillées (reliées aux Réalisations).
- Glossaire / définitions : après quelques semaines de données Search Console, envisager la création d’une page `/definition-ventouseur/` (voire AOT / gardiennage) et d’un bloc « En résumé » sur `/definition-ventousage/` pour capter davantage d’extraits enrichis.
- Off‑site / annuaires : utiliser `docs/annuaires-prestataires-bmsventouse.md` pour préparer et déposer des fiches prestataire (Film Paris Region, KFTV, The Location Guide, commissions du film régionales) quand du temps est disponible.
- [TODO prochaine session] Internationalisation ciblée : côté FR déjà en place (tags `notranslate` sur « ventousage » et la marque, redirection de `/en` vers `/`), côté EN à construire plus tard (page explicative en anglais + stratégie `hreflang` propre).

## Découpage par tâches

- SEO
  - [x] Page Confidentialité + lien footer
  - [x] Lighthouse CI (performance/SEO/accessibilité) intégré en CI (non bloquant, URLs clés)
- Accessibilité/UX
  - [x] Lien « Gérer les cookies » (ouvre consent manager)
  - [x] Styles du breadcrumb en CSS (supprimer styles inline JS)
  - [x] Pa11y URLs étendues (pages locales et services principaux)
  - [x] Skip-link « Aller au contenu principal » en place sur les pages clés (et automatiquement injecté sur les autres via JS) pour améliorer la navigation clavier/lecteur d’écran.
  - [x] Héros (titres H1 + textes) revus pour limiter les lignes trop longues et éviter les coupures de texte sur mobile (CSS responsive global + ajustements sur Accueil/Services).
- Technique
  - [x] CSP finalisée uniquement via `netlify.toml` (meta CSP supprimées dans les HTML)
  - [x] Variables CONFIG pour constantes (JS) documentées
- Contenu
  - Idée future : pages locales nouvelles (3+) + intégration sitemap + liens internes
  - Idée future : témoignages visibles (si activation schema AggregateRating à terme)
  - [x] Page de contact rapide / hub NFC (WhatsApp, téléphone, email + formulaire léger) via `/contact-direct/`
  - [x] Landing « hub contact » NFC/QR dédiée (`/contact-direct/`) avec 4 entrées (téléphone, WhatsApp, email, mini‑formulaire unique)

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