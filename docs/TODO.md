# TODO — Vers 100/100 et A+ (Roadmap)

Ce document liste les actions restantes pour:

- Maximiser les scores Lighthouse (Performance, Accessibilité, Bonnes pratiques, SEO).
- Viser une note A/A+ sur Mozilla Observatory.
- Simplifier la maintenance à long terme.

Chaque tâche est classée:

- 🔥 Critique — bloque ou impacte directement l’objectif 100/100.
- ⚠️ Important — améliore significativement la qualité mais n’est pas bloquant.
- 📝 Nice-to-have — optimisation de confort ou de maintenance.

---

## 1. Bonnes pratiques / CSP / Inline styles

### 1.1. JS: `element.style` résiduels dans HTML (🔥 Critique, ciblé)

Instances actuelles (hors `js/script.js`):

- `devis/index.html`:
  - `lead.style.display = isSuccess ? 'none' : '';`
  - `calc.style.display = isSuccess ? '' : 'none';`
  - `note.style.marginBottom = '1rem';`
  - `card.style.display = should ? '' : 'none';`
- `images/*.html` (fichiers de téléchargement social):
  - Fonctions `dl(url)` qui créent un `<a>` avec `a.style.display='none';`.
  - Certaines pages (ex: `story-1080x1920.html`, `couverture-google-business-1600x900.html`) font `a.style.display = 'none';` sur des liens.

Actions proposées:

- Pour `devis/index.html`:
  - Créer des classes CSS:
    - `.is-hidden { display: none !important; }`
    - `.has-bottom-margin { margin-bottom: 1rem; }`
  - Remplacer dans le script:
    - `lead.style.display = ...` → `lead.classList.add/remove('is-hidden')`.
    - `calc.style.display = ...` → idem.
    - `note.style.marginBottom = ...` → `note.classList.add('has-bottom-margin')`.
    - `card.style.display = ...` → toggle `is-hidden`.
- Pour les pages `images/*.html`:
  - Accepter ce pattern minimal (impact marginal sur CSP/score).
  - OU (optionnel) utiliser une classe `.visually-hidden-download` au lieu de `style.display`.

Impact:

- Aligne tout le code métier sur la CSP stricte (pas d’inline style via JS).
- Réduit les warnings “Bonnes pratiques / CSP” potentiels.

Priorité:

- 🔥 Devis (`devis/index.html`) car c’est une page métier.
- 📝 Pages `images/*.html` (usage interne, impact SEO/perf très faible).

---

## 2. Inline style attributes dans HTML

Recherche `style="` (résumé):

- De nombreuses occurrences pour:
  - Mise en forme de texte:
    - Paragraphes avec `max-width:900px; margin:0 auto 1rem; line-height:1.7;`.
    - Petits textes `font-size:0.9rem; color:#666;`.
  - Marges:
    - Grilles/services: `style="margin-top:1rem;"`, `style="margin-top:2rem;"`.
  - SVG/icônes:
    - `style="margin-right:8px"`, `style="margin-bottom:6px"`.
  - Noscript GTM:
    - `<iframe ... style="display:none;visibility:hidden">`.

Tâches:

- Créer des classes CSS réutilisables (⚠️ Important):
  - `.text-block` — pour `max-width:900px; margin:0 auto 1rem; line-height:1.7;`.
  - `.text-small-muted` — pour `font-size:0.9rem; color:#666;`.
  - `.section-margin-top-sm` / `.section-margin-top-md` — pour les `margin-top:1rem` / `2rem`.
  - `.icon-inline` — pour `margin-right:8px`.
  - `.icon-block` — pour `margin-bottom:6px`.
  - `.noscript-hidden` — pour `display:none; visibility:hidden;` (à utiliser sur l’iframe GTM).
- Remplacer dans les pages:
  - `ventousage-paris/index.html`, `ventousage/index.html`, `ventousage-*/*.html`.
  - `securite-plateaux/index.html`, `securite-tournage-*.html`.
  - `signalisation-barrierage/index.html`, `gardiennage/index.html`, etc.
- Conserver le style visuel identique mais via classes.

Impact:

- Élimine les styles inline HTML restants.
- Simplifie la maintenance (une classe = un style).
- Complète la logique CSP stricte (même si CSP tolère encore les `style=""`, c’est plus propre).

Priorité:

- ⚠️ Important sur les pages métiers (ventousage, sécurité, signalisation).
- 📝 Nice-to-have sur les détails décoratifs (marges mineures, icônes).

---

## 3. Accessibilité — Hiérarchie des titres

### 3.1. Footers avec `<h4>` (⚠️ Important)

Recherche `<h4>`:

- Encore présents dans les footers de nombreuses pages:
  - `ventousage/index.html`, `ventousage-nice/index.html`, `ventousage-bordeaux/index.html`, `ventousage-marseille/index.html`, `ventousage-pantin/index.html`, `ventousage-cinema/index.html`, etc.
  - `securite-plateaux/index.html`, `securite-tournage-*.html`.
  - `signalisation-barrierage/index.html`, `gardiennage/index.html`, `loges-confort/index.html`.
  - `logistique-seine-et-marne/index.html`, `logistique-seine-saint-denis/index.html`, etc.
  - `infos-ia/index.html`, autres pages informatives.

Actions:

- Créer une classe CSS:
  - `.footer-title` — typographie et style identiques aux anciens `<h4>`.
- Sur toutes les pages:
  - Remplacer:
    - `<h4>Navigation</h4>` → `<p class="footer-title">Navigation</p>`.
    - `<h4>Contact Direct</h4>` → `<p class="footer-title">Contact Direct</p>`.
    - `<h4>Légal</h4>` → `<p class="footer-title">Légal</p>`.
    - `<h4>Territoires</h4>` → `<p class="footer-title">Territoires</p>`.
- Vérifier que cette classe existe bien dans `css/style.css` (et qu’aucun style ne dépend encore de `h4` direct).

Impact:

- Élimine le risque de “sauts de niveau de titre” signalés par WAVE/Lighthouse.
- Meilleure sémantique: le footer n’introduit plus de sous-niveaux de titres artificiels.

Priorité:

- ⚠️ Important (améliore Accessibilité + Bonnes pratiques).

---

## 4. Accessibilité — Tap targets et ergonomie mobile

Observations:

- La plupart des boutons (CTA, WhatsApp, nav principale) ont des zones tactiles suffisantes.
- Quelques liens textuels peuvent être jugés petits en mobile:
  - Liens de footer (Navigation, Territoires, Légal).
  - Liens “Voir aussi” / “En savoir plus” dans certains paragraphes.

Actions:

- CSS:
  - Augmenter légèrement le `line-height` et/ou le `padding-inline` des liens dans:
    - `.footer-column a`.
    - Sections où les liens sont nombreux et rapprochés (listes de maillage).
- HTML (si besoin, après test Lighthouse):
  - Combiner certains liens textuels dans un même paragraphe pour agrandir la cible.
  - Vérifier que les liens ne sont pas collés les uns aux autres (ajouter du `margin-right` ou `gap` via CSS).

Priorité:

- ⚠️ Important si Lighthouse signale encore des “tap targets” trop petits.
- 📝 Nice-to-have sinon (mais bonne UX mobile).

---

## 5. Performance — Images, CSS & JS

### 5.1. Images (⚠️ Important)

Actions:

- Recompresser les grosses images héro:
  - `hero-background-custom-*.jpg / .webp`.
  - `services-hero-background-*.webp`.
- Vérifier:
  - WebP/AVIF plus agressifs (tout en gardant une qualité acceptable).
  - Pas de méga‑images inutiles dans des sections non critiques.

Impact:

- Gain estimé: 20–40 Ko sur les ressources LCP.
- Peut faire passer Performance mobile de ~76 vers 85–90+.

### 5.2. CSS/JS inutilisé (📝 Nice-to-have)

Observations:

- `style.css` contient quelques classes peu ou plus utilisées (héritage d’anciennes versions).
- `script.js` contient certains modules qui ne sont pas utilisés sur toutes les pages (mais restent légers).

Actions:

- CSS:
  - Audit manuel des classes non utilisées (via DevTools Coverage ou outils externes).
  - Nettoyage en fin de fichier (sections clairement obsolètes).
- JS:
  - Optionnel: découper `script.js` en chunks conditionnels ou charger certains modules uniquement sur certaines pages (ex: carrousel seulement sur `/` ou `/realisations/`).
  - Mesurer le gain réel avant de complexifier.

Impact:

- Gagne quelques Ko, améliore légèrement le score “Réduisez le JS/CSS inutilisé”.
- Attention: privilégier la simplicité tant que les gains sont marginaux.

Priorité:

- 📝 Nice-to-have (tant que Performance est ≥ 90).

---

## 6. Bonnes pratiques — Headers et APIs obsolètes

Observation:

- `X-XSS-Protection` est généralement considéré comme obsolète par les navigateurs modernes (et certains audits).

Actions possibles:

- Supprimer `X-XSS-Protection` de `netlify.toml` si Lighthouse ou Observatory le marque comme “API obsolète”.
- Laisser la responsabilité de XSS à:
  - CSP.
  - CodeQL et bonnes pratiques JS.

Impact:

- Supprime un avertissement potentiel “API obsolète”.
- N’apporte pas de protection réelle supplémentaire, donc suppression sans impact sécurité.

Priorité:

- 📝 Nice-to-have (seulement si Lighthouse continue à le signaler).

---

## 7. Documentation & Communication

Actions:

- Tenir à jour:
  - `README.md` (résumé du projet et liens vers docs).
  - `docs/ARCHITECTURE.md` (structure technique).
  - `docs/OPTIMISATIONS.md` (liste des optimisations).
  - `docs/DEPLOYMENT.md` (process de déploiement).
  - `docs/SCORES.md` (scores et objectifs).
  - `docs/TODO.md` (ce fichier).
- Ajouter si besoin:
  - `docs/SEO_GUIDE.md` (guides de contenu/metadata).
  - `docs/ACCESSIBILITY.md` (règles internes d’accessibilité).
  - `docs/RELEASE_CHECKLIST.md` (checklist finale avant déploiement prod).

Priorité:

- ⚠️ Important (transmet la connaissance, évite les régressions).
- Certaines parties en 📝 Nice-to-have si le temps est limité.

---

## 8. Priorisation globale

1) 🔥 Critique:
   - Remplacer `element.style.*` dans `devis/index.html` par des classes CSS.
   - Vérifier que CSP stricte reste compatible avec toutes les interactions.

2) ⚠️ Important:
   - Remplacer tous les `<h4>` de footers par `<p class="footer-title">`.
   - Réduire les `style="..."` inline sur les pages métiers (ventousage, sécurité, signalisation).
   - Optimiser/comprimer davantage les images héro.
   - Documenter clairement les standards (ce dépôt est déjà très structuré, mais les nouvelles docs doivent rester à jour).

3) 📝 Nice-to-have:
   - Nettoyage profond du CSS/JS non utilisé.
   - Ajustement sur mesure des tap targets si Lighthouse les signale.
   - Suppression de `X-XSS-Protection` si la note “API obsolète” devient gênante.
   - Harmonisation complète des pages secondaires (pages très rarement consultées).

En appliquant ce plan, le site se rapproche d’un 100/100 sur tous les indicateurs majeurs (Lighthouse, WAVE, Observatory) tout en restant simple, statique et très maintenable.