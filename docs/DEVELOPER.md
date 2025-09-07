# Ajouter un service (BMS Ventouse – Guide Développeur)

Pour ajouter une nouvelle page service :

1. Créez un fichier Markdown :  
   - Chemin : `src/services/mon-service.md`
2. Remplissez le front matter (exemple ):
```markdown
---
slug: mon-service
metaTitle: "Titre SEO de la page"
metaDescription: "Description SEO (150-160 caractères)..."
h1: "Titre H1 de la page"
summary: "Résumé court et percutant (pour hero)"
hero:
  desktop: "/images/mon-service.jpg"
  mobile: "/images/mon-service-mobile.jpg"
  alt: "Texte alternatif SEO pour l’image"
sections:
  - title: "Introduction"
    html: "<p>Texte d’intro HTML…</p>"
  - title: "Problèmes fréquents"
    html: "<ul><li>…</li></ul>"
features:
  - "Atout 1"
  - "Atout 2"
faq:
  - q: "Question 1"
    a: "Réponse 1"
---
```
3. (Optionnel) Ajoutez du contenu Markdown sous le front matter si besoin.
4. Les images doivent être placées dans `/images/` et compressées.
5. Lancez le build :

```sh
npm run build
```

C’est tout ! La page sera générée automatiquement, avec SEO, structure cards, bandeau CTA, etc.

**Astuces :**
- Pour traduire une page, ajoutez un fichier du même nom avec le suffixe de langue (`mon-service.en.md`) et remplissez le front matter dans la langue cible.
- Pour modifier les titres de section ou CTA, éditez les fichiers `src/_data/locales/fr.json` ou `en.json`.

Pour toute question, voir README.md ou contactez l’équipe tech.