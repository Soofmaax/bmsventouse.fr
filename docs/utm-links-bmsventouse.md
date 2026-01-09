# Liens UTM standardisés — BMS Ventouse

Ce fichier regroupe les URLs **prêtes à l’emploi** avec UTM pour suivre l’origine des leads dans GA4.

- Landing principale leads : `https://bmsventouse.fr/contact-direct/`
- Page spéciale cartes NFC : `https://bmsventouse.fr/contact-nfc/`

Le principe :  
- `utm_source` = d’où vient le trafic (email, instagram, x, facebook, whatsapp, nfc, …)  
- `utm_medium` = type de canal (cold, social, business_profile, offline, …)  
- `utm_campaign` = nom de campagne (par ex. cold_bms_q1_2026, bio_bms, etc.)

---

## 1. Cold emails — par trimestre (Q1 → Q4)

Ces liens sont à utiliser dans **le même template d’email cold**, mais en changeant de lien par trimestre.  
Tous pointent vers `/contact-direct/`.

### Q1 2026 (janvier–mars)

```text
https://bmsventouse.fr/contact-direct/?utm_source=email&utm_medium=cold&utm_campaign=cold_bms_q1_2026
```

### Q2 2026 (avril–juin)

```text
https://bmsventouse.fr/contact-direct/?utm_source=email&utm_medium=cold&utm_campaign=cold_bms_q2_2026
```

### Q3 2026 (juillet–septembre)

```text
https://bmsventouse.fr/contact-direct/?utm_source=email&utm_medium=cold&utm_campaign=cold_bms_q3_2026
```

### Q4 2026 (octobre–décembre)

```text
https://bmsventouse.fr/contact-direct/?utm_source=email&utm_medium=cold&utm_campaign=cold_bms_q4_2026
```

> Utilisation recommandée dans le corps de l’email + dans la signature (ligne “Site”).  
> Visuellement tu peux afficher “bmsventouse.fr”, et derrière utiliser l’URL UTM ci‑dessus.

---

## 2. Bios réseaux sociaux (Instagram, X, Facebook)

Pas de découpe par trimestre ici : ces liens sont **stables** et utilisés sur la durée.

### 2.1. Bio Instagram (profil)

```text
https://bmsventouse.fr/contact-direct/?utm_source=instagram&utm_medium=social&utm_campaign=bio_bms
```

### 2.2. Bio X (Twitter) — profil

```text
https://bmsventouse.fr/contact-direct/?utm_source=x&utm_medium=social&utm_campaign=bio_bms
```

### 2.3. Page Facebook — lien “Site web”

```text
https://bmsventouse.fr/contact-direct/?utm_source=facebook&utm_medium=social&utm_campaign=bio_bms
```

> Dans GA4, tu pourras analyser les leads par plateforme via `source` (instagram / x / facebook)  
> et regrouper toute la bio des réseaux sous la même campagne `bio_bms`.

---

## 3. WhatsApp Business — lien “Site web”

À utiliser dans la fiche **WhatsApp Business** (champ “Site Web”) pour les prospects qui cliquent depuis WhatsApp.

```text
https://bmsventouse.fr/contact-direct/?utm_source=whatsapp&utm_medium=business_profile&utm_campaign=profil_bms
```

---

## 4. Cartes de visite NFC — page dédiée

La page spéciale cartes NFC est : `/contact-nfc/`.  
Elle a déjà un tracking spécifique côté site (`nfc_page_view` + `nfc_contact_click` + `lead_contact` avec `lead_origin = "nfc"`).

### 4.1. Version recommandée (URL propre, sans UTM)

Pour les **cartes de visite NFC** (et les QR codes imprimés sur ces cartes), on utilise une URL courte et lisible, avec un petit paramètre de version :

- **Batch 1 (cartes actuelles)**  
  ```text
  https://bmsventouse.fr/contact-nfc?q1
  ```

- **Batch 2, 3, … (futures impressions)**  
  ```text
  https://bmsventouse.fr/contact-nfc?q2
  https://bmsventouse.fr/contact-nfc?q3
  ```

Dans GA4, tu peux alors :

- filtrer sur `event_name = nfc_page_view` ou `nfc_contact_click`,  
- ajouter `page_location` en dimension,  
- filtrer sur `page_location` qui contient `?q1`, `?q2`, etc. pour comparer les versions de cartes.

> Avantages :  
> - URL courte (ne ressemble pas à un lien de tracking marketing),  
> - versionnement simple par batch (`q1`, `q2`, …),  
> - aucun changement de code nécessaire côté site.

### 4.2. Option avancée : UTM sur QR codes (facultatif)

Si un jour tu veux des QR codes séparés (par exemple QR sur une affiche, sur un flyer, etc.), tu peux **garder `/contact-nfc/`** et ajouter des UTM **uniquement pour ces supports** :

```text
https://bmsventouse.fr/contact-nfc/?utm_source=nfc&utm_medium=offline&utm_campaign=affiche_salon
```

Dans ce cas, tu pourras filtrer dans GA4 à la fois par :

- `page_path = /contact-nfc/`,
- `source = nfc`, `medium = offline`,
- et, si besoin, `campaign = affiche_salon`.

Pour les cartes de visite physiques, la recommandation reste : **URL courte avec `?q1`, `?q2`, …, sans UTM**.

---

## 5. Lecture dans GA4 (rappel rapide)

Une fois ces URLs utilisées :

- Les sessions seront marquées avec :
  - `source` (email, instagram, x, facebook, whatsapp, nfc, …)
  - `medium` (cold, social, business_profile, offline)
  - `campaign` (cold_bms_q1_2026, bio_bms, profil_bms, carte_bena)

- Les événements de contact déjà en place dans le site :
  - `phone_click`
  - `whatsapp_click`
  - `email_click`
  - `cta_contact_click`
  - `nfc_contact_click` (sur `/contact-nfc/`)

Dans GA4, tu pourras :

1. Aller dans **Engagement → Événements**, cliquer sur `phone_click` / `whatsapp_click` / `email_click` / `nfc_contact_click`.
2. Ajouter comme dimension secondaire `Session source / medium` ou `Session campaign`.
3. Filtrer sur :
   - `campaign = cold_bms_q1_2026` pour les leads email cold Q1,
   - `campaign = bio_bms` pour les leads venant des bios réseaux sociaux,
   - `campaign = profil_bms` pour WhatsApp Business,
   - `campaign = carte_bena` pour les cartes NFC.

Tu peux ensuite marquer ces événements (`phone_click`, `whatsapp_click`, `email_click`, `nfc_contact_click`) comme **conversions** dans GA4 si tu veux suivre ces leads en priorité.