# Audit SEO - BMS Ventouse (état au 2025-09-30)

Mise à jour rapide (2026-01-10)
- Page « Définition du ventousage » enrichie (CTA vers les services de ventousage + maillage interne renforcé).
- Page « Mentions légales » passée en `index, follow` pour permettre son éventuelle indexation.
- Pages « Ventousage cinéma » et « Convoyage véhicules & décors » structurées comme landings SEO dédiées (Service + FAQ + CTA).
- Redirections Netlify ajoutées pour normaliser les anciennes URLs `/services/...` et `/en` vers les URLs canoniques, afin de réduire les 404 dans Search Console.
- Nouveau document `docs/annuaires-prestataires-bmsventouse.md` ajouté pour centraliser textes et cibles d’annuaires métiers (Film Paris Region, KFTV, The Location Guide, commissions régionales).

Vue d’ensemble
- Base SEO solide, site statique rapide (Netlify).
- Pages clés couvertes: Accueil, Services, Réalisations, Contact, Mentions, pages locales.
- Données structurées riches et métadonnées sociales homogènes.

Faits mis en place depuis la première analyse
- Métadonnées
  - Titles, descriptions, canonical, lang=fr, viewport: OK sur l’ensemble.
  - Open Graph et Twitter Cards normalisés (summary_large_image).
  - og:site_name unifié: “BMS Ventouse”.
- JSON‑LD
  - ProfessionalService + LocalBusiness (home).
  - Service/FAQPage sur pages dédiées.
  - BreadcrumbList (visible + JSON‑LD) injecté côté JS sur les pages internes.
- Performance Web
  - Héros avec width/height et fetchpriority="high" pour réduire le CLS et améliorer le LCP.
  - Preload CSS + preconnect fonts; lazy loading pour les images non critiques.
  - Cache HTTP long via Netlify pour assets statiques.
- Accessibilité
  - Skip link “Aller au contenu” sur toutes les pages.
  - Menu mobile accessible (focus trap, ESC).
  - Audit Pa11y CI (WCAG2AAA) en job non bloquant.
- Analytics et conformité
  - GA4 avec Consent Mode v2 (analytics_storage à denied par défaut) et anonymisation d’IP.
  - Événements: phone_click, whatsapp_click, email_click, cta_contact_click.
- Préparation IA / LLM
  - llms.txt comme fichier principal (politique IA détaillée: cibles, personas, zones France+Belgique, déclencheurs).
  - ai.txt simplifié en alias pointant vers llms.txt.
  - Page /infos-ia/ dédiée (résumé, FAQ IA, liens vers llms.txt / ai.txt).
- Technique Netlify
  - Correction de la redirection /services → /services/ (301).
  - 404.html personnalisée.

Points d’attention
- AggregateRating
  - À n’utiliser que si des avis authentiques sont visibles sur la page. Sinon, retirer le bloc.
- Sitemap
  - Mettre à jour lastmod à chaque ajout/édition significative de page.
- Images sociales
  - Préférer une image OG dédiée (1200x630) optimisée; fallback actuel: hero-background-custom.jpg.
- Contenu
  - Poursuivre l’enrichissement sémantique (sections détaillées, FAQ) et le maillage interne entre pages.
- Off‑site
  - Créer/renforcer la fiche Google Business Profile et capter des avis (puis intégrer un bloc “Avis”).

Check‑list pour chaque nouvelle page
- Balises
  - title ≤ 60–65 car., meta description 140–160 car. pertinentes.
  - canonical absolu (https://bmsventouse.fr/xxx/), robots absent ou “index, follow”.
  - og:title/description/url/type, og:image 1200x630; twitter:card + twitter:title/description/image.
- JSON‑LD
  - Service avec provider BMS Ventouse si approprié.
  - FAQPage si Q/R présentes; BreadcrumbList (visible + JSON‑LD).
- Contenu
  - 1 seul H1, hiérarchie claire (H2/H3), texte informatif, CTA, liens internes.
  - Alt text descriptifs et utiles; éviter les répétitions décoratives.
- Perf/UX
  - Héros avec width/height + fetchpriority="high" (1 par page).
  - Images optimisées (webp/jpg), lazy pour non‑critiques.
- Intégration
  - Ajouter la page au sitemap.xml avec lastmod ISO 8601.
  - Lancer la CI (lint, liens internes, Pa11y) et corriger avant merge.

Pistes d’amélioration à moyen terme
- Pages locales
  - Étendre aux grandes villes (Lyon, Marseille, Bordeaux, Lille).
- Contenu
  - Blog/guides (AOT, ventousage par ville, checklists de tournage).
  - Témoignages/avis clients (et intégration JSON‑LD Review/Rating si visible).
- Mesure et suivi
  - Search Console (propriété domaine/URL), soumettre sitemap, suivi des performances Core Web Vitals.
- Off‑site
  - Stratégie de netlinking localisée et partenariats (studios, régies, loueurs).

Références internes
- guides et process détaillés dans :
  - docs/README.md (index de la documentation)
  - docs/patterns.md (patterns de pages & composants)
  - docs/api/frontend-ux.md (modules JS frontend : thème, hand-toggle, FAQ, galerie, etc.)
  - docs/annuaires-prestataires-bmsventouse.md (texte standard et cibles pour les annuaires métiers)
  - README-css.md et README-icons.md (conventions CSS & icônes)
  - plan_action.md (priorités SEO / accessibilité / qualité et roadmap)

