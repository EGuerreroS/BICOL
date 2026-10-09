# BICOL landing page

The BICOL informational site is a bilingual (EN/ES) static page with scroll animations and particles. It is split into modules by section, and a script assembles them into a single file ready to upload.

## Structure

```
sitio/
├── build.py                  # assembles src/ → index.html
├── index.html                # FINAL page (single file, ready to upload) — open this one

└── src/
    ├── index.html            # skeleton: <head>, section order, CSS and JS
    ├── sections/             # HTML for each section, in page order
    │   ├── nav.html          # logo, links, EN/ES switch
    │   ├── hero.html         # headline + book covers
    │   ├── stats.html        # key figures (animated counters)
    │   ├── cognates.html     # interactive cognates demo
    │   ├── pillars.html      # Read · Listen · Discover · Connect
    │   ├── why.html          # "Stories, not memorization"
    │   ├── collection.html   # books, genres, cultures, virtues
    │   ├── levels.html       # Basic / Intermediate / Advanced
    │   ├── impact.html       # impact + academic references
    │   ├── partnership.html  # UdG CUValles research lines
    │   ├── roadmap.html      # 4-phase roadmap
    │   ├── founder.html      # Dr. Germán López's photo and bio
    │   ├── cta.html          # contact
    │   └── footer.html
    ├── styles/
    │   ├── base.css          # colors, gradients, typography, buttons
    │   ├── effects.css       # reveal, particles, letters, 3D tilt
    │   └── sections/         # one .css per section (same names)
    ├── scripts/
    │   ├── core.js           # BICOL namespace + module registry
    │   ├── i18n/en.js        # English texts
    │   ├── i18n/es.js        # Spanish texts
    │   ├── lang.js           # language switch
    │   ├── reveal.js         # scroll-in animations
    │   ├── counters.js       # animated numbers
    │   ├── scroll.js         # progress bar, parallax, books, roadmap
    │   ├── cognates.js       # cognate highlighting
    │   ├── interactions.js   # 3D cards and magnetic buttons
    │   ├── glyphs.js         # floating letters
    │   ├── particles.js      # canvas particles
    │   └── main.js           # starts all modules (must load last)
    └── assets/img/           # local images (embedded at build time)
```

## Building the page

You need Python 3, with no extra dependencies.

```bash
python build.py
```

To rebuild automatically while you edit:

```bash
python build.py --watch
```

The result is `sitio/index.html`. It is a single file that embeds all CSS, JS and the founder's photo. Open it directly in the browser or upload it to any static host (Netlify Drop, GitHub Pages, Vercel…).

> Always edit in `src/`, never in `sitio/index.html`, which is overwritten on every build.
> Opening `src/index.html` directly only shows a notice: it is the skeleton, not the page.

## Common tasks

| I want to… | Edit |
|---|---|
| Change a text | `src/scripts/i18n/en.js` **and** `es.js` (same key). The HTML only has the default text. |
| Add a language (e.g. Portuguese) | Create `src/scripts/i18n/pt.js` by copying `es.js`, add its `<script>` in `src/index.html`, and add `<button data-lang="pt">PT</button>` in `sections/nav.html`. |
| Change colors or gradients | Variables in `src/styles/base.css` (`:root`). |
| Change a section's design | `src/styles/sections/<section>.css` |
| Add a new section | Create `sections/x.html` and `styles/sections/x.css`, then add the `@include` line and the `<link>` in `src/index.html`. |
| Add particles to a section | Add `data-fx="hero\|impact\|cta\|band\|light"` and the `has-fx` class to the section. Add `data-glyphs` for floating letters. |
| Animate something on scroll | Add the `rv` class to it. |
| Change the founder's photo | Replace `src/assets/img/german-lopez.webp`. |

## Pending before publishing

- [ ] Real contact email (`sections/cta.html`, currently `CONTACTO@BICOL.ORG`).
- [ ] Real title and description for Book 3 (`v3.t` / `v3.d` in `i18n/en.js` and `es.js`).
- [ ] Book covers and the logo load from the WordPress site. If that site goes down, download them to `src/assets/img/` and change the `src` attributes.
