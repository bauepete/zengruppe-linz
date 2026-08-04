## Context

The project is an Astro static site with content entries under src/content/pages and currently mixes simple markdown-backed pages with custom Astro templates for image-rich narrative pages. Editors with limited technical experience need a form-driven workflow in Pages CMS while the site should remain file-based and maintainable.

## Goals / Non-Goals

**Goals:**

- Define one reusable structured narrative page contract that Pages CMS can edit as guided fields.
- Keep rendering and styling decisions in Astro templates rather than in content field semantics.
- Preserve the existing static build and Git-backed content workflow.

**Non-Goals:**

- Replacing the static site architecture with a runtime backend CMS.
- Designing a universal schema for every page type in one change.
- Introducing page builder drag-and-drop composition.

## Decisions

1. Use a reusable structured narrative field set in frontmatter.
   Why: Editors can update one page in one form without editing raw markdown structure.
   Alternative considered: page-specific field sets per route. Rejected because it increases maintenance and cognitive load.

2. Keep field names semantic and style-agnostic.
   Why: Styling can evolve in templates without requiring content migration.
   Alternative considered: embedding positional and style hints in field names. Rejected because it couples content to layout.

3. Support Markdown in selected rich text fields only.
   Why: Editors still get lightweight emphasis support while sensitive fields remain predictable plain text.
   Alternative considered: all fields plain text. Rejected because it removes useful inline formatting for prose content.

4. Enforce conditional and completeness validation in schema.
   Why: It prevents inaccessible image content and empty page sections before publish.
   Alternative considered: no validation beyond types. Rejected because quality issues would be discovered too late in rendering.

5. Model links as structured references instead of free-form inline links.
   Why: Editors can create internal and external references safely in CMS forms without knowing markdown or URL rules.
   Alternative considered: allowing links only through free markdown inline syntax. Rejected because it increases editing errors and makes validation weaker.

## Risks / Trade-offs

- [Risk] Editors may expect fully free-form composition from CMS.
  Mitigation: Communicate this schema as a guided narrative template, not a page builder.

- [Risk] Different narrative pages may need additional optional fields.
  Mitigation: Add optional fields incrementally only when multiple pages share the need.

- [Risk] Markdown support in list items could introduce inconsistent style usage.
  Mitigation: Keep allowed Markdown minimal and provide editor guidance examples.

- [Risk] Internal page/subsection references can break when target slugs or anchors change.
  Mitigation: Validate reference fields, generate anchors deterministically from section identifiers, and include link checks in verification.

## Migration Plan

1. Extend content schema with the structured narrative fields, structured linkReferences, and validation rules.
2. Add or update rendering components to map the structured fields to semantic HTML and resolve structured link targets.
3. Migrate leere-wolke as the first structured narrative page entry.
4. Verify build output, sample editor workflows in Pages CMS, and link resolution behavior.
5. Roll back by keeping legacy route/template rendering until migrated pages are confirmed.

## Content Block Grammar (v1)

This grammar applies only to entries using `template: structured-narrative`.

### Entry fields

- `title` (required)
- `template` = `structured-narrative` (required)
- `introText` (optional, Markdown-capable inline text)
- `heroImage` (optional, managed asset path)
- `heroImageAlt` (required when `heroImage` is set)
- `content` (required ordered array of content blocks)
- `linkReferences` (optional curated links section)

### Content block union

Each element in `content` is exactly one typed block:

1. `type: sectionTitle` with `text`
2. `type: subsectionTitle` with `text`
3. `type: paragraph` with `text` (Markdown-capable inline text)
4. `type: unorderedList` with `items[]` (Markdown-capable inline text)
5. `type: orderedList` with `items[]` (Markdown-capable inline text)
6. `type: quote` with `text` (Markdown-capable inline text) and optional `author`

### Inline links

Inline links are authored via CMS link insertion UI inside text fields (`introText`, paragraph text, list items, quote text).
The UI writes inline links at the exact text position and supports:

- internal page links
- internal subsection links
- external http/https links

`linkReferences` remains optional for explicit "related links" sections outside prose flow.

### Media semantics

- `heroImage` and `heroImageAlt` describe content semantics only.
- Visual placement and styling are template concerns, not content-schema concerns.

### Renderer contract

- Render blocks strictly in `content` order.
- Render Markdown-capable fields with inline emphasis/link support.
- Render `quote.author` only when present.
- Render hero image only when `heroImage` exists.
- Keep plain text handling for `title`, `heroImageAlt`, and heading text fields.

### Not-found behavior

`StructuredNarrativePage` SHALL expose an optional `notFoundMessage` renderer prop (same behavior as `ContentPage`) so error messages remain template-level and outside editor-managed content.

## Open Questions

None.
