# Changelog
All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning where applicable.

## [Unreleased]

- See `plan_action.md` for the active backlog of SEO, accessibility and content tasks.

## [1.1.0] - 2025-12-22

### Added

- Dedicated contact hub `/contact-direct/` for NFC/QR usage, with 4 entry points (phone, WhatsApp, email, mini-form) and GA4 event `contact_submitted`.
- Legal and information pages : `/politique-confidentialite/`, `/conditions-generales-prestation/`, `/infos-ia/`.
- Non-blocking Lighthouse CI job on key URLs and extended Pa11y WCAG 2 AAA coverage in CI.

### Changed

- Centralized Content Security Policy in `netlify.toml` headers and removed obsolete meta CSP tags from HTML pages.
- Unified icons to inline Bootstrap SVG (replacing legacy Font Awesome WhatsApp SVGs) and documented the `enhanceImages()` helper.
- Synchronized documentation (`docs/getting-started`, `docs/architecture`, `docs/api`, `docs/patterns`, `README-css.md`, `README-icons.md`) with the current implementation and analytics setup.

### Fixed

- Various accessibility and UX refinements on the FAQ module, cookies banner, 404 page and contact flows.

## [1.0.0] - 2025-09-30

Initial public release of **bmsventouse.fr** website with:

- Core marketing pages (services, pricing, logistics, security).
- Localized ventousage pages.
- Initial SEO setup (titles, meta descriptions, sitemap.xml).
- Basic accessibility and performance optimizations.

---

[Unreleased]: https://github.com/Soofmaax/bmsventouse.fr/compare/1.1.0...HEAD
[1.1.0]: https://github.com/Soofmaax/bmsventouse.fr/compare/1.0.0...1.1.0
[1.0.0]: https://bmsventouse.fr/