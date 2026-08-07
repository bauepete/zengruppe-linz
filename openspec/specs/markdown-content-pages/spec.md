# Markdown Content Pages Specification

## Purpose

Define the baseline behavior for Markdown-authored site pages rendered by Astro, while keeping presentation behavior in templates and layouts.

## Requirements

### Requirement: Content location

Page content SHALL live under `src/content/pages/`.

#### Scenario: Content collection source

- **WHEN** page entries are loaded for site content rendering
- **THEN** entries are sourced from Markdown files within `src/content/pages/`

### Requirement: Shared page rendering path

Astro SHALL render Markdown-backed site pages through shared rendering components rather than one dedicated page component per content page.

#### Scenario: Shared renderer is used

- **WHEN** a Markdown content page is requested
- **THEN** the route resolves the content entry and renders it through the shared content-page rendering component

### Requirement: Routing shape for Markdown content pages

Astro SHALL provide a shared dynamic routing mechanism for configured content-page slugs, while preserving a dedicated root route for the home page.

#### Scenario: Configured non-root page slug resolves

- **WHEN** a configured content-page slug is generated in static paths
- **THEN** the page is rendered via the shared dynamic route

#### Scenario: Home page resolves through dedicated root route

- **WHEN** the site root is requested
- **THEN** the home content entry is rendered via the root route using the same shared content rendering path

### Requirement: Standard Markdown authoring

Normal textual content SHALL use standard Markdown wherever possible.

Content files SHOULD remain usable in ordinary Markdown editors.

MDX, embedded HTML, or other implementation-specific syntax SHOULD be avoided unless required for behavior that cannot reasonably be represented in standard Markdown.

#### Scenario: Text content is authored in standard Markdown

- **WHEN** editors update ordinary text pages
- **THEN** headings, paragraphs, lists, emphasis, images, and links are authored using standard Markdown syntax

### Requirement: Frontmatter metadata

Frontmatter SHALL be used for structured page metadata and content attributes that are not convenient to express in Markdown body text.

#### Scenario: Page title metadata

- **WHEN** a content page defines page-level metadata
- **THEN** metadata such as title is expressed in frontmatter

### Requirement: Presentation responsibility

Content SHALL describe what is displayed rather than how it is displayed.

Astro SHALL remain responsible for visual presentation and site-specific rendering behavior.

#### Scenario: Rendering ownership

- **WHEN** Markdown content is rendered
- **THEN** layout, styling, and presentation behavior are applied by Astro templates/components

### Requirement: Link authoring and rendering policy ownership

Editors SHALL author links using standard Markdown link syntax.

Site-wide link behavior policy, such as opening external links in a new browser tab or window, SHALL be implemented by the Astro rendering layer when such policy is enabled, rather than being encoded per-link in Markdown content.

#### Scenario: Standard markdown link authoring

- **WHEN** an editor adds a link in page content
- **THEN** the link is authored using standard Markdown link syntax
