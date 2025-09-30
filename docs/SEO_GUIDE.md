# Guide SEO (BMS Ventouse)

Objectif
- Uniformiser les pratiques SEO on‑page pour toutes les pages du site.

1) Métadonnées
- title (≤ 60–65 caractères): explicite, avec marque si pertinent.
- meta description (140–160 caractères): claire, actionnable (“Devis gratuit …”).
- canonical absolu: https://www.bmsventouse.fr/xxx/
- robots: généralement “index, follow” (sauf Mentions: “noindex”).
- theme-color, author (optionnel mais utile pour cohérence).

2) Social (Open Graph & Twitter)
- og:title, og:description, og:url, og:type.
- og:image: 1200x630 (JPEG/WEBP), poids optimisé.
- twitter:card = summary_large_image.
- twitter:title, twitter:description, twitter:image = alignés sur OG.

3) JSON‑LD
- Accueil: ["ProfessionalService", "LocalBusiness"] avec coordonnées, zone.
- Pages services/locales:
  - "@type": "Service" avec "provider" Organization (BMS).
  - FAQPage si Q/R réelles visible sur la page.
- BreadcrumbList:
  - Visible (fil d’Ariane) + script JSON‑LD injecté.
  - 2 niveaux minimum: Accueil → Page.
- AggregateRating:
  - À utiliser uniquement si les avis sont affichés/consultables depuis la page.

4) Contenu
- 1 H1 par page; hiérarchie H2/H3 cohérente.
- Texte riche, précis, localisé si page locale.
- Maillage interne vers pages pertinentes (Services, Contact, pages locales).
- CTA visibles (Demander un devis, WhatsApp).

5) Performance & UX
- Héros avec width/height + fetchpriority="high" (1 image prioritaire).
- Lazy loading pour images non critiques.
- Preload CSS + preconnect fonts; éviter le blocage de rendu.

6) Sitemap & robots
- sitemap.xml: ajouter l’URL et lastmod (ISO 8601) à chaque nouvelle page.
- robots.txt: laisse tout ouvert et référence le sitemap public.

7) Pages locales (modèle)
- URL: /ville-ou-service-local/
- Title: “Service à Ville — … | BMS Ventouse”.
- Description: 140–160 car., localisée, avec CTA.
- JSON‑LD Service + FAQPage (questions locales).
- Contenu: explication du service à Ville, sections pratiques (AOT/OTDP), FAQ locale.
- Liens: vers Contact, Services, autres pages locales pertinentes.

8) Contrôles
- CI (Super‑Linter + lychee interne) doit passer.
- Pa11y CI (AAA) rapport non bloquant; corriger si erreurs majeures.
- Valider OG/Twitter via les outils officiels quand images/titres changent.

Annexe: exemples
- Un exemple de JSON‑LD Service et FAQ est présent dans /services/ et pages locales.
- Breadcrumb JSON‑LD: généré par js/script.js avec Accueil → Page.