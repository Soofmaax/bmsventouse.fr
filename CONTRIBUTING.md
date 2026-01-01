# Contributing Guide

Thank you for considering a contribution. This project follows professional quality standards (linting, accessibility, security) to keep the codebase clean and maintainable.

## Ground Rules

- Keep changes focused and atomic
- Prefer clarity over cleverness
- No dead code; no commented‑out blocks
- Follow the linters (HTMLHint, Stylelint, ESLint, Markdownlint)
- Accessibility and performance matter

## Development Setup

- Node 20 (see .nvmrc) or Python 3 for local server
- Run a quick local server:
  - Node: `npx http-server -p 8080`
  - Python: `python3 -m http.server 8080`

## Code Style

- HTML: semantic structure, one H1 per page, metadata complete
- CSS: follow `.stylelintrc.json`, avoid !important unless justified
- JS: ES2021, no global leaks, avoid heavy frameworks for this static site

Run linters locally:
- HTML: `npx -y htmlhint "**/*.html" --config .htmlhintrc`
- CSS: `npx -y -p stylelint -p stylelint-config-standard stylelint "css/**/*.css" --config .stylelintrc.json`
- JS: `npx -y eslint "js/**/*.js" --config .eslintrc.json`
- Markdown: `npx -y markdownlint-cli2 "**/*.md"`

## Branching & Commits

- Branch from `main`: `feature/&lt;brief-name&gt;` or `fix/&lt;brief-name&gt;`
- Conventional commit style encouraged:
  - `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `ci:`
- Keep commit messages imperative and scoped

### Branch protection on `main`

Branch protection is managed in GitHub settings (not in this repo). Recommended configuration:

1. Go to **Settings → Branches → Branch protection rules**.
2. Add a rule for branch name pattern `main`.
3. Enable:
   - “Require a pull request before merging” (no direct pushes to `main`),
   - “Require status checks to pass before merging” and select the workflow named **“CI - Full Quality Gate”**,
   - (Optionnel) “Require branches to be up to date before merging” to avoid merging outdated PRs.
4. Save the rule.

With this in place, any change to production must go through a PR and a green CI run.

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Make sure CI passes: “CI - Full Quality Gate”
3. Provide a clear description: what, why, how tested, screenshots for UI changes
4. Reference issues (e.g., “Closes #123”)

### PR Checklist

- [ ] Lint passes locally (HTML/CSS/JS/MD)
- [ ] No accessibility regressions (manual check or Pa11y if relevant)
- [ ] No secrets committed (Gitleaks)
- [ ] Tested on a local server

## Code of Conduct

By participating, you agree to abide by our Code of Conduct. See CODE_OF_CONDUCT.md.

## Questions?

Open a discussion or issue, or contact SmarterLogicWeb at contact@bmsventouse.fr.