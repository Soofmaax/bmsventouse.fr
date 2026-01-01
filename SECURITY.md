# Security Policy

We take security seriously and appreciate responsible disclosures. This document explains how to report vulnerabilities and what to expect.

## Supported Versions

This is a static website project. Security checks are focused on:
- JavaScript client code and build scripts
- CI configuration (GitHub Actions)
- Dependencies used for tooling (Node)
- Infrastructure configuration (Netlify)

We monitor and maintain:
- Main branch
- Latest monthly release (if applicable)

## Reporting a Vulnerability

If you discover a security vulnerability within this project or its deployment (bmsventouse.fr), please **report it responsibly** by emailing:

- Email: contact@bmsventouse.fr
- Subject line: `[Security] bmsventouse.fr – vulnerability report`

If you believe you’ve found a security vulnerability, please email us with details, including (when possible):
- Affected path(s), file(s), or URL(s)
- Proof of concept (PoC) and reproduction steps
- Potential impact and severity
- Suggested mitigation if available

Please include:
- Affected path(s), file(s), or URL(s)
- Proof of concept (PoC) and reproduction steps
- Potential impact and severity
- Suggested mitigation if available

We will acknowledge your report within 5 business days and keep you updated on progress.

## Out of Scope

- Issues in third‑party scripts (e.g., GA4) not controlled by this repository
- Content issues (typos, UX preferences) without security impact
- Vulnerabilities requiring privileged access to infrastructure not owned by this project

## Remediation Process

1. Triage and reproduce
2. Assign CVSS‑like internal severity (Critical/High/Medium/Low)
3. Patch and test in a private branch
4. Deploy fix
5. Credit reporter if desired (optional)

## Security Best Practices Used

- CodeQL (SAST) on JS
- Gitleaks to prevent secret leakage
- Strict CI quality gate (Super‑Linter)
- Netlify security headers and CSP
- No backend or server‑side code in this repository

## Contact

SmarterLogicWeb  
Website: https://smarterlogicweb.com  
Security: contact@bmsventouse.fr