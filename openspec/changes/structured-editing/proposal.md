## Why

Non-technical editors currently face friction when updating page content because they must work directly in markdown and cannot easily manage image-and-text narrative pages in a single, guided form. A structured content model is needed so Pages CMS can provide a clear editing experience while keeping the static Astro workflow.

## What Changes

- Introduce a reusable structured page content schema for narrative pages with fields for title, lead text, hero image metadata, headings, paragraphs, list content, and structured links.
- Define validation rules that keep content accessible and complete, including conditional requirements for image alt text.
- Implement rendering support that maps the structured fields to existing page templates while keeping styling and layout rules in code.
- Add link support for references to internal pages, internal page subsections, and external http/https URLs.
- Keep the current file-based Astro content loading model and Git-backed workflow, but make page editing CMS-friendly through structured frontmatter fields.

## Capabilities

### New Capabilities

- `structured-page-content`: Structured narrative page content schema and rendering contract that enables form-based editing in Pages CMS without requiring raw markdown authoring, including structured internal and external references.

### Modified Capabilities

- None.

## Impact

- Affects content schema definitions in src/content.config.ts and relevant rendering components/routes for narrative pages.
- Introduces a reusable frontmatter contract for pages such as leere-wolke and similar content pages.
- Enables safer, lower-friction editing in Pages CMS for users with limited technical background.
