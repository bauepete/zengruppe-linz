# Website for `zengruppe-linz`

## Project

Static website for zengruppe-linz.at, implemented with Astro and deployed via GitHub Pages.

The goal is a small, simple, maintainable static site. Avoid unnecessary frameworks, dependencies, JavaScript, or abstractions.

## Conventions

- Implementation language is Typescript. Avoid using JavaScript. If you should have to use JavaScript, DO NOT implement and inform me about the need.
- Use `BaseLayout.astro` for all pages.
- Use semantic HTML and avoid inline styles.
- Keep images responsive; avoid fixed pixel dimensions unless necessary.
- Markdown-backed Astro pages must use the shared component `ContentPage.astro` rather than duplicating collection lookup and 404 handling in page frontmatter.

## Path handling

Base URLs and asset paths are handled centrally in `src/utils/paths.ts`.

Use `assetPath()` for assets in `public/`. Do not hard-code `/public/`, `/images/`, or the GitHub Pages base path in asset URLs.

## OpenSpec command boundaries

- When `/opsx-explore` is invoked, remain strictly in exploration mode.
- Do not create or modify files.
- Do not invoke, load, or transition to `openspec-propose` or another
  OpenSpec skill unless explicitly requested by the user.
- When exploration is complete, summarize the findings and suggest the
  appropriate next command, but wait for confirmation.
