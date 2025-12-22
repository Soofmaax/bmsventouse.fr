# Convention CSS – BMS Ventouse (résumé)

1. `base.css` → variables (`:root`), reset, accessibilité, styles globaux (`body`, `a`, images…).
2. `layout.css` → structure : `.container`, `.section*`, header/nav/footer, grilles de layout.
3. `components.css` → composants réutilisables : boutons, cartes, FAQ, animations globales, dark mode.
4. `sections.css` → blocs de page : hero, CTA, carrousels, bannières, stats, zones, back-to-top, cookie banner, etc.
5. `pages.css` → ajustements propres à une page (via classes sur `<body>` ou ID de section).
6. `style.css` → uniquement point d’entrée avec `@import` vers les fichiers ci‑dessus (ne plus y ajouter de règles).
7. Règle : avant d’ajouter du CSS, se demander **“global, composant ou section/page ?”** et choisir le fichier correspondant.
8. Éviter les sélecteurs trop profonds : privilégier des classes explicites (`.service-card__title`) plutôt que `.section .box h3`.
9. Ne pas dupliquer une règle : si un style existe déjà dans `components.css` ou `sections.css`, l’étendre ou le factoriser.
10. Pour tout nouveau composant réutilisable, créer/mettre à jour son bloc dans `components.css` et mentionner son usage dans ce README si besoin.