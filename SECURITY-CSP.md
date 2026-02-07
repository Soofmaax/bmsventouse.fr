# Sécurité CSP / Trusted Types pour bmsventouse.fr

## 1. But

Ce dépôt contient un fichier `_headers` (format Netlify-compatible) qui définit une configuration **Content-Security-Policy (CSP)** et **Trusted Types** recommandée pour la production.

Cette configuration :
- n’est **pas encore activement utilisée** par l’infrastructure actuelle (CSP déjà envoyée ailleurs, avec `'unsafe-inline'`),
- sert de **référence** pour une future configuration serveur (Netlify, Nginx, Apache, CDN…)
- est conçue pour **améliorer la sécurité réelle** et le score "Bonnes pratiques" (Lighthouse, SecurityHeaders, etc.).

## 2. Ce que fait la CSP dans `_headers`

Bloc global (toutes les routes) :

```text
/*
  Content-Security-Policy: script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self';
  Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; trusted-types default;
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
```

### 2.1. Directives CSP principales

- `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms;`
  - N’autorise que :
    - le JavaScript servi depuis le même domaine (`'self'`),
    - Google Tag Manager (`www.googletagmanager.com`),
    - Google Analytics (`www.google-analytics.com`),
    - Microsoft Clarity (`www.clarity.ms`).
  - Conserve `'unsafe-inline'` temporairement pour ne pas casser les scripts inline existants (configuration GA4, JSON-LD, bannière cookies, etc.) tant qu’ils n’ont pas encore été externalisés ou protégés par nonce/hash.
  - Étape suivante : migrer ces scripts inline (externalisation dans des fichiers `.js`, ajout de nonces ou de hashes `sha256-...`) afin de pouvoir retirer `'unsafe-inline'` et durcir la politique CSP tout en améliorant le score de sécurité.

- `connect-src 'self' https://www.google-analytics.com https://www.clarity.ms;`
  - Limite les requêtes XHR/fetch/WebSocket :
    - au domaine local (`'self'`),
    - à Google Analytics et Clarity pour l’envoi de télémétrie.

- `img-src 'self' data: https://www.google-analytics.com;`
  - Autorise les images :
    - depuis le site lui-même (`'self'`),
    - en `data:` (favicons, pixels inline, etc.),
    - depuis Google Analytics (pixel de tracking).

- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
  - Permet les feuilles de style :
    - locales (`'self'`),
    - inline (`'unsafe-inline'`) pour ne pas casser l’existant,
    - Google Fonts CSS (`fonts.googleapis.com`).
  - Ce point pourra être **durci plus tard** (remplacement des styles inline par des classes, ajout de `nonce` ou de `sha256-...`).

- `font-src 'self' https://fonts.gstatic.com;`
  - Autorise les fontes :
    - locales,
    - Google Fonts (`fonts.gstatic.com`).

- `frame-ancestors 'self';`
  - Empêche l’inclusion du site dans un `<iframe>` tiers (clickjacking),
  - Autorise uniquement l’auto-embedding par le site lui-même.

- `base-uri 'self';`
  - Interdit de changer la base des URLs du document depuis un autre domaine.

- `form-action 'self';`
  - Les formulaires ne peuvent être soumis que vers le même domaine.

### 2.2. En-têtes de sécurité complémentaires

Toujours dans `_headers` :

- `Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; trusted-types default;`
  - Active **Trusted Types en mode report-only** :
    - `require-trusted-types-for 'script'` : signale les usages dangereux de certains sinks DOM (`innerHTML`, `document.write`, etc.) sans les bloquer.
    - `trusted-types default` : déclare une policy par défaut ; en mode report-only cela n’empêche rien mais prépare l’activation.
  - Objectif : détecter les scripts/libs non compatibles **sans casser le site**.

- `Referrer-Policy: strict-origin-when-cross-origin`
  - Limite les infos de referrer envoyées aux domaines tiers.

- `X-Content-Type-Options: nosniff`
  - Demande aux navigateurs de ne pas deviner les types MIME (protection contre certains vecteurs XSS).

- `X-Frame-Options: SAMEORIGIN`
  - Défense supplémentaire contre le clickjacking, équivalente à `frame-ancestors 'self'` pour la plupart des navigateurs.

### 2.3. Cas spécifique du Service Worker

Le fichier `_headers` contient également :

```text
/sw.js
  X-Content-Type-Options: nosniff
```

- Renforce la sécurité du service worker en interdisant le MIME sniffing.

## 3. À adapter / activer côté serveur

Actuellement, cette configuration est **proposée** mais pas forcément appliquée par l’infrastructure en production (un autre composant peut déjà envoyer une CSP différente, avec `'unsafe-inline'`).

Pour l’activer réellement :

### 3.1. Cas Netlify (ou équivalent cdn qui lit `_headers`)

1. Vérifier que le déploiement lit `_headers` (cas Netlify classique) :
   - le fichier `_headers` doit être à la racine du build publié.
2. Redéployer le site.
3. Vérifier dans l’onglet "Network" du navigateur (ou via `curl -I`) que les en-têtes suivants sont présents :
   - `Content-Security-Policy` avec les directives ci-dessus,
   - `Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; trusted-types default;`,
   - `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`.

### 3.2. Cas Nginx / Apache / CDN

Si l’hébergeur ne supporte pas `_headers` nativement, il faut **transposer manuellement** ces en-têtes dans la configuration serveur.

#### Exemple Nginx (pseudo-config)

```nginx
add_header Content-Security-Policy "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self';" always;

add_header Content-Security-Policy-Report-Only "require-trusted-types-for 'script'; trusted-types default;" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;

location = /sw.js {
    add_header X-Content-Type-Options "nosniff" always;
}
```

#### Exemple Apache (pseudo-config)

```apacheconf
Header always set Content-Security-Policy "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self';"

Header always set Content-Security-Policy-Report-Only "require-trusted-types-for 'script'; trusted-types default;"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"

<Files "sw.js">
  Header always set X-Content-Type-Options "nosniff"
</Files>
```

## 4. Passage à une CSP plus stricte (sans `'unsafe-inline'`)

Pour l’instant, afin de ne **rien casser**, `style-src` garde `'unsafe-inline'` et la directive Trusted Types est en **mode Report-Only**.

Pour une CSP encore plus stricte :

1. **Scripts inline** (GA4, JSON-LD, petits snippets dans `index.html`) :
   - Option A : externaliser ces scripts dans des fichiers `.js` servis depuis `'self'`.
   - Option B : générer des **nonces** côté serveur et ajouter `nonce-...` sur chaque `<script>` inline, puis inclure `script-src 'self' 'nonce-...';`.
   - Option C : utiliser des **hashes** (`sha256-...`) dans `script-src` si la plateforme le permet et que les scripts changent rarement.

2. **Styles inline** :
   - Remonter les styles inline dans des fichiers CSS ou dans un bloc `<style>` référencé par hash/nonce.
   - Éventuellement retirer `'unsafe-inline'` de `style-src` une fois cette migration faite.

3. **Trusted Types en mode blocant** :
   - Une fois les erreurs observées et corrigées (via `Content-Security-Policy-Report-Only`),
   - remplacer `Content-Security-Policy-Report-Only` par la même directive dans l’en-tête **`Content-Security-Policy`** pour activer le blocage effectif.

Cette progression permet de **durcir la sécurité** sans interruption de service, tout en restant compatible avec GTM/GA4/Clarity et Google Fonts.

## 5. API obsolète `H1UserAgentFontSizeInSection`

Les audits récents remontent un avertissement lié à l’API obsolète `H1UserAgentFontSizeInSection`. L’analyse côté dépôt donne :

- **Aucune occurrence** de `H1UserAgentFontSizeInSection` dans le code source.
- **Aucune occurrence** de `userAgent` ou `userAgentData` (recherche plein texte sur tout le repo).

Conclusion : cette API n’est **pas utilisée par le code applicatif local** (HTML/JS de ce dépôt). L’ID de dépréciation est donc très probablement déclenché :

- soit par le navigateur lui-même (comportement interne de Chrome),
- soit par un **script tiers chargé via Google Tag Manager (GTM)** ou un autre système distant.

### 5.1. Plan d’action côté GTM (`GTM-KD4HDWX4`)

Pour adresser concrètement cet avertissement, les actions se font dans le conteneur GTM :

1. **Inspecter les balises HTML personnalisées** et les scripts tiers
   - Ouvrir le conteneur `GTM-KD4HDWX4`.
   - Lister les balises de type "HTML personnalisé" et les balises qui injectent des scripts externes.
   - Rechercher, dans ces balises, du code qui manipule des APIs DOM/CSS vieillissantes (accès à des propriétés de user agent, hacks CSS dépendants du navigateur, etc.).

2. **Identifier la ou les balises incriminées**
   - Utiliser la console du navigateur et l’aperçu GTM pour vérifier quelles balises s’exécutent sur les pages où l’avertissement apparaît.
   - Si possible, isoler le script exact qui déclenche `H1UserAgentFontSizeInSection` (par exemple en désactivant temporairement certaines balises dans un environnement de test).

3. **Mettre à jour ou retirer le script tiers**
   - Si la balise correspond à une librairie tierce (widget, outil marketing, etc.) :
     - vérifier s’il existe une **version récente** du script compatible avec les navigateurs actuels,
     - mettre à jour l’URL ou le code embarqué vers cette version.
   - Si le code est maison (HTML personnalisé GTM) :
     - remplacer les usages d’APIs obsolètes par des équivalents modernes,
     - ou réécrire la logique pour ne plus dépendre de hacks `userAgent`.
   - En dernier recours, **désactiver ou remplacer** la balise si elle n’est plus indispensable.

### 5.2. Impact côté dépôt / mitigation par CSP et Trusted Types

- Côté dépôt `bmsventouse.fr`, **aucun code local** ne fait appel à cette API ou à des lectures de `userAgent`/`userAgentData`.
- La surface d’attaque des scripts tiers est déjà **fortement réduite** par :
  - la CSP qui limite les origines de scripts (`script-src` restreint à `'self'`, GTM/GA4 et Clarity, avec Trusted Types en Report-Only),
  - l’en-tête `Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; trusted-types default;` qui facilite l’identification des usages DOM risqués.
- Il n’y a donc **pas de correctif à apporter dans ce repo** pour cette API obsolète ; le traitement se fait **exclusivement côté GTM** (mise à jour/désactivation de la ou des balises concernées).
