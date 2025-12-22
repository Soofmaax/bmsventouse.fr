# Convention icônes & SVG – BMS Ventouse

1. **Pas de polices d’icônes** (Font Awesome, etc.) : on utilise uniquement des **SVG inline** dans le HTML.
2. Les icônes suivent le style **Bootstrap Icons** : `viewBox="0 0 16 16"` ou `0 0 24 24`, `fill="currentColor"`, pas de couleur en dur.
3. Pour ajouter une icône, il suffit de fournir le bloc :
   ```html
   <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
     <path d="..."/>
   </svg>
   ```
   (sans `<script>`, sans `<style>` interne, si possible un seul `<path>`).
4. Les tailles sont gérées par le CSS :  
   - cartes services : `.service-card .service-icon svg { width:32px; height:32px; }`  
   - cartes zones : `.zone-card svg { width:2rem; height:2rem; }`  
   - contact : `.contact-card .contact-icon svg { width:1.75rem; height:1.75rem; }`
5. Pour les boutons (WhatsApp, téléphone, mail, etc.), l’icône est placée **avant le texte**, avec `width="16" height="16"` et `viewBox="0 0 16 16"`.
6. Si tu me fournis des SVG personnalisés : envoie **uniquement la partie `<svg>...</svg>`**, sans DOCTYPE ni `<html>`.
7. Le site **official Bootstrap** (`https://getbootstrap.com` et `https://icons.getbootstrap.com`) est fiable : projet open source très utilisé. On copie leurs SVG **en local** dans le HTML, on ne charge pas de script externe.
8. Si un même SVG est utilisé partout (ex : WhatsApp), on choisit **une seule version de référence** et on la réutilise sur toutes les pages pour garder une iconographie cohérente.
9. Les couleurs et hover sont gérés par le CSS (via `currentColor`), pas dans le SVG : ça garantit un rendu correct en **mode clair** et **mode sombre**.
10. En cas de doute : tu m’envoies ton SVG (ou le lien Bootstrap Icons), et je l’intègre dans le bon composant et au bon endroit dans le CSS/HTML.
11. 
Voici la cartographie des icônes présentes sur le site, regroupées par rôle, avec pour chacune :

où elle apparaît,
ce qu’elle doit évoquer,
1–2 idées d’icônes Bootstrap correspondantes (noms à chercher sur icons.getbootstrap.com).
Je me concentre sur les types d’icônes (rôle sémantique), pas sur chaque duplication dans les pages.

1. Icônes d’interface globale (navigation, UI)
1.1. Bouton « mode gaucher/droitier » (.hand-toggle)
Où

Dans le header, à droite du menu principal (toutes les pages qui utilisent le header commun).
Rôle

Indiquer le mode à une main (actions principales basculées à gauche ou à droite).
Ce que ça doit évoquer

Une main / un doigt qui appuie, ou une bascule de disposition gauche ↔ droite.
Icônes Bootstrap possibles

hand-index-thumb ou hand-index-thumb-fill (main qui appuie, très parlant pour une action à une main)
éventuellement arrow-left-right si tu préfères une iconographie plus abstraite (mise en miroir gauche/droite).
 

1.2. Bouton « mode sombre » (.theme-toggle)
Où

À côté du bouton précédent dans le header (icône de lune).
Rôle

Activer/désactiver le mode sombre.
Ce que ça doit évoquer

Nuit / luminosité / thème sombre.
Icônes Bootstrap possibles

moon-stars ou moon-stars-fill (le plus explicite pour un thème sombre)
alternative plus neutre : brightness-alt-high ou sun/sun-fill si tu veux jouer une alternance soleil/lune.
 

1.3. Bouton « Retour en haut » (.back-to-top)
Où

En bas de page d’accueil (et sur d’autres pages partageant ce composant).
Rôle

Remonter en haut de la page.
Ce que ça doit évoquer

Flèche simple vers le haut.
Icônes Bootstrap possibles

chevron-up (léger, discret)
ou arrow-up-short (plus affirmé).
 

1.4. Flèches du carrousel de références (logos)
Où

Section « Ils Nous Font Confiance » sur la home : boutons précédent/suivant.
Rôle

Faire défiler le carrousel de logos.
Ce que ça doit évoquer

Navigation horizontale gauche/droite.
Icônes Bootstrap possibles

chevron-left et chevron-right
ou, plus marquées : arrow-left / arrow-right.
2. Icônes de contact & CTA (téléphone, WhatsApp, email, urgence)
2.1. Icône « email / devis / contact » (enveloppe)
Où

Bouton « Demander un devis » sur la home.
Boutons « Nous contacter », « Envoyer un email », CTA de bas de page, footers, etc.
Rôle

Représenter un contact par email / formulaire de devis.
Ce que ça doit évoquer

Enveloppe simple (message/email).
Icônes Bootstrap possibles

envelope-fill (classique, lisible partout)
éventuellement envelope-paper si tu veux un style un peu plus « document ».
 

2.2. Icône WhatsApp
Où

Hero (bouton « WhatsApp Direct »),
CTA de sections contact,
boutons dans les cartes de contact,
icône flottante .whatsapp-float en bas de l’écran,
dans presque tous les footers.
Rôle

Indiquer le contact direct par WhatsApp.
Ce que ça doit évoquer

Logo WhatsApp officiel / bulle de message verte.
Icônes Bootstrap possibles

whatsapp (l’icône de marque dans Bootstrap Icons – tu l’utilises déjà via le path M13.601 2.326...).
Tu peux uniformiser tous les icônes WhatsApp (anciennes variantes Font Awesome + flottant) sur ce même whatsapp.
 

2.3. Icône téléphone
Où

Bouton d’appel d’urgence sur /contact/ (« Appel d'Urgence »).
Cartes « Par téléphone ».
Lignes « Contact Direct » dans les footers (Béna / Yann / Urban Régie).
D’autres CTA téléphoniques.
Rôle

Appel téléphonique direct, ligne d’urgence, contact prioritaire.
Ce que ça doit évoquer

Combiné téléphonique classique.
Icônes Bootstrap possibles

telephone-fill (compact, très standard)
ou, pour un call-to-action plus « action » : telephone-outbound (téléphone + flèche sortante).
 

2.4. Icône d’urgence / alerte (triangle avec !)
Où

Bannière « Un tournage de dernière minute ? » sur la page contact (triangle avec point d’exclamation).
Rôle

Signaler une situation urgente ou critique.
Ce que ça doit évoquer

Danger, alerte, attention.
Icônes Bootstrap possibles

exclamation-triangle-fill (le plus proche visuellement)
ou exclamation-octagon-fill si tu préfères un style panneau d’alerte.
 

2.5. Icône « disponibilité 24/7 » (horloge)
Où

Footer de la home : ligne « Disponible 24/7 » avec un cercle + aiguille (horloge).
Rôle

Disponibilité permanente / service 24h/24.
Ce que ça doit évoquer

Horloge / temps.
Icônes Bootstrap possibles

clock-fill (horloge pleine)
ou alarm-fill si tu veux quelque chose de légèrement plus dynamique/urgent.
 

2.6. Icônes dans les cartes de contact (téléphone / WhatsApp / email)
Où

Page /contact/, section « Demandez votre Devis Gratuit » : 3 cartes avec chacune une icône en haut.
Rôle

Carte 1 : téléphone (contact direct)
Carte 2 : WhatsApp
Carte 3 : email
Icônes Bootstrap possibles

Réutiliser les mêmes couples que ci-dessus :
telephone-fill
whatsapp
envelope-fill
Ça garantit une identité visuelle cohérente avec les CTA et le footer.
3. Icônes de services (home)
3.1. Ventousage & autorisations (icône verticale à plusieurs cercles)
Où

Home, section « Services de Logistique Audiovisuelle… » → carte « Ventousage Plateau & Autorisations de Tournage ».
Rôle

Représenter le ventousage, la neutralisation de stationnement, la signalisation B6, etc.
Ce que ça doit évoquer

Panneaux, cônes, signalisation de chantier / circulation modifiée.
Icônes Bootstrap possibles

cone-striped (cône de chantier, très parlant pour ventousage/signalisation)
ou signpost-split (panneau directionnel, bon pour symboliser la signalisation).
 

3.2. Gardiennage & sécurité (bouclier)
Où

Home, même section → carte « Gardiennage & Sécurité de Plateau 24h/24 ».
Un bouclier stylisé est déjà utilisé.
Rôle

Protection, gardiennage, sécurité.
Ce que ça doit évoquer

Sécurité / défense / verrouillage.
Icônes Bootstrap possibles

shield-lock-fill (bouclier avec cadenas, parfait pour la sécurité)
ou shield-fill-check (bouclier + check → confiance / conformité).
 

3.3. Régie technique & transport (camion / logistique)
Où

Home, carte « Régie Technique & Transport Spécialisé » (icône type camion/logistique).
Rôle

Convoyage, transport de matériel et véhicules, logistique technique.
Ce que ça doit évoquer

Camion, livraison, transport.
Icônes Bootstrap possibles

truck (camion simple)
ou truck-front (vue de face, très lisible même en petit).
 
4. Icônes géographiques (villes, départements, route, carte)
Ces icônes apparaissent :

Dans les sections « Nos Zones d’Intervention » / zone-card.
Sur les pages locales (ventousage-paris, ventousage-cinema, logistique-seine-saint-denis, logistique-seine-et-marne, logistique-val-d-oise, pages sécurité par ville, etc.).
Via les anciennes classes Font Awesome (normalisées en inline SVG par migrateFAIconsToInlineSVG).
4.1. Icône « ville » (fa-city / building)
Où

Cartes de zones « Paris & Île‑de‑France », « Meaux », « Melun », « Paris intra-muros », etc.
Rôle

Représenter un centre urbain, une ville précise.
Ce que ça doit évoquer

Skyline / building, zone urbaine.
Icônes Bootstrap possibles

building ou building-fill
éventuellement buildings si tu veux une skyline plus dense.
 

4.2. Icône « route / axes routiers » (fa-road)
Où

Zones « Lyon & Sud‑Est », sections mettant en avant les accès complexes, cartes liées aux routes, etc.
Rôle

Représenter les axes routiers, l’accès, les itinéraires.
Ce que ça doit évoquer

Routes, directions, circulation.
Icônes Bootstrap possibles

signpost-split ou signpost (très utiles pour symboliser la direction / la route)
en complément, sign-turn-right si tu veux quelque chose de plus « panneau routier ».
 

4.3. Icône « carte / département / région » (fa-map)
Où

Cartes « Bordeaux & Sud‑Ouest », « Gironde », « Bas‑Rhin », « Haute‑Garonne », etc.
Rôle

Représenter un département / région / zone plus large que la ville.
Ce que ça doit évoquer

Carte, territoire.
Icônes Bootstrap possibles

map ou map-fill (les plus logiques)
pour une vision plus globale, globe (si tu souhaites marquer un rayon plus large, mais map convient bien).
 

4.4. Icônes « position / adresse » : pins, marqueurs
Où

Footer home (NAP : adresse complète Drancy).
Carte « Partout ailleurs en France » sur /contact/.
Page Urban Régie : fa-map-marker-alt.
CTA du type « Ventousage à Paris » ou « Voir le ventousage à Paris » (fa-map-pin, fa-map-signs).
Rôle

Position géographique précise (adresse, point sur carte).
Lien vers une page spécifique de ventousage dans une ville.
Ce que ça doit évoquer

Pin de carte, localisation.
Icônes Bootstrap possibles

geo-alt ou geo-alt-fill (pin de carte standard)
pour « Voir le ventousage à Paris » (signalisations/itinéraires) : signpost-fill ou signpost-2.
 
5. Icônes de cas d’usage (page ventousage)
Sur /ventousage/, section « Cas d’usage concrets », trois cartes utilisent des icônes spécifiques :
5.1. « Fiction nocturne »
Rôle

Tournage de fiction de nuit, ambiance nocturne, neutralisation discrète.
Ce que ça doit évoquer

Nuit, lune, tournage.
Icônes Bootstrap possibles

moon-stars / moon-stars-fill
ou, si tu veux plus d’orientation « cinéma », film ou camera-reels (mais moon-stars colle très bien au texte).
 

5.2. « Fashion Week »
Rôle

Défilés, mode, Fashion Week, gestion de flux et logistique événementielle.
Ce que ça doit évoquer

Mode, événement, public, coulisses.
Icônes Bootstrap possibles

bag-fill (sac → univers mode / retail)
ou people-fill (public / foule / événement).
 

5.3. « Déménagement sensible »
Rôle

Réservations de stationnement, déménagements compliqués, pose rapide de signalisation.
Ce que ça doit évoquer

Camion de déménagement, mouvement, transport.
Icônes Bootstrap possibles

truck
ou truck-front si tu veux une icône très lisible même en tout petit.
 
6. Icônes de navigation vers les services (boutons « Voir nos services »)
Ces icônes viennent des anciennes classes Font Awesome fa-list et sont déjà mappées dans migrateFAIconsToInlineSVG.
Où

Dans de nombreuses pages de service ou locales (ventousage-pantin, logistique-*, securite-tournage-*, urban-regie, etc.) sur les boutons :
« Voir nos services »
« Voir nos autres services »
« Découvrir nos services »
Rôle

Indiquer un lien vers la liste complète des services.
Ce que ça doit évoquer

Liste / catalogue.
Icônes Bootstrap possibles

list-ul (liste à puces)
ou list-task (liste + cases, un peu plus moderne).
 
7. Icônes spécifiques Urban Régie
La page /urban-regie/ réutilise la plupart des icônes déjà listées :
Téléphone (fa-phone, même path que le reste du site) → telephone-fill.
WhatsApp → whatsapp.
Email → envelope-fill.
Adresse (fa-map-marker-alt) → geo-alt ou geo-alt-fill.
Tu peux donc reprendre exactement les mêmes icônes Bootstrap que pour BMS pour garder une cohérence visuelle entre les deux entités.

 
8. Résumé rapide des familles d’icônes & suggestions
Pour t’aider à choisir rapidement sur icons.getbootstrap.com, voici les familles principales et les noms à chercher :

Contact

Email/devis : envelope-fill
WhatsApp : whatsapp
Téléphone : telephone-fill, telephone-outbound
Urgence & disponibilité

Urgence : exclamation-triangle-fill
Disponible 24/7 : clock-fill ou alarm-fill
Navigation UI

Mode gaucher/droitier : hand-index-thumb(-fill) ou arrow-left-right
Mode sombre : moon-stars(-fill)
Retour en haut : chevron-up / arrow-up-short
Carrousel : chevron-left / chevron-right
Services

Ventousage / signalisation : cone-striped, signpost-split
Gardiennage & sécurité : shield-lock-fill, shield-fill-check
Convoyage / logistique : truck, truck-front
Zones & géographie

Ville : building(-fill)
Département / région : map(-fill)
Routes / accès : signpost-split, signpost
Pin / adresse : geo-alt(-fill)
CTA « voir nos services » : list-ul, list-task
Cas d’usage ventousage

Fiction nocturne : moon-stars(-fill) ou film
Fashion Week : bag-fill ou people-fill
Déménagement sensible : truck, truck-front
