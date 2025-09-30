[← Retour à l’index de la documentation](./README.md)

# Analytics — GA4 + Consent Mode v2
[Docs](./README.md) • [Dév](./DEVELOPMENT.md) • [SEO](./SEO_GUIDE.md) • [A11y](./ACCESSIBILITY.md) • [Analytics](./ANALYTICS_GA4.md) • [Contenu](./CONTENT_GUIDELINES.md) • [Release](./RELEASE_CHECKLIST.md) • [Contrib](./CONTRIBUTING.md)

Implémentation
- gtag.js chargé en async sur toutes les pages.
- Consent par défaut: denied (analytics_storage).
- Anonymisation d’IP activée.

Measurement ID
- ID actuel: G-VCB3QB5P4L
- Mise à jour: remplacer l’ID si nécessaire dans les fichiers HTML (recherche “G-VCB3QB5P4L”).

Consent management
- Cookie banner (js/script.js):
  - localStorage key: bms_cookie_consent = "accepted" | "denied"
  - Met à jour gtag('consent','update', { analytics_storage: ... })
- Pour “gérer les cookies” depuis un lien footer:
  - Option simple: supprimer la clé et recharger
    - JS: localStorage.removeItem('bms_cookie_consent'); location.reload();
  - Ou implémenter un bouton qui réaffiche la bannière (à faire si souhaité).

Événements suivis (de base)
- phone_click (sur liens tel:)
- whatsapp_click (sur liens wa.me)
- email_click (sur liens mailto:)
- cta_contact_click (sur liens /contact/)

Vérifier l’intégration
- GA4 DebugView ou Realtime après acceptation du consentement.
- Le Consent Mode bloque tout tracking tant que l’utilisateur n’a pas consenti.

Confidentialité
- Pas de publicités, pas de remarketing.
- analytics_storage uniquement; IP anonymisée.