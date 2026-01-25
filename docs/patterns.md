# BMS Ventouse – Patterns de pages & composants

Ce document sert à ton “toi du futur” : comment copier / adapter une page ou une section sans se perdre dans le HTML.

---

## 1. Layout global (toutes les pages)

### `<head>`

- Meta essentielles :
  - `charset`, `viewport`, `color-scheme`
  - `<title>` et `<meta name="description">` uniques et orientés requêtes.
  - `<link rel="canonical">` cohérent avec l’URL finale.

- Open Graph (SEO social) :
  - `og:title`, `og:description`, `og:url`, `og:type="website"`,
  - `og:image`, `og:locale="fr_FR"`, `og:site_name="BMS Ventouse"`.

- Twitter Cards :
  - `twitter:card="summary_large_image"`,
  - `twitter:title`, `twitter:description`,
  - `twitter:image`, `twitter:image:alt`.

### `<body>`

- Header et navigation sont construits via JS (`setupUnifiedHeader()`), donc :
  - laisser un `<header class="header">` minimal, mais **ne pas dupliquer la logique de menu**.
- Footer est injecté par `setupUnifiedFooter()`, sauf pour `urban-regie/` qui a un footer spécifique.

---

## 2. Classes utilitaires importantes

### 2.1 `.text-muted`

Utilisée pour les *petites notes secondaires* (options, mentions, astérisques).

```html
<p class="text-muted">
  Options: gestion complète AOT, sécurisation renforcée, périmètres étendus.
</p>
```

CSS (dans `css/components.css`) :

```css
.text-muted {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}
```

**À retenir** :  
Ne pas remettre de `style="font-size:…; margin-top:…"` inline pour ces cas. La classe couvre 99 % des besoins.

---

### 2.2 `.content-narrow`

Pour les *paragraphes de contenu central* (explications SEO, texte un peu long), centrés avec une largeur max.

```html
<p class="animated-item content-narrow">
  BMS Ventouse est d’abord un <strong>spécialiste du ventousage</strong> pour tournages et événements…
</p>
```

CSS :

```css
.content-narrow {
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.7;
}
```

Variantes :

- Marge en bas différente :

  ```html
  <p class="animated-item content-narrow" style="margin-bottom:1rem;">
    …
  </p>
  ```

- Marge en haut :

  ```html
  <p class="animated-item content-narrow" style="margin-top:1rem;">
    …
  </p>
  ```

- Liste étroite, centrée :

  ```html
  <ul class="benefits-list animated-item content-narrow">
    …
  </ul>
  ```

**Règle** :  
Dès que tu vois `max-width:900px; margin:0 auto; line-height:1.7;` → utiliser `.content-narrow` et garder seulement les marges verticales spécifiques en inline si nécessaire.

---

## 3. Patterns de sections

### 3.1 Section Héros (hero)

```html
<section class="hero">
  <picture class="hero-bg">
    <!-- Hero unifié sur le site (fond rue de nuit), variantes responsive WebP + JPEG -->
    <source type="image/webp"
            srcset="/images/hero-background-custom-640.webp 640w,
                    /images/hero-background-custom-960.webp 960w,
                    /images/hero-background-custom-1280.webp 1280w,
                    /images/hero-background-custom-1920.webp 1920w"
            sizes="100vw">
    <source type="image/jpeg"
            srcset="/images/hero-background-custom-640.jpg 640w,
                    /images/hero-background-custom-960.jpg 960w,
                    /images/hero-background-custom-1280.jpg 1280w,
                    /images/hero-background-custom-1920.jpg 1920w"
            sizes="100vw">
    <img src="/images/hero-background-custom.jpg"
         alt="Rue parisienne neutralisée la nuit pour un tournage, avec plots et éclairage urbain"
         loading="eager"
         fetchpriority="high"
         width="1920"
         height="1080"
         sizes="100vw"
         decoding="async">
  </picture>

  <div class="hero-overlay">
    <div class="container animated-item">
      <span class="hero-tag">Ventousage &amp; stationnement</span>
      <h1>Ventousage à Paris …</h1>
      <p>Phrase d’accroche, avec les 3–4 bénéfices clés.</p>
      <div class="hero-buttons">
        <a href="/contact/" class="btn btn-primary">Demander un devis</a>
        <a href="https://wa.me/…" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
          WhatsApp Direct
        </a>
      </div>
    </div>
  </div>
</section>
```

- Tout ce qui est positionnement / fond est géré par `css/sections.css` (`.hero`, `.hero-bg`, `.hero-overlay`).
- Le **fond Héros** est maintenant **unifié** sur les pages principales (Accueil, Services, Réalisations, Contact, pages légales) avec `hero-background-custom-*`.
- La hauteur du hero est responsive : `min-height: clamp(420px, 70vh, 650px)` ; sur mobile, le contenu est aligné sous le header sticky et `overflow: visible` pour éviter de couper les boutons.
- Le texte du hero (`<p>`) est limité en largeur sur desktop (`max-width: 38rem` à partir de 768px) pour garder des lignes lisibles.
- Ne pas rajouter de `style` inline ici sauf cas très particulier.

---

### 3.2 Section “Vos avantages” / “Pourquoi nous choisir”

Pattern classique : titre + `section-subtitle` + `services-grid` de cartes.

```html
<section class="section">
  <div class="container">
    <h2 class="section-title animated-item">Pourquoi nous choisir … ?</h2>
    <p class="section-subtitle animated-item">
      Phrase d’intro, une ou deux lignes.
    </p>
    <div class="services-grid">
      <article class="service-card animated-item">
        <h3>Avantage 1</h3>
        <p>Texte explicatif.</p>
      </article>
      <article class="service-card animated-item">
        <h3>Avantage 2</h3>
        <p>Texte explicatif.</p>
      </article>
      <!-- etc. -->
    </div>
  </div>
</section>
```

Pour ajouter des liens internes, tu peux utiliser `.text-muted` ou des listes `benefits-list` dans les cartes.

---

### 3.3 Section “Processus” (étapes numérotées)

Pattern : `process-grid` + `.process-step` + `.process-step-number`.

```html
<section class="section">
  <div class="container">
    <h2 class="section-title animated-item">Processus d’intervention</h2>
    <div class="process-grid animated-item">
      <div class="service-card process-step">
        <div class="process-step-number">01</div>
        <h3>Étape 1</h3>
        <p>Brève description.</p>
      </div>
      <div class="service-card process-step">
        <div class="process-step-number">02</div>
        <h3>Étape 2</h3>
        <p>Brève description.</p>
      </div>
      <!-- etc. -->
    </div>
  </div>
</section>
```

Les couleurs et le style des pastilles sont gérés dans `css/sections.css`.  
Ne pas changer à la main dans le HTML.

---

### 3.4 Section FAQ

Pattern standard pour les questions fréquentes :

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

- La structure attendue par le JS est toujours : `.faq-item` → `.faq-question` + `.faq-answer`.
- Le module `setupFaqAccordion()` (dans `js/script.js`) :
  - ajoute les attributs ARIA (`aria-expanded`, `aria-controls`, `role="button"`, `role="region"`) ;
  - gère l’ouverture/fermeture avec animation de hauteur (`max-height`) ;
  - garantit que le texte n’est pas coupé même si la mise en page change (largeur d’écran, police, etc.).
- Les styles de la FAQ sont centralisés dans le CSS (bloc dédié en fin de `css/style.css` et fichier `css/faq.css` prévu pour isoler ce module) : la refonte combine une animation `max-height` côté CSS et une gestion fine de la hauteur côté JS pour éviter tout texte tronqué.
- **Important :**
  - ne pas ajouter de styles inline sur `.faq-answer` (pas de `max-height` manuel) ;
  - ne pas mettre d’autres boutons/cliques actifs dans `.faq-question` (c’est déjà l’élément interactif principal).

---

### 3.5 Blocs d’options / notes sous cartes (“Options : …”)

Pattern standard :

```html
<p class="text-muted">
  Options: zones premium, protocoles célébrités, confidentialité renforcée.
</p>
```

- Ne pas réintroduire de `style` sur ces paragraphes.
- Si besoin de plus de marge, on peut ponctuellement ajouter `style="margin-top:1rem;"`, mais préférer garder la valeur par défaut dans la majorité des cas.

---

## 4. Pages “type” à copier

### 4.1 Page service “pilier” (Ventousage, Sécurité, etc.)

Exemples : `ventousage/index.html`, `securite-plateaux/index.html`.

Structure type :

1. `<head>` avec SEO complet (OG + Twitter + JSON-LD).
2. `<body>` :
   - Header standard (laissé minimal, nav injectée par JS).
   - Hero avec H1 parlant.
   - 1–2 sections “Ce que comprend le service” (cards).
   - 1 section “Vos avantages” ou “Pourquoi nous choisir”.
   - 1 section “Processus”.
   - 1 section plus “SEO texte” avec des `<p class="animated-item content-narrow">`.
   - 1 section CTA finale.

### 4.2 Page “ville” (Ventousage Lyon, Sécurité Marseille…)

Exemples : `ventousage-lyon/`, `securite-tournage-marseille/`.

Différences :

- H1 mentionne la ville & le département.
- Meta description + OG ciblent la ville.
- Le texte dans `content-narrow` est adapté (noms de quartiers, zones d’intervention locales).
- Le reste du pattern (sections, process, CTA) est identique.

---

## 5. Ce qu’il ne faut plus faire

Pour rester propre et cohérent :

- **Éviter** de remettre des styles inline déjà couverts par des classes, en particulier :
  - `max-width:900px; margin:0 auto; line-height:1.7;` → utiliser `.content-narrow`.
  - `font-size:0.95rem; margin-top:.5rem;` → utiliser `.text-muted`.

- **Ne pas dupliquer** la structure du header / footer :
  - Le JS (`setupUnifiedHeader`, `setupUnifiedFooter`) reconstruit la nav et le footer sur toutes les pages.

- **Ne pas ajouter** de nouveaux boutons ou styles CTA en dehors des patterns `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-secondary-alt`.

---

## 6. Résumé “sur une Post‑it”

- Paragraphes explicatifs centraux :  
  → `class="animated-item content-narrow"`  
  (+ marges haut/bas en inline si besoin).

- Petites notes / options :  
  → `class="text-muted"`.

- Sections :
  - Hero : `.hero` + `.hero-overlay` + `.hero-tag` + `.hero-buttons`.
  - Avantages : `.section` + `.section-title` + `.section-subtitle` + `.services-grid` + `.service-card`.
  - Processus : `.process-grid` + `.process-step` + `.process-step-number`.

En respectant ces patterns, la personne qui reprend le site dans 6–12 mois peut :

- copier/coller une section existante,
- adapter uniquement le texte / les liens / les icônes,
- sans réinventer styles ou structure à chaque fois.