## Why

The site already uses markdown-backed content for the home page, but some of the text-only pages still keep their content directly in Astro component files. Moving those pages to the same content-driven pattern will make them easier to edit and keep the site structure more consistent without changing the overall design.

## What Changes

- Migrate the text-only pages from handwritten Astro page components to markdown-backed content entries under src/content/pages/.
- Exclude the links page from this change because it contains embedded images and is not a text-only page.
- Reuse the existing content collection approach already used for the home page.
- Keep the current layout, navigation, and page behavior unchanged.

## Capabilities

### New Capabilities

- `text-page-content`: A content-driven way to author simple text-only pages from markdown files.

### Modified Capabilities

- None.

## Impact

- Affects the page components in src/pages/ and the shared content collection setup in src/content.config.ts.
- Keeps the change focused on text-only pages and avoids introducing new layout or image abstractions.
