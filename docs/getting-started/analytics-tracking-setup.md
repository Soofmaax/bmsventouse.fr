# Suivi & Analytics — Guide de mise en place

Ce guide t’explique comment configurer le **suivi complet** pour **bmsventouse.fr** sur les principales plateformes :

- Google Analytics 4 (GA4)
- Google Tag Manager (GTM)
- Google Search Console (GSC)
- Microsoft Clarity
- Et, via GTM : Google Ads, Meta Pixel (Facebook/Instagram), LinkedIn, etc.

> Le site est déjà câblé côté front.  
> Ton travail se fait surtout dans les interfaces Google / Clarity (création des comptes, des tags, et remplissage des IDs).

---

## 1. Google Analytics 4 (GA4)

### 1.1. Créer la propriété et le flux

1. Va sur https://analytics.google.com  
2. Crée (ou réutilise) une **propriété GA4** pour `bmsventouse.fr`.
3. Dans **Flux de données → Web**, crée un flux :
   - URL : `https://bmsventouse.fr`
   - Nom : `BMS Ventouse`
4. Note l’**ID de mesure** (format `G-XXXXXXX`).

Le dépôt utilise actuellement : `G-V7QXQC5260`.  
Si tu crées une nouvelle propriété, remplace cet ID dans les pages HTML où il apparaît.

### 1.2. Où GA4 est initialisé dans le code

Sur les pages principales (Accueil, Services, Contact, Ventousage, Sécurité, etc.) tu as déjà :

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V7QXQC5260"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'denied',
    'security_storage': 'granted'
  });
  gtag('js', new Date());
  gtag('config', 'G-V7QXQC5260', { anonymize_ip: true });
</script>
```

Pour utiliser TON ID GA4 :

- Remplace `G-V7QXQC5260` par ton ID de mesure sur les templates où ce snippet apparaît.

> Consent Mode v2 est déjà en place : analytics est *denied* par défaut, puis mis à jour par la bannière cookies.

### 1.3. Événements déjà envoyés

Dans `js/script.js`, le module `setupAnalyticsEvents()` et la capture du formulaire contact envoient :

- `phone_click`  
  - Sur tous les liens `tel:`
  - Paramètres :
    - `event_category: "Contact"`
    - `event_label: href (tel:+33...)`

- `whatsapp_click`  
  - Sur tous les liens `https://wa.me/...`
  - Paramètres :
    - `event_category: "Contact"`
    - `event_label: href (https://wa.me/...)`

- `email_click`  
  - Sur tous les liens `mailto:...`
  - Paramètres :
    - `event_category: "Contact"`
    - `event_label: href (mailto:contact@...)`

- `cta_contact_click`  
  - Sur tous les liens `href="/contact/"`
  - Paramètres :
    - `event_category: "CTA"`
    - `event_label: texte du lien (bouton)`

- `contact_submitted`  
  - Utilisé par la page de contact rapide (hub NFC/QR) `/contact-direct/` via un mini‑formulaire dédié.
  - Le code JS (`setupContactLeadCapture()`) est déjà branché sur ce formulaire (`form[name="contact"]`) et émet l’événement à chaque envoi réel.
  - L’événement transporte un payload complet :
    - `fullname`, `company`, `email`, `phone`,
    - `service`, `location`, `urgency`, `details`,
    - et des champs détaillés selon le service (ventousage, sécurité, convoyage, etc.).
  - L’événement est envoyé à la fois vers GA4 et dans le `dataLayer` pour GTM :

    ```js
    if (typeof gtag === 'function') {
      gtag('event', 'contact_submitted', payload);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'contact_submitted', ...payload });
    ```

### 1.4. Déclarer les conversions dans GA4

Dans GA4 :

1. Va dans **Configurer → Événements** (ou *Admin → Events* selon l’UI).
2. Attends d’avoir un peu de trafic pour voir remonter :
   - `contact_submitted`
   - `phone_click`, `whatsapp_click`, `email_click`, `cta_contact_click`
3. Marque comme **Conversions** :
   - `contact_submitted` (conversion principale : demande de devis),
   - éventuellement `phone_click` et `whatsapp_click` (micro‑conversions).

### 1.5. Tracking spécifique de la page NFC `/contact-nfc/`

La page dédiée aux cartes de visite (`/contact-nfc/`) a un module JS séparé (`setupNfcPageTracking()`) qui envoie :

- `nfc_page_view`  
  - à chaque visite de `/contact-nfc/` (quel que soit le paramètre de query `?q1`, `?q2`, etc.) ;
  - avec les paramètres de contexte :
    - `page_location` (URL complète, ex. `https://bmsventouse.fr/contact-nfc?q1`),
    - `page_path` (toujours `/contact-nfc/`),
    - `nfc_source` (actuellement `business_card`).

- `nfc_contact_click`  
  - à chaque clic sur les CTA de la carte NFC ;
  - avec le paramètre `cta_type` parmi :
    - `phone` (clic sur le numéro de téléphone),
    - `whatsapp` (clic WhatsApp direct),
    - `email` (clic email prérempli),
    - `contact_card` (clic sur le bouton « Ajouter à mes contacts » qui télécharge la vCard).

En plus, à chaque clic CTA sur la page NFC, le module appelle aussi :

```js
trackLeadContact(type, 'nfc');
```

ce qui émet un événement `lead_contact` global, avec `lead_origin = "nfc"`.

Ces événements sont envoyés à la fois vers GA4 et dans `dataLayer`.  
Tu peux :

- filtrer dans GA4 sur `page_path = /contact-nfc/` + `event_name = nfc_contact_click`,
- regarder quelles actions sont les plus utilisées (`cta_type`) pour optimiser la carte à terme,
- filtrer par version de carte via `page_location` (par ex. URLs contenant `?q1`, `?q2`, …),
- marquer `nfc_contact_click` (et/ou `lead_contact` avec `lead_origin = "nfc"`) comme **conversion** si tu veux suivre les leads issus des cartes NFC.

---

## 2. Google Tag Manager (GTM)

Le code du site supporte **GTM en option** (tu n’es pas obligé de l’utiliser).

### 2.1. Créer ton container GTM

1. Va sur https://tagmanager.google.com  
2. Crée un **container Web** :
   - Nom : `BMS Ventouse`
   - Plateforme : Web
3. Note l’**ID GTM** (format `GTM-XXXXXXX`).

### 2.2. Connecter le site à ton container

Le code supporte GTM côté JS via une meta optionnelle `gtm-id` :

```js
function setupGTM() {
  try {
    const meta = document.querySelector('meta[name="gtm-id"]');
    const id = (meta && meta.content || (window.GTM_ID || '')).trim();
    if (!id) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  } catch (e) {}
}
```

Actuellement, les templates HTML **n’incluent plus** de meta `gtm-id` (GTM est donc désactivé par défaut).  
Pour activer GTM :

1. Édite les templates clés (ex. `index.html`, `services/index.html`, `contact/index.html`, etc.).
2. Ajoute ou renseigne ton ID GTM dans le `<head>` :

   ```html
   <meta name="gtm-id" content="GTM-ABCD123">
   ```

3. Déploie. GTM se chargera automatiquement sur ces pages.

> Comme GA4 est déjà injecté en dur dans le HTML :
> - Option simple : **tu gardes GA4 tel quel** et tu utilises GTM uniquement pour les autres tags (Google Ads, Meta, LinkedIn…).
> - Option avancée : tu bascules GA4 dans GTM et tu retires l’init direct dans le HTML (pour ne pas compter en double).

### 2.3. Utiliser les événements existants dans GTM

Tu peux utiliser les événements déjà présents dans `dataLayer` comme déclencheurs :

- `contact_submitted`
- `phone_click`
- `whatsapp_click`
- `email_click`
- `cta_contact_click`

Dans GTM :

1. Crée un **Déclencheur → Événement personnalisé** :
   - Nom de l’événement : par ex. `contact_submitted`.
2. Attache ce déclencheur aux tags de ton choix :
   - Tag de conversion Google Ads,
   - Tag Meta (événement `Lead`),
   - Tag LinkedIn, etc.

Le payload (`fullname`, `company`, `service`, `location`…) est déjà dans `dataLayer` pour `contact_submitted`.

---

## 3. Google Search Console (GSC)

Pas un “tag”, mais indispensable pour suivre l’indexation et les erreurs SEO.

### 3.1. Créer et vérifier la propriété

1. Va sur https://search.google.com/search-console  
2. Ajoute une propriété :
   - De préférence **Domaine** : `bmsventouse.fr`
3. Vérifie la propriété :
   - Google te donne un enregistrement **TXT DNS** à ajouter chez ton hébergeur de domaine.
   - Une fois propagé, GSC valide ton site.

### 3.2. Ajouter le sitemap

Une fois la propriété validée :

1. Dans GSC, va dans **Indexation → Sitemaps**.
2. Ajoute l’URL :

   - `https://bmsventouse.fr/sitemap.xml`

Google suit automatiquement les nouvelles pages et les pages locales (ventousage, sécurité, logistique…).

---

## 4. Microsoft Clarity

Clarity est déjà intégré, mais **respecte le consentement** :

- Le code est dans `js/script.js` (`setupClarity()` + `loadClarityIfConsented()`).
- Clarity n’est chargé que si l’utilisateur :
  - a déjà accepté le cookie analytics, ou
  - clique sur “Accepter” dans la bannière.

Pour utiliser ton propre projet Clarity :

1. Va sur https://clarity.microsoft.com et crée un projet pour `bmsventouse.fr`.
2. Récupère l’**ID Clarity**.
3. Dans `js/script.js`, la fonction `setupClarity()` contient :

   ```js
   (function(c,l,a,r,i,t,y){
     c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
     t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
     y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
   })(window, document, "clarity", "script", "tm9ex1xsa4");
   ```

   Remplace `"tm9ex1xsa4"` par ton ID Clarity.

4. Déploie. Clarity continuera à ne se charger que si l’analytics est accepté.

---

## 5. Autres tags (Google Ads, Meta, LinkedIn, etc.)

La bonne pratique : **tout ajouter via GTM**, sans toucher au HTML.

### 5.1. Google Ads (conversions)

Dans Google Ads :

1. Crée une action de conversion (type “Formulaire de contact” par exemple).
2. Récupère l’ID de conversion et le label.

Dans GTM :

1. Crée un tag :
   - Type : **Suivi de conversion Google Ads**.
   - Renseigne l’ID de conversion et le label.
2. Déclencheur :
   - `Événement personnalisé` → `contact_submitted`.
3. Publie le container.

### 5.2. Meta Pixel (Facebook / Instagram)

Dans Meta Business Manager :

1. Crée un **Pixel** pour ton site et note l’ID.

Dans GTM :

1. Crée un tag (modèle communautaire ou **HTML personnalisé**) avec le code Pixel.
2. Déclencheur :
   - Base Pixel sur **All Pages**.
   - Événement `Lead` sur l’événement personnalisé `contact_submitted` si tu veux suivre les demandes de devis.
3. Teste avec le **Meta Pixel Helper**.

### 5.3. LinkedIn Insight Tag

Dans LinkedIn Campaign Manager :

1. Récupère le snippet de l’Insight Tag.

Dans GTM :

1. Crée un tag **HTML personnalisé** avec le snippet.
2. Déclencheur :
   - **All Pages** (tag de base).
3. Pour suivre les conversions :
   - soit via des règles dans LinkedIn sur l’URL (ex: `/contact/?success=1`),
   - soit via des événements déduits de GA4 (stratégie d’import).

---

## 6. Checklist récap

Pour être opérationnel sur toutes les plateformes :

### GA4

- [ ] Propriété et flux Web créés.
- [ ] ID de mesure (format `G-XXXXXXX`) renseigné dans le snippet `gtag`.
- [ ] Événements visibles :  
  `phone_click`, `whatsapp_click`, `email_click`, `cta_contact_click`, `contact_submitted` (mini‑formulaire du hub `/contact-direct/`).
- [ ] `contact_submitted` marqué en **Conversion** (lead principal) pour suivre les demandes de devis issues du hub NFC/QR.

### GTM

- [ ] Container Web créé : `GTM-XXXXXXX`.
- [ ] Meta `<meta name="gtm-id" content="GTM-XXXXXXX">` renseignée sur les templates principaux.
- [ ] (Optionnel) Tags ajoutés :
  - Google Ads (déclenché sur `contact_submitted`),
  - Meta Pixel (`Lead` sur `contact_submitted`),
  - LinkedIn Insight Tag, etc.

### Search Console

- [ ] Propriété `bmsventouse.fr` créée (type Domaine).
- [ ] Vérification DNS OK.
- [ ] Sitemap soumis : `https://bmsventouse.fr/sitemap.xml`.

### Clarity

- [ ] Projet Clarity créé, ID ajusté dans `setupClarity()` si nécessaire.
- [ ] Vérifié que Clarity ne se déclenche qu’après acceptation des cookies analytics.

Avec tout ça en place, tu peux :

- Suivre toutes les actions de contact (téléphone, WhatsApp, email, formulaire),
- Mesurer la perf SEO et les pages qui génèrent des leads,
- Ajouter facilement de nouveaux tags via GTM sans retoucher ton code HTML.