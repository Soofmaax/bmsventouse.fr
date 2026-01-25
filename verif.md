# Plan de vérification UX / technique avant merge

Ce fichier sert à suivre, page par page&nbsp:
- les **URL à vérifier** sur différents appareils,
- les **modifications** effectuées sur chaque page,
- ce qu’il faudra **re-tester après le merge**.

Tu peux cocher les cases à la main ou simplement ajouter des commentaires sous chaque page.

---

## 1. Liste des URL à vérifier

### 1.1. Pages structure / navigation principale

- `/` – Accueil (index.html)
- `/services/` – Page Services
- `/realisations/` – Réalisations
- `/contact/` – Page Contact
- `/contact-direct/` – Hub contact NFC/QR (page dédiée scan, non indexée)
- `/mentions/` – Mentions légales
- `/infos-ia/` – Infos IA (page)
- `/404.html` – Page 404 (tester en appelant une URL inexistante)

### 1.2. Pages ventousage / sécurité / services principaux

- `/ventousage/` – Synthèse ventousage
- `/ventousage-paris/` – Ventousage à Paris
- `/ventousage-shootings-defiles-paris/` – Ventousage défilés & shootings Paris
- `/ventousage-cinema/` – Ventousage pour le cinéma
- `/definition-ventousage/` – Définition du ventousage

- `/gardiennage/` – Gardiennage
- `/securite-plateaux/` – Sécurité de plateaux
- `/securite-gardiennage/` – Sécurité & gardiennage (vue combinée)

### 1.3. Loges / cantine / régie / transport

- `/loges-confort/` – Loges & confort
- `/cantine-catering/` – Cantine & catering
- `/regie-materiel/` – Régie & matériel
- `/transport-materiel-audiovisuel-paris/` – Transport matériel audiovisuel (Paris)
- `/autorisation-occupation-domaine-public-tournage-paris/` – AOT tournage Paris

### 1.4. Affichage / signalisation

- `/affichage-riverains/` – Affichage riverains
- `/signalisation-barrierage/` – Signalisation & barriérage

### 1.5. Anciennes pages tarifaires (désactivées)

- `/prix-ventousage-paris/` – Ancienne page tarifs ventousage Paris (supprimée, redirigée vers `/contact/`)

---

## 2. Pages géographiques – Ventousage

### 2.1. Paris et dérivés

- `/ventousage-paris/` – (déjà listée plus haut)
- `/ventousage-shootings-defiles-paris/` – (déjà listée plus haut)

### 2.2. Autres villes – ventousage

- `/ventousage-lyon/`
- `/ventousage-marseille/`
- `/ventousage-bordeaux/`
- `/ventousage-toulouse/`
- `/ventousage-strasbourg/`
- `/ventousage-lille/`
- `/ventousage-nice/`
- `/ventousage-pantin/`

---

## 3. Pages géographiques – Logistique

- `/logistique-seine-saint-denis/`
- `/logistique-seine-et-marne/`
- `/logistique-val-d-oise/`

---

## 4. Pages géographiques – Sécurité tournage

- `/securite-tournage-paris/`
- `/securite-tournage-lyon/`
- `/securite-tournage-marseille/`
- `/securite-tournage-nice/`
- `/securite-tournage-toulouse/`
- `/securite-tournage-bordeaux/`
- `/securite-tournage-lille/`
- `/securite-tournage-strasbourg/`

---

## 5. Autres pages “marque”

- `/urban-regie/` – (ancienne) page Urban Régie — utilise désormais le même design system et footer que le reste du site (pas de partenaire externe actif)

---

## 6. Checklist de vérification par page

Pour chaque URL, on vérifie sur&nbsp:
- iPhone (Safari)
- Android (Chrome)
- Desktop (Chrome / Firefox / Safari)

Exemple de bloc de suivi pour une page (à copier/coller pour chaque URL) :

```md
### /contact/

- [ ] iPhone – UX / affichage OK
- [ ] Android – UX / affichage OK
- [ ] Desktop – UX / affichage OK
- [ ] Dark mode – lisible (textes, boutons, CTA)
- [ ] Console – aucune erreur bloquante (CSP, SW, JS)

Notes :
- 2025-xx-xx : (Genie) Correction SW / CSP pour éviter les erreurs sur gtag/fonts.
- 2025-xx-xx : (Genie) Ajustement couleurs dark mode dans le footer.

À re-tester après merge :
- [ ] Confirmer qu’aucun message SW/CSP n’apparaît en console sur /contact/.
```

Tu peux dupliquer ce bloc pour chaque URL de la liste ci-dessus.

---

## 7. Journal des modifications (à remplir au fur et à mesure)

Ici, on liste les changements effectués par page pour re-vérifier après merge.

Exemple de format :

```md
### / (Accueil)

- 2025-xx-xx : Texte du héros déplacé vers la section Services (éviter surcharge sur l’image).
- 2025-xx-xx : Dark mode – couleur des CTA en bas de page corrigée (texte plus lisible).

### /logistique-val-d-oise/

- 2025-xx-xx : Suppression du bouton “Aller au contenu” en haut.
- 2025-xx-xx : Ajustement éventuels (à compléter).
```

### / (Accueil)

- 2025-12-22 : Cartes « Services » — texte harmonisé sur les 3 premières cartes (ventousage, gardiennage, régie) pour une longueur plus cohérente.
- 2025-12-22 : Section « Votre expert en ventousage » — recentrage du bloc et transformation en mini-CTA visuel (bloc ovale centré avec les phrases « Devis sous 24h… » et « En savoir plus… »).
- 2025-12-22 : FAQ de la home — marges des paragraphes ajustées pour que tout le texte soit visible quand une question est ouverte (plus de texte coupé en bas).
- 2025-12-22 : Icônes WhatsApp de la home — remplacées par l’icône officielle Bootstrap (bi-whatsapp) sur le bouton héros, le bouton flottant et le lien WhatsApp du footer.
- 2025-12-22 : Couleurs texte/liens — liens globaux passés en orange (var(--color-primary)) en clair et dark mode, suppression des anciens bleus (#1a56db, #60a5fa) y compris pour les boutons secondaires ; liens du footer en orange.
- 2025-12-22 : Dark mode — liens en orange (var(--color-primary)), texte principal clair, promo-banner avec texte clair lisible sur fond orange.
- 2025-12-22 : Boutons de toggle (mode sombre + main gauche/droite) — contraste renforcé en dark mode (icônes claires, fond légèrement plus clair et bordure visible dans le header sombre).
- 2025-12-22 : Icônes WhatsApp (global) — ajout d’un script qui remplace automatiquement tous les anciens SVG Font Awesome (viewBox 0 0 448 512) par l’icône Bootstrap 16x16 (bi-whatsapp) en conservant la taille (width/height) et le style.
- 2025-12-22 : Vérification code (Genie) — aucune occurrence restante des anciens bleus (#1a56db, #60a5fa) dans les CSS/HTML hors ce fichier de suivi.
- 2025-12-28 : Module FAQ global — logique mise à jour pour adapter automatiquement la hauteur de la réponse à la taille réelle du contenu (plus aucun texte coupé, y compris sur mobile ou en cas de changement de mise en page).

### /services/

- 2025-12-28 : Carte « Cantine & catering » — correction de l’attribut alt de l’image (orthographe « cantine et catering »).
- 2025-12-28 : Encadré « Gardiennage & sécurité de matériel » — balisage accessibilité (role=\"note\" + aria-label explicite) pour harmoniser avec les autres notes.

### /contact-direct/

- 2025-12-22 : Création de la page hub NFC/QR `/contact-direct/` avec boutons téléphone, WhatsApp, email et mini-formulaire léger pour les cartes NFC/QR.
- 2025-12-22 : Intégration du suivi Analytics `contact_submitted` (gtag + dataLayer) déclenché à chaque envoi du formulaire.

### /gardiennage/

- 2025-12-28 : Encadré « Note sécurité & conformité » — balisage accessibilité (role=\"note\" + aria-label) pour les lecteurs d’écran.

### /securite-plateaux/

- 2025-12-28 : Correction d’un bloc de texte qui affichait des tags `<strong>` en texte brut (désormais vrai HTML, mieux lisible).
- 2025-12-28 : Encadrés « Gardiennage & sécurité de matériel » et « Engagement conformité & bonnes pratiques (sécurité) » — ajout de role=\"note\" + aria-label.

### /securite-tournage-paris/

- 2025-12-28 : Encadré « Engagement conformité & bonnes pratiques (sécurité) » — ajout de role=\"note\" + aria-label.

### /signalisation-barrierage/

- 2025-12-28 : Encadré « Note accessibilité & conformité » — ajout de role=\"note\" + aria-label.

### /llms.txt (politique IA)

- 2025-12-28 : Alignement avec la réalité du site — suppression de la mention « formulaire » dans la ligne SLA (seulement email / WhatsApp à ce stade).

À re-tester après merge :

- [ ] Vérifier sur mobile (iPhone / Android) et desktop que les 3 cartes services en haut ont des textes d’une longueur visuellement proche (aucun pavé beaucoup plus long que les autres).
- [ ] Vérifier que la section « Votre expert en ventousage à Paris et en Île‑de‑France » est bien centrée et lisible en clair et dark mode (le bloc ovale ressemble à un mini-CTA).
- [ ] Vérifier que la FAQ de la home s’ouvre et se ferme correctement, que le texte est entièrement lisible sans être coupé, sur iPhone / Android / desktop.
- [ ] Vérifier rapidement l’ouverture/fermeture des FAQ sur 2–3 autres pages (par ex. /ventousage-paris/, /gardiennage/, /affichage-riverains/) pourur confirmer qu’aucun texte n’est coupé.
- [ ] Vérifier que les 3 icônes WhatsApp (héros, bouton flottant, footer) sont bien identiques, nets et lisibles en clair et dark mode.
- [ ] Vérifier qu’il ne reste plus de liens bleus sur la home (texte noir + liens orange en mode clair, texte clair + liens orange en dark mode).
- [ ] Vérifier que les boutons de toggle (lune = dark mode, main = main gauche/droite) sont bien visibles en dark mode (icône claire sur rond légèrement plus clair que le header).

### Hub NFC/QR & cartes de visite

- 2025-12-22 : Création de la page de contact rapide dédiée (hub NFC/QR) `/contact-direct/` avec un seul endroit où vivent les boutons WhatsApp / téléphone / email + mini-formulaire léger (usage principal : QR codes génériques, liens dans la signature, etc.).
- 2026-01-XX : Création/optimisation de la page dédiée aux cartes de visite `/contact-nfc/` avec :
  - carte de visite numérique compacte (visible sans scroll sur mobile),
  - bouton « Ajouter à mes contacts » (téléchargement vCard),
  - tracking dédié `nfc_page_view` + `nfc_contact_click` + `lead_contact` (`lead_origin = "nfc"`),
  - possibilité de versionner les cartes physiques via `?q1`, `?q2`, etc. (filtrage par `page_location` dans GA4).

Au fur et à mesure que nous modifions les pages ensemble, j’ajouterai ici les entrées correspondantes pour que tu puisses facilement re-tester après le merge.

### FAQ globales

- 2025-12-28 : Refonte du module JS `setupFaqAccordion` pour que la hauteur des réponses s’adapte automatiquement au contenu (plus de texte coupé), tout en conservant l’animation d’ouverture/fermeture.
- 2025-12-28 : Harmonisation des blocs FAQ sur les pages Ventousage / Sécurité / Gardiennage (structure HTML, titres, cohérence contenu + JSON-LD).

### Contact & formulaires

- 2025-12-28 : Suppression de toute mention de « formulaire de contact » sur les pages publiques ; modes de contact affichés = téléphone, WhatsApp, email.
- 2025-12-28 : Politique de confidentialité et `llms.txt` mis à jour pour refléter ce mode de contact (pas de formulaire général actif pour le moment).
- 2025-12-22 : Création de la page hub NFC/QR `/contact-direct/` avec 4 entrées : téléphone, WhatsApp, email, mini-formulaire unique.