# Abbas portfolio

Personal portfolio for S M Abbas S, Odoo Technical & Functional Developer.
Static HTML, CSS and JavaScript; no build or dependencies required.

## Preview

Run `python3 -m http.server 8770` in this directory, then open http://localhost:8770.

## Edit

- Content, metadata and structured data: `index.html`.
- Colors, typography and responsive layout: `css/style.css`.
- Theme, mobile menu, screenshot galleries and email enquiry: `js/main.js`.
- Continuous animations, scroll entrances and pause control: `css/motion.css` and `js/motion.js`.
- Final readability, theme polish and reading progress: `css/polish.css` and `js/polish.js`.
- Existing portrait: `assets/img/portrait-v4.webp` and its small variant.
- App screenshots: `assets/img/`.
- Social sharing preview: `assets/og-v7.png`.

The contact form prepares an email draft in the visitor's email application.
It does not submit to a server. App metrics and professional details are retained
from the previous portfolio. No placeholder testimonials are displayed.

## Publish

GitHub Pages serves this repository from `main`. Push reviewed changes to publish.
Increment CSS and JS query versions in `index.html` for new releases.

## Accessibility

Semantic landmarks, a single primary heading, labeled form fields, native validation,
visible focus rings, skip navigation, keyboard-accessible gallery controls,
Escape-to-close mobile navigation, reduced-motion support and dark/light themes.
Essential content stays visible when JavaScript is unavailable.
