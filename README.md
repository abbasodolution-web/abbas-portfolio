# ABBAS portfolio site

Static site (HTML, CSS, vanilla JS). No build step.

## Run locally
    python3 -m http.server 8000     # then open http://localhost:8000

## Deploy
Drag the folder onto Netlify Drop, or push it to a GitHub repo and enable GitHub Pages.

## Edit
- Text: `index.html`. Sections are marked with comments (HERO SLIDER, ABOUT, SERVICES, APPS, PROOF, PROCESS, CONTACT).
- Colors: CSS variables at the top of `css/style.css` (functional = amber/coral/teal, technical = indigo/blue/navy).
- Slides: each `<article class="slide sN">` in the hero. Backgrounds are the `.s1` to `.s5` gradients in the CSS.
- App windows: the three `<section class="window">` blocks. Add screenshots as extra `<img>` tags in `data-carousel`.
- Photo: in the About section replace `<span>AS</span>` inside `.avatar` with `<img src="assets/img/portrait-v3.webp" alt="S M Abbas S">`.
- Testimonials: three placeholder cards in "What clients say". Replace them with real quotes before going live.
- Contact form: validates, then opens the visitor's email app (mailto). For a real form backend, point the form to Formspree or Netlify Forms.
- Share image: `assets/og.png` (1200x630).

## Features
Hero slider (5 slides, autoplay with progress bar, pause on hover, swipe, arrows, dots, keyboard), three promo banners,
draggable app windows with screenshot carousels, animated counters and bars, testimonials slider, 5-step timeline,
light/dark theme (follows the system, remembers the choice), scroll reveals, typing effect, magnetic buttons,
reduced-motion support, responsive from 360 px.
