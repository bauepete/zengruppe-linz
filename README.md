# Zengruppe Linz Website

## Editing the Content

Pages are edited as Markdown files with YAML frontmatter in src/content/pages.

For structured pages, set template to structured-narrative and use these frontmatter fields:

- title: required page title
- template: set to structured-narrative
- introText: optional intro text, supports inline Markdown
- heroImage: optional image path under /images
- heroImageAlt: required when heroImage is set
- content: ordered list of typed blocks
- linkReferences: optional list of curated links

Supported content block types in content:

- type: sectionTitle with text (required)
- type: subsectionTitle with text (required)
- type: paragraph with text (required, inline Markdown supported)
- type: unorderedList with items (required list of strings)
- type: orderedList with items (required list of strings)
- type: quote with text (required) and author (optional)

Link reference entries in linkReferences:

- label: required link text
- targetType: one of internal-page, internal-subsection, external-url
- page: required for internal-page and internal-subsection
- subsection: required for internal-subsection
- url: required for external-url and must start with http:// or https://

Multiline text behavior:

- Use YAML literal style | when line breaks should be preserved exactly.
- Use YAML folded style > when newlines should be folded into running text.
- In rendered output, explicit newlines in Markdown-capable text become line breaks.

Inline links inside Markdown-capable text support:

- `[label](/path/)` root-relative internal links (normalized with base path)
- `[label](impressum)` bare internal page slug links
- `[label](#anchor)`, `[label](./relative)`, `[label](../relative)`
- `[label](https://example.org)` external links

Unsupported inline link targets (for example protocol-relative URLs or unsupported schemes) are sanitized and rendered as plain text labels.

## Deployment
