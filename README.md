# Abbas portfolio

Personal portfolio for S M Abbas S, Odoo Technical & Functional Developer.
Static HTML, CSS and JavaScript; no build or dependencies required.

## Preview

Run `python3 -m http.server 8770` in this directory, then open http://localhost:8770.

## Edit

- Content, metadata and structured data: `index.html`.
- Design (graphite / silver / dark-gold tokens, both themes, responsive layout): `css/site.css`.
- Theme toggle, mobile menu, galleries, scroll reveal and email enquiry: `js/site.js`.
- Latest-release video: `assets/video/` (720p H.264, faststart) with poster `assets/img/bd3-poster.webp`.
- App screenshots: `assets/img/`. Portrait: `assets/img/portrait-v4.webp` and its small variant.
- Social sharing preview: `assets/og-v8.png`.
- New release: update the "Latest release" section, the app card versions and add a card to "Updates from LinkedIn".

The contact form prepares an email draft in the visitor's email application.
It does not submit to a server. No placeholder testimonials are displayed.

## Publish

GitHub Pages serves this repository from `main`. Push reviewed changes to publish.
Increment the CSS and JS query versions in `index.html` for new releases.

## Accessibility

Semantic landmarks, a single primary heading, labeled form fields, native validation,
visible focus rings, skip navigation, keyboard-accessible gallery controls,
Escape-to-close mobile navigation, reduced-motion support and dark/light themes.
Essential content stays visible when JavaScript is unavailable.
