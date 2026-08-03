# Website for `zengruppe-linz`

## Project

Static website for zengruppe-linz.at, implemented with Astro and deployed via GitHub Pages.

The goal is a small, simple, maintainable static site. Avoid unnecessary frameworks, dependencies, JavaScript, or abstractions.

## Conventions

- Use `BaseLayout.astro` for all pages.
- Use semantic HTML and avoid inline styles.
- Keep images responsive; avoid fixed pixel dimensions unless necessary.

## Path handling

Base URLs and asset paths are handled centrally in `src/utils/paths.ts`.

Use `assetPath()` for assets in `public/`. Do not hard-code `/public/`, `/images/`, or the GitHub Pages base path in asset URLs.
