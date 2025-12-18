# Contact

## Meta informations
- URL : https://www.bmsventouse.fr/contact/
- Title tag : Contact & Devis Gratuit 24/7 | BMS Ventouse
- Meta description : Contactez BMS Ventouse pour un devis gratuit. Joignable 24/7 par téléphone, WhatsApp ou email pour tous vos besoins en logistique de tournage.

## Contenu principal

### Héros
- Titre : Un Projet ? Une Urgence ?
- Texte principal : Devis gratuit sous 24h, réponse rapide aux demandes urgentes. Contact direct 24h/24, 7j/7.
- Image :
  - /images/contact-hero-background-desktop.webp
  - /images/contact-hero-background-mobile.webp
  - Fallback : /images/hero-background-custom.jpg
  - Alt : Personne utilisant un téléphone pour contacter un service (image héro)

### Urgence
- Bandeau urgence : icône alerte + message.
- Texte : « Un tournage de dernière minute ? Appelez maintenant ! Nous vous recontactons au plus vite en fonction de l’urgence. »
- Téléphone urgence : +33 6 46 00 56 42 (Béna)
- CTA : bouton “Appel d’Urgence” → tel:+33646005642

### Contacts directs (cartes)
1. **Par téléphone**
   - Bénéficiaire principal : Béna
   - Numéro : +33 6 46 00 56 42
   - Usage : urgences, arbitrages rapides, validation terrain.
2. **Par WhatsApp**
   - Lien : https://wa.me/33646005642?text=Bonjour,%20j'aimerais%20obtenir%20un%20devis%20gratuit.
   - Usage : échanges rapides, envoi de plans, photos, adresses.
3. **Par email**
   - Adresse : contact@bmsventouse.fr
   - Lien : mailto:contact@bmsventouse.fr?subject=Demande%20de%20Devis%20Gratuit
   - Usage : demandes détaillées, cahiers des charges, repérages.

### Formulaire de contact (devis)
- Action : https://formsubmit.co/contact@bmsventouse.fr
- Champs :
  - Nom et prénom (obligatoire)
  - Boîte de production / Société (obligatoire)
  - Téléphone (obligatoire)
  - Email (optionnel)
  - Type de besoin (liste) :
    - Ventousage / AOT / Affichage riverains
    - Sécurité de tournage / Gardiennage
    - Convoyage véhicules / décors
    - Régie / loges / cantine
    - Autre besoin logistique
  - Ville / lieu principal (liste) :
    - Paris / Île‑de‑France
    - Lyon
    - Marseille
    - Bordeaux
    - Strasbourg
    - Nice
    - Toulouse
    - Lille
    - Autre (France)
  - Niveau d’urgence :
    - Très urgent (dans les 24 h) → `urgent_24h`
    - Urgent (sous 2–3 jours) → `urgent_72h`
    - Date déjà fixée / à planifier → `date_fixee`
  - Message détaillé (obligatoire) :
    - dates, lieux précis, type de tournage (pub, série, événement…),
    - besoins en ventousage, sécurité, convoyage, régie/loges/cantine.
  - Consentement RGPD (case obligatoire).

- Configuration FormSubmit :
  - `_subject` : « Nouveau formulaire BMS Ventouse »
  - `_next` : /contact/?success=1
  - `_captcha` : false
  - `_template` : table
  - Honeypots : `honeypot`, `bot-field`

### Zones d’intervention
- Paris & Île‑de‑France : Paris, Boulogne‑Billancourt, Montreuil, Saint‑Denis…
- Lyon & Sud‑Est : Lyon, Marseille, Nice, Grenoble…
- Bordeaux & Sud‑Ouest : Bordeaux, Toulouse, Montpellier, Nantes…
- Partout ailleurs en France : équipes mobiles, déplacements rapides.

### CTA principaux
- Formulaire de devis (sur la page)
- Email direct → mailto:contact@bmsventouse.fr
- WhatsApp direct → https://wa.me/33646005642
- Appel d’urgence → tel:+33646005642

## Éléments notables
- Accessibilité : skip-link, alt corrects, labels explicites, champs obligatoires indiqués, contrastes OK.
- SEO : balises OG/Twitter complètes, canonical, title/description dédiés.
- Tracking : envoi des données clés (service, location, urgence, message) via dataLayer pour GA4/CRM.
- Performance : images héros préchargées, CSS/JS optimisés, WebP + fallback JPEG.