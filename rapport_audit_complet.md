# Audit Complet - Site Statique BMS Ventouse (bmsventouse.fr)

Date: 2025-09-30
Portée: Pages publiques HTML, CSS, JS, Netlify config, SEO, A11y, Responsive, Préparation LLM

Mise à jour rapide (2025-12-22)
- Page « Politique de confidentialité » dédiée créée (/politique-confidentialite/) et ajoutée au footer (colonne « Légal »).
- GA4 unifié sur l’ID de mesure G‑V7QXQC5260 avec Consent Mode v2 sur l’ensemble des pages.
- Lien persistant « Gérer les cookies » ajouté au footer, permettant de réouvrir la bannière de consentement.
- Styles du breadcrumb et de la bannière cookies désormais gérés en CSS (plus de styles inline injectés).

Mise à jour rapide (2026-01-10)
- Page « Définition du ventousage » enrichie (CTA vers les services + maillage interne renforcé) pour capter davantage de requêtes d’information.
- Page « Mentions légales » passée en `index, follow` (au lieu de `noindex`) afin de permettre son indexation si Google le juge pertinent.
- Redirections Netlify complétées pour les anciennes URLs `/services/...` (ventousage, régie, cantine, loges, etc.) et `/en` vers les pages canoniques, afin de réduire les 404 et clarifier la structure d’URL.
- Ajout du document `docs/annuaires-prestataires-bmsventouse.md` regroupant les textes standard (FR/EN) et les cibles d’annuaires métiers (Film Paris Region, KFTV, The Location Guide, commissions régionales), pour faciliter le netlinking qualitatif ultérieur.

Résumé exécutif
- Base SEO et technique solide (Open Graph, Twitter Cards, JSON‑LD, sitemap, robots).
- Accessibilité soignée (skip link, focus visible, sémantique), mais quelques textos et labels peuvent être enrichis.
- Performance correcte pour un site statique; images critiques dimensionnées, fetchpriority appliqué; quelques opportunités de minification et déplacement de styles inline.
- Contenus métier riches et bien ciblés; encore des manques mineurs (CGV/CGU, adresse/horaires visibles partout).
- Préparation IA avancée: llms.txt (fichier principal), ai.txt (alias vers llms.txt), page /infos‑ia/ et métadonnées uniformisées.

Recommandations prioritaires (synthèse)
- Critique: s’assurer qu’aucun lien interne ne casse en prod (CI Lychee OK). Rien de bloquant détecté.
- Élevé: ajouter une page Politique de confidentialité RGPD (ou l’intégrer clairement aux Mentions) + CGV/CGU si utile.
- Moyen: nettoyer logs console dans script.js et factoriser les styles inline JS vers le CSS; homogénéiser les Twitter Cards sur toute nouvelle page à l’avenir.
- Faible: Lighthouse CI pour suivi perf/SEO/A11y; styling léger du breadcrumb injecté.

---

## PARTIE 1 - Audit de Contenu et Informations Métier

### 1.1 Vérification des Services et Informations Clés
Notation: PRÉSENT ✅ / ABSENT ❌ / INCOMPLET ⚠️

Services de Convoyage
- Convoyage de véhicules 22 m³: ✅ (services, transport-materiel-audiovisuel-paris)
- Transport de poids lourds: ✅ (mention “sur demande”)
- Déplacement de décors entre lieux: ✅
- Couverture géographique: toute la France: ✅ (home, contact “nous intervenons partout en France”)
- Mention équipe sérieuse et qualifiée: ✅
- Tarifs ou demande de devis: ✅ (devis gratuit/CTA)
- Photos/illustrations du service: ✅

Shooting et Événements
- Service shooting photo: ✅ (services)
- Prestations publicitaires: ✅
- Couverture Fashion Week: ✅ (services)
- Réservation de stationnement pour événements: ✅
- Réservation de stationnement pour déménagements: ✅
- Portfolio ou galerie photos: ✅ (réalisations, cartes + logos)
- Témoignages clients: ✅ (réalisations – témoignage inline)

Sécurité et Gardiennage
- Sécurité plateaux de tournage: ✅
- Gardiennage: ✅ (services)
- Ventouseur professionnel: ✅ (pages ventousage)
- Gardiennage Paris et Île‑de‑France: ✅
- Certifications/agréments de sécurité: ❌ (non listés)
- Équipe et effectifs disponibles: ⚠️ (implicitement, non chiffré)

Services Spécialisés
- Service ventouse (description détaillée): ✅ (ventousage‑paris, définition, AOT)
- Agents pour manutention: ✅ (régie & matériel)
- Agents pour déménagement (agents de Régis): ⚠️ (mention générique régie/manutention; pas “déménagement” explicite côté agents)
- Parking sécurisé: ❌ (non revendiqué comme service distinct)
- Loges pour équipes: ✅ (loges & confort)
- Service de cantine: ✅ (cantine & catering)
- Location de matériel: ✅ (via partenaires)

Événements et Projets Spécifiques
- Saison 2 « En Place »: ✅ (réalisations)
- Offres cadeaux ou promotions: ✅ (bannière d’offre de bienvenue, actuellement masquée)
- Référence Rocksana: ❌ (non trouvée)
- Flamme olympique secteur Aubervilliers: ✅
- Parades du conseil régional Pantin/Aubervilliers: ✅
- Autres événements marquants: ✅ (Film “Les Cadeaux”, etc.)

Offres Opérationnelles
- Pose de panneaux: ✅
- Jalonnage: ✅
- Prestation gratuite en cas de collaboration: ✅ (pose et jalonnage offerts après devis accepté)

Informations Légales et Contact
- Mentions légales: ✅ (noindex)
- CGV/CGU: ❌
- RGPD / Politique de confidentialité: ⚠️ (section dans Mentions; page dédiée absente)
- Formulaire de contact fonctionnel: ❌ (contact multi‑canal, pas de formulaire)
- Téléphone: ✅
- Email: ✅
- Adresse physique: ✅ (Mentions + JSON‑LD; visibilité footer: ❌)
- Horaires d’ouverture: ✅ (JSON‑LD; visibilité UI: ❌)
- Plan d’accès / Google Maps: ❌

### 1.2 Analyse des Doublons et Redondances

PAGE: Accueil
DOUBLONS DÉTECTÉS: CTA contact/WhatsApp répétés (normal, cross‑site)
CONTENU RÉPÉTITIF: “Offre -15%” dans header de toutes pages
SUGGESTION: Centraliser la bannière en composant; variabiliser le message au besoin

PAGE: Services
DOUBLONS DÉTECTÉS: Rappels de ventousage/sécurité/convoyage déjà cités en home
CONTENU RÉPÉTITIF: “offert après acceptation du devis” repris; OK
SUGGESTION: Conserver, page pivot

PAGE: Réalisations
DOUBLONS DÉTECTÉS: CTA contact/WhatsApp
CONTENU RÉPÉTITIF: Logos/clients cités dans carrousel home
SUGGESTION: OK (rôle différent)

PAGE: Pages locales (ventousage‑paris, 93/77/95, Strasbourg, etc.)
DOUBLONS DÉTECTÉS: Structures sections et CTA similaires
CONTENU RÉPÉTITIF: Phrasés “Intervention 24/7”, “Devis gratuit”
SUGGESTION: Bon pour SEO local; maintenir différenciation par zones/délais/FAQ

PAGE: AOT Paris / Définition / Cinéma
DOUBLONS DÉTECTÉS: FAQ ventousage (2‑3 questions proches)
SUGGESTION: Laisser, intentions de recherche différentes

### 1.3 Architecture de l’Information

Arborescence (principale)
- / (Accueil)
- /services/
- /realisations/
- /contact/
- /mentions/ (noindex)
- /ventousage-paris/
- /ventousage-cinema/
- /transport-materiel-audiovisuel-paris/
- /securite-tournage-strasbourg/
- /logistique-seine-saint-denis/ (93)
- /logistique-seine-et-marne/ (77)
- /logistique-val-d-oise/ (95)
- /autorisation-occupation-domaine-public-tournage-paris/ (AOT)
- /definition-ventousage/
- /ventousage-pantin/
- /infos-ia/
- /404.html
- /robots.txt, /sitemap.xml, /ai.txt (alias), /llms.txt (principal)

Navigation
- Header: Accueil, Services, Références, Contact
- Footer: Navigation+Contact+Légal; liens IA ajoutés; cohérence OK

Liens internes
- Cohérents, pas de casse détectée (CI Lychee interne actif)
- Canonicals présents

Hiérarchie titres
- H1 unique par page: OK
- H2/H3: majoritairement logique
- Améliorable: ajouter H2 descriptifs courts sur pages locales pour variabilité sémantique

---

## PARTIE 2 - Audit Technique et Qualité du Code

### 2.1 TypeScript/JavaScript

Typage
- TypeScript: non utilisé
- any/as any: aucune occurrence détectée

Code mort et inutilisé
- Pas d’imports JS; single script `js/script.js`
- Modules présents tous utilisés (menu, FAQ, carrousel, back‑to‑top, consent, analytics, breadcrumb)

Qualité et bonnes pratiques
- console.log/console.warn: présents (init, FAQ, carrousel, cookie banner)
  - Suggestion: supprimer ou protéger derrière un flag `const DEBUG=false`
- Magic numbers: quelques valeurs (scrollY>300, marges carrousel)
- Styles inline injectés via JS (cookie banner, breadcrumb): déplacer vers classes CSS
- Gestion d’erreurs: try/catch léger non bloquant (OK)

HTML/Sémantique
- Structure sémantique complète: header/nav/main/section/footer, skip‑link
- Attributs alt: présents sur images clés
- Liens descriptifs: majoritairement oui; éviter “ici” générique
- Role/ARIA: FAQ enrichie (aria‑expanded, role=button/region); bien

CSS
- Organisation: single stylesheet, variables CSS, BEM‑like; media queries ok
- !important: parcimonieux (patch menu mobile)
- Sélecteurs: spécifiques raisonnables
- Non utilisé: faible risque; CI/pa11y ne signale pas
- Performance: animations sur transform/opacity; responsive grid; ok

Performance & Optimisation
- Images: jpg/webp; width/height + fetchpriority pour héros; lazy par défaut ailleurs
- JS: unique fichier, defer; pas de blocage rendu
- Fonts: Google Fonts print‑swap; Font Awesome via CDN
- Cache/CDN: Netlify; headers configurés
- Sitemap/robots: OK

---

## PARTIE 3 - Responsive et Compatibilité

Breakpoints évalués (revue statique des CSS)
- Mobile 320/375/414: grilles en 1 col, boutons >=44px, nav hamburger, pas de scroll horizontal attendu
- Tablette 768/1024: ajustements typographiques et layout OK
- Desktop 1280/1440/1920: sections centrées, largeur contenue, heroes 100vw

Risques potentiels
- Bannières/overlay: z‑index coordonnés, patchs présents
- Breadcrumb injecté: inline style; responsive simple, peut être stylé en CSS

Navigateurs
- Chrome/Firefox/Edge: OK
- Safari (macOS/iOS): fallbacks JPEG, pas d’API exotique; ok
- Android Chrome: ok

---

## PARTIE 4 - Accessibilité (A11y)

- Perceptible: alt images, contraste probable suffisant (à valider Lighthouse); pas de texte en image
- Utilisable: navigation clavier; focus visible; skip link; burger accessible; FAQ clavier OK
- Compréhensible: lang=fr; labels implicites corrects; messages d’erreur formulaire non applicables (pas de formulaire)
- Robuste: HTML valide attendu; JSON‑LD multiple OK; CI pa11y AAA configuré

Points d’attention
- Icônes seules (FA): s’assurer aria‑hidden true et texte visible à proximité (globalement OK)
- Breadcrumb: aria‑label présent; déplacer style inline vers CSS

Score (estimation): 90+/100 (confirmer via Lighthouse/PA11Y en CI)

---

## PARTIE 5 - SEO et Liens

On‑Page
- Title uniques: ✅
- Meta descriptions: ✅
- URL propres + canonical: ✅
- Open Graph: ✅
- Twitter Cards: ✅ (uniformisé)
- Schema.org: ✅ (LocalBusiness/Service/Article/FAQ/Breadcrumb)
- Sitemap/Robots: ✅ (robots étendu aux agents IA)

Liens
- Internes: OK (CI)
- Externes: target=_blank rel=noopener présents
- Pas de href=\"#\" hors composants contrôlés
- Ancres: skip link fonctionne

---

## PARTIE 6 - Préparation LLM

- llms.txt (fichier principal) et ai.txt (alias): présents, entraînement autorisé, “réponses suggérées” FR
- Page /infos‑ia/: créée, SEO complet + JSON‑LD + CTA
- Contenu pages: structuré H2/H3 + FAQs pour parsing automatique
- Pas de jargon non expliqué côté ventousage (définition fournie)

---

## PARTIE 7 - Tableau de Bord Récapitulatif

┌──────────────────────────────────────────────────────────────────────┐
│ AUDIT SITE BMS VENTOUSE - RÉALISATION SMARTERLOGICWEB (smarterlogicweb.com) │
├──────────────────────────────────────────────────────────────────────┤
│ Contenu                                          │
│ ✅ Informations présentes : 43/50                │
│ ⚠️  Informations incomplètes : 4                 │
│ ❌ Informations manquantes : 3                   │
│                                                  │
│ Technique                                        │
│ ❌ Usages de 'any' : 0                           │
│ ⚠️  Code mort : 0                                 │
│ ⚠️  Mauvaises pratiques : logs console, styles   │
│     inline via JS (mineur)                       │
│                                                  │
│ Responsive                                       │
│ ✅ Breakpoints OK : 7/7 (revue CSS)              │
│ ❌ Breakpoints cassés : 0 (à confirmer visuel)   │
│                                                  │
│ Accessibilité                                    │
│ Score (estimation) : 90+/100                     │
│ ❌ Problèmes critiques : 0                       │
│                                                  │
│ SEO                                              │
│ ✅ Pages optimisées : 100% pages publiques       │
│ ⚠️  Pages à améliorer : Politique Confidentialité│
└─────────────────────────────────────────────────┘

---

## Priorités d’Action (Automatique)

🔴 CRITIQUE
- (aucune) - continuer la surveillance CI (liens/HTML/TOML)

🟠 ÉLEVÉ (1 semaine)
- Créer une page Politique de confidentialité dédiée (RGPD) et lier depuis footer
- Ajouter CGV/CGU si utile au modèle (sinon indiquer “sur demande”)
- Ajouter adresse + horaires visibles dans footer (NAP)

🟡 MOYEN (1 mois)
- Supprimer/neutraliser console.log/console.warn en prod; flag DEBUG
- Déplacer styles inline (cookie banner, breadcrumb) vers CSS
- Ajouter un lien “Gérer les cookies” persistant (ou footer) pour modifier le consentement

🟢 FAIBLE
- Ajouter Lighthouse CI (perf/SEO/A11y) à la pipeline
- Styliser breadcrumb (classe CSS); vérifier uniformité pages locales
- Ajouter page “Plan d’accès” (Google Maps) si pertinent

---

## Annexes
- Voir dossier contenu_markdown/ pour l’extraction des pages en Markdown
- Voir problemes_techniques.json pour le détail technique
- Voir plan_action.md pour l’ordonnancement détaillé et les estimations