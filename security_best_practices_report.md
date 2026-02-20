# Security and Functional Audit Report

Date: 2026-02-19
Scope: static site (`*.html`, `assets/*`, `_redirects`, `_headers`)

## Executive Summary
Completed a full functional + security + license governance pass.

Current status:
- Critical issues fixed: 3
- Medium issues fixed: 2
- Remaining open findings: 1 (Low)
- Internal static link/action check: 0 broken paths

## Fixed Findings

### F-001 Language switch bounced LV users back to EN (Critical)
- Location: `assets/language-switcher.js:46`
- Fix: updated in-memory `savedLang` after forced language selection (`savedLang = forced`).

### F-002 Redirect pointed to removed foreign-work section (High)
- Location: `_redirects`
- Fix: removed `/darbs-arvalstis /arvalstis 301`; deleted empty `arvalstis/` directory.

### F-003 Request forms used bitwise OR in validation logic (High)
- Locations:
  - `pieteikt-darbu/index.html:22`
  - `en/pieteikt-darbu/index.html:22`
  - `ru/pieteikt-darbu/index.html:26`
  - `de/pieteikt-darbu/index.html:26`
  - `pl/pieteikt-darbu/index.html:22`
- Fix: replaced `|` with `||` in all request forms.

### S-001 CSP allowed inline scripts (Medium)
- Location: `_headers:2`
- Fixes:
  - moved request form inline JS to external `assets/request-form.js`
  - removed inline JSON-LD `<script type="application/ld+json">` blocks
  - tightened CSP `script-src` to `'self'`.

### S-002 DOM XSS sink usage in form previews (Medium)
- Location: `assets/request-form.js`
- Fix: replaced `innerHTML = ""` pattern with `replaceChildren()`.

## UX/Correctness Improvements

### Q-001 Language dropdown fallback-to-root overuse reduced
- Fix: regenerated dropdown `option value` links in all HTML pages.
- Logic: if target language equivalent page exists, link goes to that exact page; otherwise fallback to language root.
- Result: root fallbacks significantly reduced (mostly where localized page is missing).

## License Governance

### L-001 Third-party asset inventory was missing (Low)
- Fix: created `THIRD_PARTY_ASSETS.md` with provider register and verification checklist.
- Providers currently tracked: `images.pexels.com`, `cdn.pixabay.com`, `cdn.coverr.co`.

## Verification

- Inline script scan: 0 matches for inline `<script>` in HTML.
- Internal path scan (`href/src/action`): 0 broken paths.
- Security headers file exists and includes CSP + baseline hardening headers.
