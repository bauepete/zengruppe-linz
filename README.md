# Zengruppe Linz Website

Pages are edited as Markdown files

## Content images

- Author normal images in Markdown content with standard syntax: `![Alt text](image/<page>/<filename>)`
- Page-associated content images live under `src/content/pages/image/`
- Editor-generated filenames (including randomized names) are supported
- Duplicate image files are allowed; no deduplication is required
- Image presentation stays in Astro templates/styles; editors do not need HTML for layout

## Orphan cleanup

- Build runs automatic orphan cleanup for content images before Astro build
- Cleanup scope is strictly limited to `src/content/pages/image/**`
- Files under `public/` are never deleted by this cleanup

Useful commands:

- `npm run cleanup:content-images` runs cleanup immediately
- `npm run cleanup:content-images:dry` reports what would be removed without deleting files
