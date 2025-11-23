# SCORES — Lighthouse, WAVE, Observatory

Ce document récapitule les scores de qualité connus (au 23/11/2025) et les objectifs cibles.  
Les scores exacts peuvent varier légèrement d’une exécution à l’autre (réseau, device).

## 1. PageSpeed Insights — Accueil (`/`)

Dernier run communiqué (mobile, 23/11/2025):

- Performance: 76
  - FCP: 3,1 s
  - LCP: 4,3 s
  - TBT: 10 ms
  - CLS: 0
  - Speed Index: 5,3 s
- Accessibilité: 95
- Bonnes pratiques: 81
- SEO: 100

Objectifs:

- Performance (mobile): ≥ 90.
- Accessibilité: 100.
- Bonnes pratiques: 100.
- SEO: 100 (déjà atteint).

Éléments ayant motivé les optimisations récentes:

- Performance:
  - “Réduisez les ressources JavaScript inutilisées” (~55 Kio).
  - “Réduisez la taille des ressources CSS” (~4 Kio).
  - “Améliorer l’affichage des images” (~30 Kio).
- Accessibilité:
  - “Les couleurs d’arrière-plan et de premier plan ne sont pas suffisamment contrastées”.
  - “Les éléments d’en-tête ne sont pas classés séquentiellement par ordre décroissant”.
- Bonnes pratiques:
  - “API obsolètes utilisées” (X-XSS-Protection / d’anciens patterns).
  - Recommandations sur CSP, HSTS, COOP/COEP.

Les modifications CSS/headers réalisées (contraste, dark mode, CSP, HSTS, COOP/COEP/CORP, Permissions-Policy) visent à supprimer ces signaux.

## 2. Pages clés — Objectifs récapitulés

Pour chaque URL critiques:

- `/` (Accueil)
- `/services/`
- `/ventousage-paris/`
- `/contact/`
- `/mentions/`
- `/realisations/`

Objectifs PageSpeed (Mobile / Desktop):

- Performance:
  - Mobile: ≥ 90.
  - Desktop: ≥ 95.
- Accessibilité: 100.
- Bonnes pratiques: 100.
- SEO: 100.

Pratiques déjà en place:

- LCP:
  - Images héro optimisées (WebP + JPEG, `fetchpriority="high"`, `width`/`height`).
  - Lazy loading sur le reste des images.
- Accessibilité:
  - Contraste corrigé (liens, footer, bannière promo, dark mode).
  - Heading structure: 1 seul H1, H2 pour sections, H3 pour cartes.
  - Navigation clavier, skip link, FAQ accessible.
- Bonnes pratiques:
  - CSP strict sans `'unsafe-inline'`.
  - HSTS + COOP/COEP/CORP + Permissions-Policy.
  - Pas de bibliothèques lourdes.

Reste à faire (voir `docs/TODO.md`) pour aller chercher les derniers points:

- Nettoyage des `style="..."` inline (mise en classes CSS).
- Finalisation de la hiérarchie des titres dans tous les footers (suppression des `<h4>` restants).
- Optimisation fine des images héro (encore quelques dizaines de Ko possibles).
- Ajustements tap targets mobiles si PageSpeed les signale.

## 3. WAVE — Accessibilité

État après corrections de contraste:

- Erreurs de contraste:
  - Initialement: ~34 erreurs (liens, footer, bannière, dark mode).
  - Après corrections CSS: objectif 0 erreur sur les pages principales.
- Autres catégories:
  - Titres:
    - Hiérarchie globale propre (H1/H2/H3).
    - Quelques `<h4>` de footers encore présents sur certaines pages — à convertir en `<p class="footer-title">`.
  - Liens:
    - La plupart des liens disposent d’un texte clair.
    - Certains liens très courts (ex: “Voir aussi: …”) peuvent être rapprochés et regroupés pour un meilleur confort.

WAVE exact n’est pas exploitable directement depuis le repo, mais le code a été ajusté pour être conforme aux remarques typiques (contrastes, titres, liens).

## 4. Mozilla Observatory / SecurityHeaders

Configuration actuelle (`netlify.toml`):

- HSTS (`Strict-Transport-Security`) avec `max-age=31536000; includeSubDomains; preload`.
- CSP stricte, sans `'unsafe-inline'` sur `script-src` et `style-src`.
- `X-Frame-Options = DENY`.
- `X-Content-Type-Options = nosniff`.
- `Referrer-Policy = strict-origin-when-cross-origin`.
- COOP/COEP/CORP:
  - `Cross-Origin-Opener-Policy = same-origin`.
  - `Cross-Origin-Embedder-Policy = require-corp`.
  - `Cross-Origin-Resource-Policy = same-origin`.
- `Permissions-Policy = "camera=(), microphone=(), geolocation=(), usb=(), payment=()"`.
- `Trusted-Types = "default"`.

Objectif:

- Note A ou A+ sur:
  - https://observatory.mozilla.org
  - https://securityheaders.com

Cette configuration est alignée avec les recommandations d’Observatory; les derniers points dépendent surtout de la cohérence globale (absence de failles HTML/JS évidentes).

## 5. Résumé objectifs chiffrés

Par type d’outil:

- Lighthouse / PageSpeed:
  - Performance (mobile): 90–95+.
  - Performance (desktop): 95–100.
  - Accessibilité: 100.
  - Bonnes pratiques: 100.
  - SEO: 100.
- WAVE:
  - 0 erreur critique sur:
    - Contraste.
    - Titres.
    - Liens (texte explicite).
- Pa11y CI:
  - 0 violation WCAG 2.1 de niveau A/AA sur les pages clés (ou acceptées avec justification).
- Mozilla Observatory:
  - A / A+.
- SecurityHeaders.com:
  - A / A+.

Les actions détaillées pour atteindre ces objectifs sont listées dans `docs/TODO.md`.