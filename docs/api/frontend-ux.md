# Frontend UX – Dark Mode, Hand Preference, Galleries & FAQ

This document describes the main UX features implemented in the frontend so a developer can safely maintain or extend them.

---

## 1. Theme Mode (Light / Dark)

**Where:** `js/script.js` → `setupThemeMode()`  
**What it does:**

- Reads a stored preference from `localStorage` (`bms-theme-preference`) if present.
- Otherwise, detects the system preference via `prefers-color-scheme: dark`.
- Applies/removes `body.dark-theme` and updates `document.documentElement.style.colorScheme`.
- Updates all `.theme-toggle` buttons with `aria-pressed="true/false"`.

**HTML:**

A button with class `.theme-toggle` in the main nav:

```html
<button class="theme-toggle" type="button" aria-label="Activer ou désactiver le mode sombre">
  <!-- inline SVG icon -->
</button>
```

**Notes:**

- If no `.theme-toggle` is present on a page, the script simply does nothing for that part.
- Colors are driven by CSS variables; `body.dark-theme` switches palettes.

---

## 2. Hand Preference (Left / Right Hand Navigation)

**Where:** `js/script.js` → `setupHandPreference()`  
**What it does:**

- Reads/writes a preference in `localStorage` (`bms_hand_pref`: `"left"` or `"right"`).
- Toggles `body.left-handed` based on the preference.
- Updates the `.hand-toggle` button with `aria-pressed` and a descriptive `aria-label`.

**HTML:**

A button in the main nav (on pages where you want the feature):

```html
<button class="hand-toggle" type="button" aria-label="Basculer en mode gaucher ou droitier">
  <!-- inline SVG icon representing a hand -->
</button>
```

Only the home page currently exposes this toggle in the header; other pages inherit the class on `<body>` once set.

**CSS (excerpt):**

```css
.whatsapp-float {
  bottom: var(--whatsapp-margin);
  right: var(--whatsapp-margin);
  left: auto;
}

body.left-handed .whatsapp-float {
  left: var(--whatsapp-margin);
  right: auto;
}

.back-to-top {
  bottom: 2rem;
  right: 2rem;
  left: auto;
}

body.left-handed .back-to-top {
  left: 2rem;
  right: auto;
}
```

**Behavior:**

- Default: `"right"` (no extra class on `<body>`).
- When the user clicks the hand toggle:
  - `"right"` → `"left"`: adds `body.left-handed`.
  - `"left"` → `"right"`: removes `body.left-handed`.
- The choice persists between visits for the same browser.

---

## 3. Ventousage Gallery (Paris)

**Where:**

- HTML: `ventousage-paris/index.html` (section “Galerie ventousage”).
- JS: `js/script.js` → `setupVentousageParisGallery()`.

**Structure (simplified HTML):**

```html
<section class="section section-alt">
  <div class="container">
    <h2 class="section-title animated-item">Galerie ventousage</h2>
    <div class="gallery-carousel animated-item">
      <div class="carousel-track" id="ventousageGallery">
        <!-- Slides injected via JS -->
      </div>
      <button class="carousel-control prev" type="button" aria-label="Photo précédente">‹</button>
      <button class="carousel-control next" type="button" aria-label="Photo suivante">›</button>
    </div>
    <p class="gallery-counter animated-item">Photo 1 / 13</p>
    <p class="gallery-end-message animated-item" id="galleryEndMessage" hidden>
      Vous avez vu tous nos exemples de ventousage. On peut faire la même chose pour votre tournage.
      Dites-nous où et quand, et nous préparons un devis gratuit sous 24&nbsp;h.
    </p>
    <!-- CTA card and buttons follow -->
  </div>
</section>
```

**JS behavior (high level):**

- Computes slide width based on the first slide’s width + margin.
- Maintains an internal `currentIndex` and total number of slides.
- On click of “Prev/Next”:
  - Scrolls the `.carousel-track` horizontally to the correct position (no autoplay).
  - Updates the text in `.gallery-counter` (`Photo X / N`).
  - Enables/disables prev/next buttons at bounds.
- When the user reaches the last slide:
  - Shows `#galleryEndMessage` (removes `hidden`, adds `.is-visible`).
- When the user leaves the last slide:
  - Hides the message again.

**CSS (key parts):**

```css
.gallery-counter {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.gallery-end-message {
  max-width: 900px;
  margin: 1rem auto 0;
  font-size: 0.95rem;
  color: var(--color-text);
  text-align: center;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.gallery-end-message.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**How to add or change images:**

- Assets live under `/images/ventousage-galerie/`.
- The JS contains a small array of image descriptors (filenames, alt text) which is used to inject slides.
- To add a new photo:
  1. Drop the file into `/images/ventousage-galerie/`.
  2. Add an entry in the images array in `js/script.js` with the filename and a meaningful `alt` text.
  3. Optionally update the initial counter text in the HTML (`Photo 1 / N`) to match the new total.

**Accessibility:**

- Navigation is fully button-based; arrows have `aria-label`.
- No automatic scrolling or forced jump to the contact section; the gallery is passive and respects user control.
- The end-of-gallery message is plain text and appears only when the last slide is visible.

---

## 4. FAQ interactive

**Where:** `js/script.js` → `setupFaqAccordion()`  

**HTML pattern:**

```html
<section class="section">
  <div class="container">
    <h2 class="section-title animated-item">Questions fréquentes</h2>
    <div class="faq-container animated-item">
      <article class="faq-item">
        <h3 class="faq-question">Question fréquente… ?</h3>
        <div class="faq-answer">
          <p>Réponse détaillée, éventuellement sur plusieurs paragraphes.</p>
        </div>
      </article>
      <!-- autres .faq-item -->
    </div>
  </div>
</section>
```

**Behavior:**

- `.faq-item` elements are initialized on page load.
- For each item:
  - The question gets `role="button"`, `tabindex="0"`, `aria-expanded="true/false"` and a unique `id`.
  - The answer gets `role="region"`, `aria-labelledby="…"` and a unique `id`, with its height controlled via `max-height`.
- Only one item is open at a time (opening one closes the others).
- Open/close animation:
  - On open:
    - JS sets `answer.style.maxHeight = answer.scrollHeight + 'px'` to animate the height.
    - On `transitionend` (for `max-height`), if the item is still open, JS sets `maxHeight` to `'none'` so that the answer can grow naturally if the layout changes (no clipped text).
  - On close:
    - If the answer was at `max-height: none`, JS first fixes the numeric height (`scrollHeight`), then animates back to `0px` for a smooth collapse.

**Accessibility:**

- Questions behave like buttons:
  - Click or `Enter`/`Space` toggles open/close.
  - `aria-expanded` is kept in sync with the open state.
- Answers are labelled via `aria-labelledby` and expose `role="region"` for screen readers.

**When editing FAQ HTML:**

- Keep the pattern `.faq-item` → `.faq-question` + `.faq-answer`.
- Do **not** add inline `max-height` styles; let CSS + JS drive the animation.
- You can freely edit the text/markup inside `.faq-answer` (lists, links, emphasis, etc.).

---

## 5. Conventions générales pour les modules frontend

Pour garder le JS maintenable et compatible avec la CI :

- Tous les modules suivent le pattern `setupXxx()` :
  - Ils sont définis dans `js/script.js`.
  - Ils sont appelés **une seule fois** dans le bloc `DOMContentLoaded` (section “INITIALISATION DE TOUS LES MODULES”).
- Chaque module doit :
  - Tolérer l’absence d’éléments (`querySelector` qui retourne `null` → on `return` proprement).
  - Éviter de lancer des erreurs bloquantes (utiliser `try/catch` seulement là où c’est utile).
  - Ne pas modifier le DOM en profondeur si ce n’est pas nécessaire (préférer ajouter des classes ou des petits fragments ciblés).
- Les helpers spécifiques à un module (comme `getValue` / `getChecked` pour le formulaire Contact) restent **enfermés dans ce module** pour éviter de polluer l’espace global.
- L’ordre d’initialisation est important :
  - Navigation / header (`setupUnifiedHeader`, `setupHamburgerMenu`).
  - Expérience utilisateur globale (`setupThemeMode`, `setupCookieBanner`, `setupScrollAnimations`, etc.).
  - Fonctions avancées (GTM, Clarity, PWA, galerie ventousage, etc.) après que la page soit stable.

Avant d’ajouter un nouveau module :

1. Vérifier s’il n’existe pas déjà un module proche (FAQ, carrousel, galerie, etc.) qui peut être adapté.
2. Le coder sous la forme `const setupMonModule = () => { ... }` ou `function setupMonModule() { ... }`.
3. L’appeler dans le bloc `DOMContentLoaded` avec les autres `setupXxx()`.
4. Lancer la CI (ou au minimum ESLint/HTMLHint/Stylelint en local) pour s’assurer qu’il respecte les règles du projet.

---

## 6. Optimisation des images & normalisation WhatsApp (`enhanceImages()`)

**Where:** `js/script.js` → `enhanceImages()`  

**What it does:**

- For all `<img>` elements:
  - Adds `loading="lazy"` to non‑hero images (images outside `.hero-bg`).
  - Ensures `decoding="async"` is set.
- As a safeguard for legacy WhatsApp icons:
  - Detects old Font Awesome WhatsApp SVGs (`viewBox="0 0 448 512"` with the FA WhatsApp path), if any are still present.
  - Replaces them in‑place with a 16×16 Bootstrap‑style `bi-whatsapp` SVG using `fill="currentColor"`.

All WhatsApp icons in the templates have now been migrated to this Bootstrap‑style SVG, so this second part mostly acts as a safety net (par exemple pour d’éventuels fragments HTML très anciens). À terme, `enhanceImages()` est surtout destiné à l’optimisation de la perf des images.

---

## 7. Header, footer, héros & boutons unifiés

### `setupUnifiedHeader()`

- Construit une navigation cohérente sur l’ensemble des pages standards :
  - Logo + navigation principale (Accueil, Services, Réalisations, Contact, CTA “Demander un devis”),
  - Bouton hamburger mobile attendu par `setupHamburgerMenu()`,
  - Bouton de bascule de thème (`.theme-toggle`) dans la nav,
  - (optionnel) bouton de préférence gaucher/droitier (`.hand-toggle`).

Les pages qui ont besoin d’un header complètement spécifique peuvent s’écarter de ce pattern, mais dans ce cas il faut vérifier que les hooks JS (id/classes du menu) restent cohérents (ids `hamburger`, `navLinks`, `navOverlay`, bouton `.theme-toggle` / `.hand-toggle`).

### Héros / images de fond & typographie

- Le visuel héros principal du site est désormais **unifié** :
  - Fond rue de nuit : fichiers `hero-background-custom.jpg` + variantes responsive (`hero-background-custom-640/960/1280/1920` en JPEG et WebP),
  - Utilisé sur l’accueil ainsi que sur les pages Services, Réalisations, Contact et la plupart des pages légales.
- Les blocs `<picture class="hero-bg">` de ces pages suivent le pattern décrit dans `docs/patterns.md` (section 3.1), avec les deux sources WebP/JPEG et un `img` de fallback.
- Le bloc texte du héros (`.hero-overlay .container`) est géré exclusivement par CSS :
  - Hauteur du héros : `min-height: clamp(420px, 70vh, 650px)` pour rester lisible sur mobile comme sur desktop.
  - Texte du hero `<p>` limité en largeur sur desktop : `max-width: 38rem` dès `min-width: 768px` pour éviter les lignes trop longues.
  - Sur mobile (`max-width: 600px`), le contenu du hero est aligné sous le header sticky et `overflow: visible` pour éviter de couper les boutons.

La typographie globale repose sur `--font-size-base: clamp(1rem, 1.05vw, 1.05rem)` dans `base.css`, ce qui garantit un texte lisible sur mobile et légèrement plus grand sur grands écrans.

### `setupUnifiedFooter()`

- Reconstruit le footer dans une mise en page unique :
  - Bloc marque (logo, description courte, liens vers Instagram / X),
  - Liens de navigation (Accueil, Services, Réalisations, Contact, pages de services),
  - Bloc “Territoires” listant les principales pages locales de ventousage,
  - Bloc “Contact Direct” (téléphone, WhatsApp, email, adresse, disponibilité 24/7),
  - Bloc “Légal” : Mentions légales, Politique de confidentialité, Conditions générales de prestation, fichiers IA (`llms.txt`, `ai.txt`), page `/infos-ia/`, lien “Gérer les cookies”.

La page Urban Régie possède un footer spécifique ; le module détecte ce cas et ne remplace pas son contenu.

### Boutons & CTA (typographie / responsivité)

- Les boutons utilisent un pattern unifié dans `css/components.css` :

  ```css
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7em;
    font-weight: var(--font-weight-bold);
    font-size: 1.05rem;
    border-radius: var(--border-radius-pill);
    padding: 0.9rem 1.7rem;
    min-width: 210px;
  }

  .btn-primary {
    background-color: var(--color-primary-dark);
    color: #ffffff;
    border-color: var(--color-primary-dark);
  }

  .btn-secondary {
    background: transparent;
    border: 2px solid var(--color-primary-dark);
    color: var(--color-primary-dark);
  }

  .btn-secondary-alt {
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.12);
    color: #111827;
  }

  .btn-whatsapp {
    background-color: #25d366;
    color: #fff;
    border-color: #25d366;
  }

  @media (max-width: 480px) {
    .btn {
      min-width: 0;
      width: 100%;
      font-size: 0.98rem;
      padding: 0.8rem 1.2rem;
    }
  }
  ```

- Sur petits écrans (≤ 480px), tous les boutons `.btn` passent automatiquement en largeur 100 % avec une typographie légèrement réduite, ce qui évite les débordements tout en gardant des cibles tactiles confortables.
- Dans le Héros et les cartes, aucune largeur spécifique n’est codée en dur dans le HTML : le comportement responsive est entièrement porté par le CSS.
- Les CTA principaux du site utilisent systématiquement `.btn btn-primary` pour rester cohérents avec la charte (orange foncé + texte blanc) et assurer un bon contraste WCAG.

---

## 8. Formulaire de contact avancé (prêt mais non utilisé)

Le code inclut un module de **formulaire de contact multi‑services** pensé pour une future page hub (type `/contact-direct/`). Il n’est actuellement branché sur **aucune** page publique (aucun `<form name="contact">` dans le HTML), mais il est prêt à être réutilisé :

- `setupContactSuccessNotice()`  
  - Affiche un message de succès lorsqu’on arrive avec `?success=1` dans l’URL.
  - Insère une carte de confirmation en haut du conteneur du formulaire (ou du `<main>`).

- `setupContactServiceDetails()`  
  - Affiche/masque des blocs `.service-details` en fonction de la valeur du champ `#service`.
  - Permet de montrer des champs supplémentaires pour ventousage, sécurité, convoyage, etc.

- `setupContactLeadCapture()`  
  - Écoute la soumission du formulaire `form[name=\"contact\"]` (actuellement celui de la page hub `/contact-direct/`).
  - Construit un `payload` riche (identité, coordonnées, service, lieux, dates, budget, détail, flags par service).
  - Sauvegarde quelques champs clés dans `localStorage` pour un éventuel suivi de lead.
  - Envoie un événement GA4 direct puis pousse l’événement dans le `dataLayer` pour GTM :

    ```js
    if (typeof gtag === 'function') {
      gtag('event', 'contact_submitted', payload);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'contact_submitted', ...payload });
    ```

  - La soumission serveur est gérée par **Netlify Forms** (aucun appel API custom nécessaire).

Sur la page `/contact-direct/`, l’événement `contact_submitted` est donc déjà émis à chaque envoi du mini‑formulaire. Il suffit de :

1. conserver la structure de formulaire attendue par `setupContactLeadCapture()` (ids/`name` existants),
2. laisser Netlify Forms gérer l’envoi (via `data-netlify=\"true\"` et `form-name=\"contact\"`),
3. déclarer `contact_submitted` comme **conversion** côté GA4/GTM.