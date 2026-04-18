# Andrew Huxley Portfolio

Static GitHub Pages portfolio for Andrew Huxley, focused on professional experience, IT support fundamentals, analytics, and early-career technical growth.

## Stack

- Plain HTML, CSS, and JavaScript
- Optimized static assets
- GitHub Pages deployment
- Optional Formspree contact form support

## Local preview

Any static server works. Two simple options:

```bash
python -m http.server 4173
```

or

```bash
npx serve .
```

Then open `http://localhost:4173` or the URL printed by your chosen server.

## Contact form setup

The form supports Formspree, but the repo intentionally ships with a safe fallback.

1. Create a Formspree form and copy the endpoint URL.
2. Open `index.html`.
3. Find:

```html
<meta name="formspree-endpoint" content="">
```

4. Paste the endpoint into `content`.

Example:

```html
<meta name="formspree-endpoint" content="https://formspree.io/f/your-form-id">
```

If that field is left empty, the site falls back to opening the visitor's default mail client with a prefilled email draft.

## Content notes

- The site is intentionally experience-first instead of pretending there is a large project catalog.
- Public GitHub references are lightweight and should stay honest.
- A resume download button is not included until a real file exists in the repo.

## Deployment

This repo currently publishes as a root GitHub Pages site at:

`https://ahuxley.github.io/`

The project URL `https://ahuxley.github.io/eportfolio/` may still resolve, but the canonical/OG metadata
is intentionally set to the root URL above.

To publish:

1. Push changes to `main`.
2. In the GitHub repo settings, ensure GitHub Pages is configured to deploy from the `main` branch root.
3. Confirm canonical and social metadata resolve to `https://ahuxley.github.io/` after deploy.
