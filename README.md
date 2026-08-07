# Zengruppe Linz Website

## Editing the Content

Pages are edited as Markdown files with YAML frontmatter in src/content/pages.

For structured pages, set template to structured-narrative and use these frontmatter fields:

- title: required page title
- template: set to structured-narrative
- lead: optional intro text, supports inline Markdown
- content: ordered list of typed blocks

Supported content block types in content:

- `sectionTitle` with text (required)
- `subsectionTitle` with text (required)
- `paragraph` with text (required, inline Markdown supported)
- `image` with the following elements:
  - `src`: path to image file (required)
  - `alt`: alt text (required)
  - `placement`: `left` | `right` | `centered`. Default value is `left`.
  - `textWrap`: `aboveAndBelow` | `around` | `none`. Default value is `aboveAndBelow`.

Multiline text behavior:

- Use YAML literal style | when line breaks should be preserved exactly.
- Use YAML folded style > when newlines should be folded into running text.
- In rendered output, explicit newlines in Markdown-capable text become line breaks.

Inline links inside Markdown-capable text support:

- `[label](/path/)` root-relative internal links (normalized with base path)
- `[label](impressum)` bare internal page slug links
- `[label](https://example.org)` external links

Unsupported inline link targets (for example protocol-relative URLs or unsupported schemes) are sanitized and rendered as plain text labels.

## Deployment
