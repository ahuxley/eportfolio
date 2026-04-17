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

This repo currently publishes as a GitHub Pages project site at:

`https://ahuxley.github.io/eportfolio/`

To publish:

1. Push changes to `main`.
2. In the GitHub repo settings, ensure GitHub Pages is configured to deploy from the `main` branch root.
3. Confirm the canonical URL and social preview resolve correctly after deploy.

## Private source repo workaround

If you want to make this repo private but still keep a public portfolio on GitHub Pages, use the included workflow in `.github/workflows/deploy-public-pages.yml`.

How it works:

1. Keep this repo as the private source of truth.
2. Create a separate public repository that will host the published site.
3. Let GitHub Actions in this repo mirror the static files into that public repo.
4. Configure GitHub Pages on the public repo, not on this private source repo.

Recommended public target repo:

- `ahuxley/ahuxley.github.io` for a root site at `https://ahuxley.github.io/`

Required source repo configuration:

1. Create a fine-grained personal access token with `Contents: Read and write` access to the public target repo.
2. Add the token to this repo as the secret `PUBLIC_PAGES_TOKEN`.
3. Add the repo variable `PUBLIC_PAGES_REPO` with the value `ahuxley/ahuxley.github.io` or another public target repo in `owner/name` format.
4. Optionally add `PUBLIC_PAGES_BRANCH` if the target repo should publish from something other than `main`.
5. Optionally add `PUBLIC_SITE_URL` if you later use a custom domain and want canonical/OG URLs rewritten automatically during deploy.

Required target repo configuration:

1. Create the public target repository before running the workflow.
2. Give it a default branch that matches `PUBLIC_PAGES_BRANCH` or leave that variable unset to use `main`.
3. Configure GitHub Pages in the target repo to publish from the branch root.

Notes:

- This workflow preserves an existing `CNAME` file in the public target repo.
- The workflow automatically rewrites the canonical URL and social preview asset URLs in `index.html` during deployment based on the public target repo or `PUBLIC_SITE_URL`.
- If you make the current public repo private on GitHub Free, GitHub Pages for that repo will be unpublished, so the public mirror repo needs to be in place first.
