## Why

Editors can already place images in Markdown, but image asset handling rules are not explicitly defined for editor-friendly workflows (page-local storage, generated filenames, and orphan cleanup boundaries). A clear capability contract is needed so non-technical editing tools can manage images safely without requiring Astro-specific knowledge.

## What Changes

- Define a content-image capability for Markdown pages that formalizes editor-facing image authoring and asset management behavior.
- Specify that standard content images are authored with normal Markdown image syntax.
- Specify support for page-associated image directories and editor-generated/randomized filenames.
- Specify that duplicate image files are acceptable and deduplication is not required.
- Specify that image presentation semantics remain owned by the Astro rendering layer, not authored as HTML in content.
- Specify safe orphan-image cleanup behavior for publication workflows, including boundaries that protect unrelated/shared assets.

## Capabilities

### New Capabilities

- `content-images`: Editor-friendly image authoring and lifecycle behavior for Markdown content pages, including safe orphan cleanup rules.

### Modified Capabilities

- None.

## Impact

- Affects Markdown content authoring guidance and asset lifecycle expectations for files under `src/content/pages/` and associated image folders.
- Introduces publication-workflow expectations for orphaned content-image cleanup without changing shared site asset handling.
- May require implementation updates in rendering and/or build pipeline scripts to satisfy cleanup guarantees.
