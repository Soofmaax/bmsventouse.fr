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
- `/realisations/` – Références / Réalisations
- `/devis/` – Page Devis
- `/contact/` – Page Contact
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

### 1.5. Pages tarifaires

- `/prix-ventousage-paris/` – Tarifs / prix ventousage Paris

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

## 5. Autres pages “marque” / partenaires

- `/urban-regie/` – Page partenaire Urban Régie

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

À re-tester après merge :

- [ ] Vérifier sur mobile (iPhone / Android) et desktop que les 3 cartes services en haut ont des textes d’une longueur visuellement proche (aucun pavé beaucoup plus long que les autres).
- [ ] Vérifier que la section « Votre expert en ventousage à Paris et en Île‑de‑France » est bien centrée et lisible en clair et dark mode (le bloc ovale ressemble à un mini-CTA).
- [ ] Vérifier que la FAQ de la home s’ouvre et se ferme correctement, que le texte est entièrement lisible sans être coupé, sur iPhone / Android / desktop.

Au fur et à mesure que nous modifions les pages ensemble, j’ajouterai ici les entrées correspondantes pour que tu puisses facilement re-tester après le merge.