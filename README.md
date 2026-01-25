<div align="center">
  <h1>🚀 BMS Ventouse - Production Static Website</h1>
  <p><strong>Static, accessible and SEO‑focused corporate website, production‑ready and enterprise‑grade.</strong></p>

  <a href="https://github.com/Soofmaax/bmsventouse.fr/actions/workflows/ci.yml"><img alt="CI - Full Quality Gate" src="https://github.com/Soofmaax/bmsventouse.fr/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://bmsventouse.fr/"><img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fbmsventouse.fr&label=website&logo=netlify&logoColor=white"></a>
- Production: https://bmsventouse.fr/
- Screenshots/GIFs: add in docs or this section

## ✅ Current Status

- Static site in production with full CI (HTML/CSS/JS lint, accessibility, security).
- No contact form on the site: contact is via phone, WhatsApp or email (see `/contact/` and `/contact-direct/`). `/contact-direct/` is a focused contact hub (NFC/QR), without Netlify form.
- FAQs, services and safety pages have been harmonized (content, icons, accessibility).
- All icons are now inline SVG (no external icon fonts).

## 🗺️ Roadmap / future work

- Contact hub / NFC / QR (`/contact-direct/`) créé et en production.
- Les évolutions SEO, accessibilité et qualité sont désormais suivies dans `plan_action.md`.
- Éventuel futur : ajouter un mini blog ou des études de cas pour renforcer le SEO.
- Screenshots/GIFs : à ajouter plus tard dans la doc ou dans cette section.

## 🚀 Quick Start

- Serve locally (no build step):
  - Node: npx http-server -p 8080
  - Python: python3 -m http.server 8080
- Open http://localhost:8080

## 📚 Documentation

- docs/ : full documentation index
  - Getting Started: installation, configuration, quick start
  - Architecture: static site + CI overview
  - Deployment: local, staging, production
  - Troubleshooting: common issues

Start here: docs/README.md



## 🛠️ Tech Stack

- Frontend: HTML5, CSS3, JavaScript (vanilla)
- Hosting: Netlify
- Quality: HTMLHint, Stylelint, ESLint, Markdownlint, Pa11y
- Security: CodeQL (SAST), Gitleaks, Security headers
- CI: GitHub Actions — workflow “CI - Full Quality Gate”

## 🧪 CI & Quality Gate

- Workflow: `.github/workflows/ci.yml` (“CI - Full Quality Gate”)
- Triggers:
  - `push` sur `main`
  - `pull_request` vers `main`
  - `workflow_dispatch` (manuel)
  - `schedule` mensuel (cron)
- Jobs principaux :
  - **Lint** : Super-Linter (HTML/CSS/Markdown/JSON/YAML/Gitleaks) + rapports Stylelint / HTMLHint / Markdownlint
  - **Accessibility** : `pa11y-ci` sur un panel d’URLs (config `.pa11yci.json`)
  - **Lighthouse CI** : perf / SEO / accessibilité (config `lighthouserc.json`)
  - **CodeQL** : analyse SAST JavaScript
  - **npm audit** : audit des dépendances (niveau `high` et +)
- Pour rejouer localement (optionnel) :
  - Servir le site : `npx http-server -p 8080 .`
  - Lint HTML : `npx htmlhint --config .htmlhintrc "**/*.html"`
  - Accessibilité : `npx pa11y-ci`
  - Lighthouse : `npx lhci autorun --config=lighthouserc.json`

## 🤝 Contributing

We welcome contributions. Please read CONTRIBUTING.md and follow the PR template.  
All PRs must pass the “CI - Full Quality Gate”.

- Guidelines: CONTRIBUTING.md
- Code of Conduct: CODE_OF_CONDUCT.md

## 📝 License

MIT - see LICENSE.  
Note: textual content, logos and images may have specific copyrights.

## 📧 Support & Contact

- Company: SmarterLogicWeb (https://smarterlogicweb.com)
- Mission: Solutions web intelligentes, sécurisées et sur‑mesure
- Contact: contact@bmsventouse.fr

---

<div align="center">
  <p>Made with ❤️ by <strong>SmarterLogicWeb</strong></p>
  <p>
    🌐 <a href="https://smarterlogicweb.com">Website</a> •
    📧 <a href="mailto:contact@bmsventouse.fr">Contact</a> •
    💼 <a href="https://linkedin.com/company/smarterlogicweb">LinkedIn</a>
  </p>
  <p>
    <small>Ce dépôt est optimisé pour la qualité, la sécurité et l’accessibilité. N’hésite pas à ouvrir une issue ou une PR si tu repères un point à améliorer.</small>
  </p>
</div>

