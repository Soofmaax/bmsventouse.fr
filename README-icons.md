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