# Third-Party Assets Register

Updated: 2026-02-19

This file tracks externally hosted media used by the site and the minimum license/audit checks required before production use.

## External providers in use

1. `images.pexels.com`
- Usage: page hero images and card thumbnails.
- Repo examples: `index.html`, `en/index.html`, `ru/index.html`, `de/index.html`, `pl/index.html`.
- Required check: confirm Pexels license terms for each asset and commercial use scope.
- Attribution: verify whether attribution is optional/required under current terms.

2. `cdn.pixabay.com`
- Usage: demolition category image assets.
- Repo examples: `index.html`, `en/index.html`, `ru/index.html`, `de/index.html`, `pl/index.html`.
- Required check: confirm Pixabay content license and prohibited use cases.
- Attribution: verify whether attribution is optional/required under current terms.

3. `cdn.coverr.co`
- Usage: homepage hero video.
- Repo examples: `index.html`.
- Required check: confirm Coverr license allows commercial/public website usage.
- Attribution: verify whether attribution is optional/required under current terms.

## Governance checklist

- Store source URL for each asset (exact original page, not only CDN URL).
- Store license snapshot date and reviewer name.
- Keep proof of license terms used at approval time.
- Re-check licenses during release audit if terms changed.
- Replace/remove assets that cannot be verified.

## Approval log

- Status: pending verification for all above providers.
- Owner: not assigned.
