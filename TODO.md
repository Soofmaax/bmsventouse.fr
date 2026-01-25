# TODO – refonte UI/UX BMS Ventouse
⚠️ Règle : tout item marqué GLOBAL ne doit PAS être retraité page par page.
Les pages servent uniquement à vérifier le résultat global.

> Note : on fera tout en **une seule PR**, mais découpée en commits itératifs  
> → **1 commit = 1 bloc cohérent** de ce fichier (GLOBAL, HOME, SERVICES, CONTACT, VENTOUSAGE, SÉCURITÉ).
Règle proposée : `active` basé sur `location.pathname.startsWith(href)`

---
Comparer les scores AVANT/APRÈS sur :
- home
- services
- une page ventousage
- une page sécurité

Convention commits :
- chore(global): ...
- fix(home): ...
- fix(services): ...
- fix(contact): ...
- fix(ventousage): ...
- fix(securite): ...

## GLOBAL

- [ ] (P0) GLOBAL — charger les polices Anton &amp; Poppins sur toutes les pages — vérifier dans DevTools (Computed › font-family) que le texte de base est en Poppins et les titres en Anton sur au moins 5 pages (home, services, ventousage, sécurité, contact).
- [ ] (P0) GLOBAL — unifier le header et le footer sur la base du modèle home — vérifier que toutes les pages standard (hors pages spéciales comme `/contact-nfc/`) ont le même logo, navigation, boutons (hand-toggle/theme-toggle selon la décision), bannière promo et colonnes de footer.
- [ ] (P1) GLOBAL — définir une règle claire pour l’`active state` de la navigation principale et l’appliquer partout — vérifier sur `/`, `/services/`, `/contact/` et une landing ventousage/sécurité que la classe `active` correspond bien à la page courante selon la règle choisie.
- [x] (P1) GLOBAL — introduire/utiliser des utilitaires de spacing (margin/padding) pour remplacer les `style="margin-..."` inline — vérifier via une recherche globale qu’il ne reste plus de styles inline de marge/padding dans les fichiers HTML.
- [ ] (P1) GLOBAL — décider du sort de `hand-toggle` (conserver et l’injecter partout / supprimer complètement la feature) — vérifier qu’aucun code JS/CSS mort ne subsiste après décision.
- [ ] (P2) GLOBAL — choisir un modèle de footer canonique (avec ou sans colonne “Territoires”) et l’appliquer à toutes les pages — vérifier visuellement sur un échantillon de pages ventousage/sécurité/contact que les colonnes et liens de footer sont identiques (hors cas spéciaux explicitement exclus).

---

## HOME

- [ ] (P0) /index.html — corriger le JSON-LD `areaServed` invalide (bloc `{ ,` dans la liste des villes) — valider `index.html` avec l’outil de test de résultats enrichis Google (aucune erreur sur la section `LocalBusiness/ProfessionalService`).

---

## SERVICES

- [ ] (P1) /services/index.html — supprimer la double inclusion de `/js/script.js` en pied de page — vérifier dans l’onglet Network que `script.js` n’est chargé qu’une seule fois et que le menu mobile fonctionne toujours.
- [ ] (P2) /services/index.html — corriger le texte prérempli du lien WhatsApp flottant (paramètre `?text=…`) pour utiliser une phrase complète du type « Bonjour, je souhaite parler de mon projet. » — cliquer sur le bouton depuis un mobile ou simulateur et vérifier que le message WhatsApp affiché est correct et lisible.

---

## CONTACT  
(/contact, /contact-direct, /contact-nfc)

### /contact/

- [ ] (P1) /contact/index.html — aligner le texte de la bannière promo (`promo-banner`) sur le wording global choisi (« Réponse rapide sous 24h » ou « Devis gratuit sous 24h ») — vérifier que la bannière affiche le même message sur home, services, contact et au moins une landing ventousage/sécurité.

### /contact-direct/

- [ ] (P1) /contact-direct/index.html — s’assurer que la classe `.hidden` utilisée pour le champ honeypot Netlify masque visuellement le champ sans gêner l’accessibilité (visually-hidden) — vérifier dans le navigateur que le champ n’est pas visible ni focusable au clavier, tout en restant présent pour les bots.
- [ ] (P1) /contact-direct/index.html — tester le flux formulaire Netlify (`data-netlify="true"`, `action="/contact-direct/?success=1"`) — soumettre un formulaire de test et vérifier la redirection `?success=1` ainsi que l’apparition de la note de succès à l’endroit prévu.
- [ ] (P2) /contact-direct/index.html — documenter (dans `plan_action.md` ou `verif.md`) le choix d’utiliser un header/footer injectés en JS plutôt qu’un header/footer statiques — vérifier que la doc mentionne clairement ce comportement particulier et les hooks JS (`setupUnifiedHeaderNav`, `setupUnifiedFooter`).

### /contact-nfc/

- [ ] (P0) /contact-nfc/index.html — remplacer le placeholder `GTM-XXXXXXX` dans la meta `gtm-id` par l’ID réel du conteneur ou supprimer proprement cette meta si GTM n’est plus utilisé sur cette page — vérifier dans l’interface GTM (si utilisé) que les hits sont bien reçus ou, à défaut, que la page ne tente pas de charger de conteneur inexistant.
- [ ] (P2) /contact-nfc/index.html — confirmer dans la doc interne que cette page est volontairement sans header/footer global (pattern “landing carte de visite”) — vérifier que `meta name="robots" content="noindex,nofollow"` est bien conservé pour empêcher l’indexation.

---

## VENTOUSAGE  
(générique + /ventousage-paris + autres villes)

### Ventousage générique &amp; Paris

- [x] (P1) /ventousage/index.html — vérifier et compléter la section « Livrables &amp; preuves » pour s’assurer que la liste et le texte sont correctement structurés (aucune phrase tronquée, listes complètes) — valider le fichier avec `htmlhint` et faire une revue visuelle de cette section.
- [x] (P1) /ventousage-paris/index.html — harmoniser le hero (titres, sous-titres, boutons) avec le modèle de hero global (structure, classes, tailles de texte), tout en conservant le contenu spécifique à Paris — vérifier sur desktop et mobile que le hero de Paris et celui de la home donnent une impression de “même famille”.

### Ventousage villes (Lyon, Marseille, Bordeaux, etc.)

- [x] (P1) VENTOUSAGE villes — harmoniser les sections hero/CTA des pages `ventousage-*/index.html` sur le modèle `/ventousage-paris/` (structure, composants, boutons) — vérifier visuellement sur au moins 4 villes (Lyon, Marseille, Bordeaux, Toulouse) que le squelette UI est identique et que seules les mentions locales changent.
- [x] (P2) VENTOUSAGE villes — harmoniser les footers des pages `ventousage-*/index.html` avec le modèle de footer choisi en section GLOBAL — vérifier que toutes les pages ventousage-* affichent les mêmes colonnes et liens de footer (hors éventuelles pages volontairement simplifiées et documentées).

### Ventousage Toulouse (HTML invalide)

- [x] (P0) /ventousage-toulouse/index.html — corriger le HTML invalide (balise `&lt;&lt;meta`, section dupliquée dont une version est mal échappée) — valider la page avec `htmlhint` ou le validateur W3C et vérifier que le DOM s’affiche sans erreurs dans le navigateur.

---

## SÉCURITÉ  
(plateaux, gardiennage, tournage Paris)

### Sécurité &amp; gardiennage `/securite-gardiennage/`

- [x] (P1) /securite-gardiennage/index.html — revoir le contenu du JSON-LD (FAQ) pour corriger les éventuelles répétitions ou formulations bancales (ex. SSIAP “1/2/ spécialisés, SSIAP 1/2/3”) — valider le JSON-LD avec l’outil de test de données structurées Google.

### Sécurité de plateaux `/securite-plateaux/`

- [x] (P1) /securite-plateaux/index.html — vérifier la cohérence des avantages, process et FAQ avec `/securite-gardiennage/` (pas de contradiction sur délais, disponibilité 24/7, SSIAP/maîtres-chiens) — revue éditoriale commune des deux pages.

### Sécurité tournage Paris `/securite-tournage-paris/`

- [x] (P1) /securite-tournage-paris/index.html — harmoniser la bannière promo (`promo-banner`) avec la décision globale (conserver « Devis gratuit sous 24h » comme variation ou l’aligner sur « Réponse rapide sous 24h ») — vérifier que le wording choisi est cohérent sur l’ensemble des pages sécurité.
- [x] (P2) /securite-tournage-paris/index.html — aligner le footer sur le modèle sécurité (plateaux/gardiennage) ou sur le footer global choisi (présence ou non de colonne Territoires) — vérifier que, à l’intérieur du “cluster sécurité”, les footers sont homogènes.

### Cluster sécurité (ensemble)

- [x] (P2) SÉCURITÉ (plateaux/gardiennage/tournage-paris) — vérifier que les trois pages utilisent les mêmes composants structurants (`section-security`, `stats-grid`, `faq-container`, cartes de services) avec une hiérarchie visuelle homogène — revue visuelle croisée des trois pages sur desktop et mobile.

---

## Validation suite

À lancer en fin de chantier (et idéalement après chaque bloc de commits) :

- [ ] (P0) Validation accessibilité — `npx pa11y-ci` — tous les scénarios définis dans `.pa11yci.json` doivent passer sans erreur bloquante.
- [ ] (P1) Validation HTML — `npx htmlhint "**/*.html"` — aucune erreur de syntaxe HTML sur les fichiers modifiés.
- [ ] (P1) Validation performance/SEO — `npx lhci autorun` (ou exécution Lighthouse équivalente en utilisant `lighthouserc.json`) — vérifier que les scores de performance, SEO et accessibilité restent au moins au niveau actuel ou s’améliorent sur les pages clés (home, services, contact, ventousage, sécurité).