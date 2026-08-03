## Approach

The migration should be limited to text-only pages and should follow the existing content-driven pattern that already works for the home page.

## Content Model

- Store each text-only page in a markdown file under src/content/pages/.
- Use frontmatter for simple metadata such as the page title.
- Render the markdown body through the same shared content rendering path used by the home page.

## Rendering

- Keep the existing BaseLayout shell and navigation intact.
- Let the page route resolve the correct content entry and render it in the same layout.
- Avoid introducing broader abstractions unless they are needed to keep the implementation simple.

## Scope

This change covers only the text-only pages, such as:

- begleitung
- impressum

The links page is intentionally excluded because it contains an image and is outside the scope of this text-only migration.
These pages should be migrated to markdown-backed content without changing their visual presentation.
