# Structured Page Content

## Purpose

Enable non-technical editors to update narrative pages through structured content fields that can be edited safely in Pages CMS and rendered consistently in Astro.

## ADDED Requirements

### Requirement: Structured narrative page fields

The system SHALL support a reusable structured narrative page schema with entry-level fields `title`, `template`, `introText`, `heroImage`, `heroImageAlt`, `content`, and `linkReferences`.
Each element in `content` SHALL be exactly one typed block with one of the following forms:

- `type: sectionTitle` with `text`
- `type: subsectionTitle` with `text`
- `type: paragraph` with `text`
- `type: unorderedList` with `items[]`
- `type: orderedList` with `items[]`
- `type: quote` with `text` and optional `author`

#### Scenario: Narrative content entry is loaded

- **WHEN** a page entry uses the structured narrative schema
- **THEN** all declared schema fields are available to page rendering components

### Requirement: Conditional and completeness validation

The system SHALL validate structured narrative entries such that title is required, template is required with value `structured-narrative`, heroImageAlt is required when heroImage is set, and at least one `paragraph`, `quote`, `unorderedList`, or `orderedList` content block contains content.
For typed content blocks, `text` SHALL be required for `sectionTitle`, `subsectionTitle`, `paragraph`, and `quote`, while `author` on `quote` SHALL remain optional.

#### Scenario: Image alt text is missing

- **WHEN** a content entry defines heroImage but omits heroImageAlt
- **THEN** schema validation fails with an error indicating heroImageAlt is required

#### Scenario: No main content blocks are provided

- **WHEN** no paragraph, quote, unorderedList, or orderedList block in content has textual items
- **THEN** schema validation fails with an error requiring at least one populated content block

#### Scenario: Quote block omits text

- **WHEN** a quote block is present without text
- **THEN** schema validation fails with an error indicating quote text is required

### Requirement: Media field definitions and behavior

The system SHALL interpret media-related fields as follows:

- `heroImage`: Optional page-level image source for the narrative lead section. The value represents a path to a managed static asset intended for rendering through the existing asset path utility.
- `heroImageAlt`: Text alternative for `heroImage` used for accessibility and non-visual rendering contexts.

The system SHALL treat these fields as content semantics only (what media is shown and how it is described), while visual placement and styling remain controlled by template code.

#### Scenario: Hero image is provided with alt text

- **WHEN** a structured narrative entry contains both heroImage and heroImageAlt
- **THEN** the page renders the hero image using the resolved asset path and applies heroImageAlt to the image alt attribute

#### Scenario: Hero image is omitted

- **WHEN** a structured narrative entry does not define heroImage
- **THEN** no hero image element is rendered and page rendering continues with textual content

#### Scenario: Alt text is descriptive content

- **WHEN** editors provide heroImageAlt
- **THEN** the field is treated as plain text description and is not parsed as Markdown

### Requirement: Markdown-capable rich text fields

The system SHALL treat introText, paragraph text, quote text, unorderedList items, and orderedList items as Markdown-capable content while treating title, heroImageAlt, sectionTitle text, subsectionTitle text, and quote author as plain text.

#### Scenario: Inline emphasis markup is authored in rich text fields

- **WHEN** an editor enters Markdown emphasis syntax in introText or paragraph text
- **THEN** the rendered output includes the corresponding semantic emphasis markup

### Requirement: Inline link normalization and safety

The system SHALL normalize inline markdown links in Markdown-capable fields with the following behavior:

- `http` and `https` links are rendered as external anchors.
- Root-relative links (starting with `/`) are normalized through the page path utility so deployment base paths are respected.
- Hash-only (`#...`) and dot-relative (`./...`, `../...`) links are preserved as authored.
- Bare page slugs (`impressum`, `impressum#kontakt`) are resolved to internal page paths.
- Protocol-relative URLs (`//...`) and unsupported schemes are treated as invalid and MUST NOT render as anchors.

When an inline link target is invalid, the renderer SHALL keep the link label text as escaped plain text without emitting an anchor element.

#### Scenario: Root-relative internal link respects base path

- **WHEN** an editor writes an inline link such as `[Impressum](/impressum/)`
- **THEN** the rendered href uses the resolved page path including the configured base path

#### Scenario: Bare internal page slug is resolved

- **WHEN** an editor writes an inline link such as `[Impressum](impressum)`
- **THEN** the rendered href points to the internal page path for that slug

#### Scenario: Unsupported inline link target is sanitized

- **WHEN** an editor writes an inline link with an unsupported target scheme or protocol-relative URL
- **THEN** the renderer outputs only the escaped link text and does not emit an anchor element

### Requirement: Structured lists map to semantic HTML lists

The system SHALL render `type: unorderedList` blocks as unordered lists and `type: orderedList` blocks as ordered lists in narrative page templates.

#### Scenario: Both list fields are provided

- **WHEN** ordered `content` contains unorderedList and orderedList blocks with items
- **THEN** the page renders both list blocks using semantic list elements in the configured template order

### Requirement: Typed block rendering

The system SHALL render typed blocks strictly in `content` order and map block types to semantic HTML.

#### Scenario: Quote block includes author

- **WHEN** a quote block provides both text and author
- **THEN** the renderer outputs quote text and renders the author only when present

### Requirement: Structured link references

The system SHALL support linkReferences as structured link entries that can target either internal pages, internal page subsections, or external URLs.

#### Scenario: Internal page link is configured

- **WHEN** an editor creates a linkReference with targetType set to internal-page and provides a page identifier
- **THEN** the renderer outputs a link to the resolved page path

#### Scenario: Internal subsection link is configured

- **WHEN** an editor creates a linkReference with targetType set to internal-subsection and provides a page identifier plus subsection identifier
- **THEN** the renderer outputs a link to the resolved page path with subsection anchor

#### Scenario: External link is configured

- **WHEN** an editor creates a linkReference with targetType set to external-url and provides a URL
- **THEN** the renderer outputs a link to that URL

### Requirement: Link validation

The system SHALL validate linkReferences such that each link entry contains required fields for its targetType and external-url targets only accept http or https schemes.

#### Scenario: External URL uses unsupported scheme

- **WHEN** a linkReference with targetType external-url contains a non-http(s) URL
- **THEN** schema validation fails with an error indicating only http/https URLs are supported

#### Scenario: Internal subsection link omits subsection identifier

- **WHEN** a linkReference with targetType internal-subsection omits the subsection identifier
- **THEN** schema validation fails with an error indicating subsection identifier is required
