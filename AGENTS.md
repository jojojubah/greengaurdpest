# AGENTS.md

## Project Snapshot
- Site: Green Guard Pest Control marketing website.
- Hosting: GitHub Pages from `main` branch (`/` root).
- Domain: `greenguardpestcontrol.co.uk`.
- Canonical route style: clean URLs with trailing slash (example: `/services/`).

## Current File/Route Structure
- Home: `/index.html` -> `/`
- Content pages use folder routes:
  - `/about/index.html` -> `/about/`
  - `/services/index.html` -> `/services/`
  - `/contact/index.html` -> `/contact/`
  - `/privacy/index.html` -> `/privacy/`
  - `/terms/index.html` -> `/terms/`
  - `/cookies/index.html` -> `/cookies/`
  - `/accessibility/index.html` -> `/accessibility/`
- Assets are referenced with absolute paths from site root:
  - `/assets/css/styles.css`
  - `/assets/js/main.js`

## What Was Fixed In This Session
- Removed scroll-driven animation from the dark-green stats band counters.
- Initialized git repo, connected remote, and pushed to:
  - `git@github.com:jojojubah/greengaurdpest.git`
- Added `CNAME` file for custom domain:
  - `greenguardpestcontrol.co.uk`
- Cleaned DNS guidance for GitHub Pages and diagnosed HTTPS issue caused by conflicting records.
- Migrated all internal links from `*.html` to clean routes (`/services/`, etc.).
- Updated nav active-link logic in `assets/js/main.js` for folder-based URLs.
- Replaced mobile `Menu` text with accessible animated hamburger icon (3 bars -> X).
- Added asset cache-busting query version on all pages to force mobile refresh.

## Important Deployment Notes
- GitHub Pages settings should stay:
  - Source: `Deploy from a branch`
  - Branch: `main`
  - Folder: `/ (root)`
- Domain should remain set in Pages settings to:
  - `greenguardpestcontrol.co.uk`
- `www` should CNAME to:
  - `jojojubah.github.io`
- Apex should only have GitHub Pages A records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

## Known Gotchas
- Browser cache (especially mobile Safari/Chrome) may show stale CSS/JS; bump `?v=` query in HTML when style changes appear missing.
- Keep absolute asset paths (`/assets/...`) so nested routes load CSS/JS correctly.
- If nav highlighting breaks, verify trailing slash behavior in `setupCurrentNav()` in `assets/js/main.js`.

## Next Suggested Tasks
- Add canonical and Open Graph URL tags per page matching clean routes.
- Add 301 redirects from legacy `*.html` paths if needed for SEO/backward links.
- Enable/verify `Enforce HTTPS` once certificate issuance is complete in GitHub Pages.
