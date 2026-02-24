# GreenPest — CLAUDE.md

## Project Overview
Static marketing website for **Green Guard Pest Control**, a UK-based pest control business.
Live site: [greenguardpestcontrol.co.uk](https://greenguardpestcontrol.co.uk)

## Tech Stack
- Pure HTML5, CSS3, vanilla JavaScript — no frameworks, no build tools
- Hosted on **GitHub Pages** with a custom domain (`CNAME` file)
- No package.json, no npm, no build step — files are deployed as-is

## Deployment
- Git remote uses **SSH**
- Push to `main` branch → GitHub Pages auto-deploys
- After making changes, commit and push: `git add`, `git commit`, `git push`
- **Cache busting:** Update the `?v=YYYYMMDD-N` query string on CSS/JS `<link>`/`<script>` tags in all HTML files when updating `styles.css` or `main.js`

## File Structure
```
index.html              Homepage
services/index.html     Services page
about/index.html        About page
contact/index.html      Contact page
privacy/index.html      Privacy Policy
terms/index.html        Terms of Service
cookies/index.html      Cookie Policy
accessibility/index.html Accessibility Statement
assets/css/styles.css   Main stylesheet
assets/js/main.js       Main JavaScript
CNAME                   Custom domain config
```

## Design System (CSS Variables)
Defined at the top of `styles.css`:
- **Brand greens:** `--brand-900` (#0b3c2d), `--brand-700` (#196b51), `--brand-500` (#2f8a63), `--brand-300` (#95cfb1)
- **Backgrounds:** `--bg` (#f4f8f6), `--surface` (#ffffff)
- **Text:** `--text` (#1a2b24), `--muted` (#5d7268)
- **Fonts:** Space Grotesk (headings), Manrope (body) — loaded from Google Fonts
- **Breakpoints:** tablet `980px`, mobile `620px`

## Key Conventions
- All pages share the same header/footer structure — changes to nav or footer must be applied to **every** HTML file
- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Accessibility: skip link, ARIA labels, `lang="en-GB"`, focus-visible states
- Cookie consent is injected dynamically by `main.js` — do not add a static banner in HTML
- `localStorage` key for consent: `gg_consent_v1`

## Workflow
1. Make requested changes to HTML/CSS/JS files
2. Bump asset version query strings if CSS or JS changed
3. Commit with a clear message
4. Push via SSH (`git push origin main`)
