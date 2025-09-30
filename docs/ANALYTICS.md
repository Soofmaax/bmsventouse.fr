# Analytics (GA4) — Consent Mode v2

Ce site utilise Google Analytics 4 avec Consent Mode v2, configuré pour respecter la confidentialité (IP anonymisée, aucun tracking tant que l’utilisateur n’a pas consenti).

## Implémentation

- Snippet `gtag.js` dans le `<head>` de chaque page
- Consent par défaut:
  ```
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    security_storage: 'granted'
  });
  ```
- Config GA:
  ```
  gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
  ```

## Bannière cookies

- Gérée dans `js/script.js`
- Stockage du choix dans `localStorage`
- Mise à jour GA:
  ```
  gtag('consent', 'update', { analytics_storage: 'granted' | 'denied' });
  ```

## Événements suivis

- `phone_click` — clic sur liens `tel:`
- `whatsapp_click` — clic sur liens `wa.me`
- `cta_contact_click` — clics vers `/contact/`
- `email_click` — clics sur `mailto:`

## Debug

- GA4 Admin → DebugView / Realtime
- Tester après consentement “Accepter” sur la bannière
- Vérifier les hits dans le réseau (DevTools) vers `collect` avec `tid=G-XXXXXXXXXX`

## Mesure ID

- Remplacer l’ID placeholder par celui de la propriété GA4: `G-XXXXXXXXXX`
- Actuellement: `G-VCB3QB5P4L` (peut être mis à jour par le propriétaire)