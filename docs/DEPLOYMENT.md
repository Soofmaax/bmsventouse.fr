# DEPLOYMENT — BMS Ventouse

Ce document synthétise le processus de déploiement (local, staging, production) et complète les guides détaillés dans `docs/deployment/`.

- Détails locaux: `docs/deployment/local.md`
- Staging: `docs/deployment/staging.md`
- Production: `docs/deployment/production.md`

## 1. Vue d’ensemble

- Type de projet: site statique (HTML/CSS/JS).
- Build: aucune étape complexe; Netlify exécute `npm run build` mais le site peut être servi directement depuis la racine.
- Hébergement: Netlify (deploys automatiques depuis GitHub).

Pipeline recommandé:

1. Développement local.
2. Validation manuelle + Pa11y / Lighthouse.
3. Commit/push → CI GitHub Actions (quality gate).
4. Deploy Preview Netlify (pour PR).
5. Merge sur `main` → déploiement production Netlify.
6. Vérifications post-déploiement (Lighthouse, WAVE, Observatory).

---

## 2. Local

Référence: `docs/deployment/local.md`.

Résumé:

1) Cloner le dépôt puis lancer un serveur statique depuis la racine:

```bash
# Node
npx http-server -p 8080

# ou Python
python3 -m http.server 8080
```

2) Ouvrir `http://localhost:8080`.

3) (Optionnel) Lancer Pa11y CI pour un check accessibilité:

```bash
npx http-server -p 8080 -c-1 . &
npx wait-on http://localhost:8080
npx pa11y-ci
```

---

## 3. Staging / Deploy Previews

Référence: `docs/deployment/staging.md`.

Pratiques recommandées:

- Activer les Deploy Previews Netlify pour chaque PR.
- Bloquer l’indexation:
  - via `robots` spécifiques pour les contextes preview.
  - ou via headers `X-Robots-Tag: noindex`.
- Protéger éventuellement par mot de passe (Basic Auth Netlify).
- Désactiver ou isoler les analytics (GA4) pour éviter de polluer la prod:
  - Utiliser une propriété GA4 dédiée aux préproductions.
  - Ou désactiver GA4 via configuration spécifique au contexte preview.

---

## 4. Production

Référence: `docs/deployment/production.md`.

Checklist avant livraison:

- [ ] CI verte sur la branche `main`:
  - Super‑Linter OK (HTML/CSS/JS/MD/Actions).
  - Pa11y CI OK (pas de régressions majeures).
  - CodeQL, Gitleaks, npm audit sans problème critique.
- [ ] `sitemap.xml` à jour:
  - Toutes les nouvelles pages ajoutées.
  - `lastmod` mis à jour pour les pages importantes.
- [ ] `robots.txt`:
  - Pointe vers `sitemap.xml`.
  - Pas de `Disallow` involontaire.
- [ ] `netlify.toml`:
  - Headers de sécurité (HSTS, CSP, COOP/COEP/CORP, Permissions-Policy).
  - Cache agressif pour CSS/JS/images.
- [ ] Analytics:
  - ID GA4 correct.
  - Consent Mode v2 fonctionnel (bannière cookies visible en local).
- [ ] Comportement fonctionnel:
  - Menu mobile/hamburger.
  - FAQ.
  - Forms (Contact, Devis).

---

## 5. Process de déploiement Netlify

Configuration actuelle:

- Fichier: `netlify.toml`
  - `[build]`:
    - `publish = "."`
    - `command = "npm run build"` (peut être un no-op ou un script léger).
  - `[functions]`: `directory = "netlify/functions"` (Zoho lead, etc.).
  - `[[headers]]`:
    - Headers globaux (`for = "/*"`) de sécurité et de cache.
  - `[[redirects]]`:
    - Redirections HTTP → HTTPS.
    - Gestion de `/services` → `/services/`, etc.

Déclenchement:

- Déploiement automatique:
  - Sur chaque push sur `main`.
- Déploiement manuel:
  - Depuis l’interface Netlify si besoin, via “Trigger deploy” ou “Rollback”.

---

## 6. Vérifications post-déploiement

Après chaque déploiement en production:

1) Sanity check:

- Pages clés:
  - `/`, `/services/`, `/ventousage-paris/`, `/contact/`, `/mentions/`, `/realisations/`.
- Vérifier:
  - Status HTTP 200.
  - Hero visible.
  - Menu fonctionnel (desktop + mobile).
  - Bouton WhatsApp et liens de contact.

2) Lighthouse / PageSpeed Insights:

- Mesurer sur mobile + desktop:
  - Performance.
  - Accessibilité.
  - Bonnes pratiques.
  - SEO.

3) Accessibilité:

- Spot‑check avec:
  - WAVE.
  - Pa11y (si besoin).
- Vérifier:
  - Contraste.
  - Ordre des titres.
  - Navigation clavier.

4) Sécurité:

- Mozilla Observatory:
  - Vérifier la note (objectif: A/A+).
  - Contrôler CSP, HSTS, headers divers.

5) SEO:

- Google Search Console:
  - Vérifier que `sitemap.xml` est accepté.
  - Surveiller les erreurs de couverture.

---

## 7. Rôles et responsabilités

- Développeur:
  - Implémente les changements.
  - Lance les tests locaux + CI.
- Responsable SEO / Produit:
  - Valide les métadonnées, contenus et maillage interne.
- Opérations / Ops:
  - Surveille Netlify, Search Console, Observatory.
  - Gère les éventuels rollbacks.

---

Pour plus de détails, voir également:

- `docs/ARCHITECTURE.md`
- `docs/OPTIMISATIONS.md`
- `docs/SCORES.md`
- `docs/TODO.md`