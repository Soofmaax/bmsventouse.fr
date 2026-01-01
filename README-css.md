# Convention CSS – BMS Ventouse (résumé)

1. `base.css` → variables (`:root`), reset, accessibilité, styles globaux (`body`, `a`, images…).
2. `layout.css` → structure : `.container`, `.section*`, header/nav/footer, grilles de layout.
3. `components.css` → composants réutilisables : boutons, cartes, FAQ, animations globales, dark mode.
4. `sections.css` → blocs de page : hero, CTA, carrousels, bannières, stats, zones, back-to-top, cookie banner, etc.
5. `pages.css` → ajustements propres à une page (via classes sur `<body>` ou ID de section).
6. `faq.css` → styles dédiés au module FAQ (`.faq-item`, `.faq-question`, `.faq-answer`, animations). Aujourd’hui, le bloc FAQ actif vit encore en fin de `style.css` ; `faq.css` sert de fichier dédié pour isoler ce module à terme.
7. `style.css` → fichier **point d’entrée** qui importe les feuilles ci‑dessus et garde quelques règles historiques en cours de migration. Ne pas y ajouter de nouveaux styles applicatifs : les nouveaux morceaux vont dans `base.css`, `layout.css`, `components.css`, `sections.css`, `pages.css` ou `faq.css`.
8. Règle : avant d’ajouter du CSS, se demander **“global, composant ou section/page ?”** et choisir le fichier correspondant.
9. Éviter les sélecteurs trop profonds : privilégier des classes explicites (`.service-card__title`) plutôt que `.section .box h3`.
10. Ne pas dupliquer une règle : si un style existe déjà dans `components.css` ou `sections.css`, l’étendre ou le factoriser.
11. Pour tout nouveau composant réutilisable, créer/mettre à jour son bloc dans `components.css` (ou `faq.css` pour la FAQ) et mentionner son usage dans ce README si besoin.