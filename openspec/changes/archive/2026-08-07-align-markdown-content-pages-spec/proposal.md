## Why

The repository currently has implementation support for Markdown-authored content pages, but there is no dedicated main capability spec that defines this baseline behavior. Adding a minimal spec delta clarifies the current contract before any functional expansion.

## What Changes

- Add a new `markdown-content-pages` capability spec delta aligned to the current Astro implementation.
- Capture current behavior for content location, shared rendering, routing shape, Markdown-first authoring, frontmatter metadata, and rendering-layer responsibility.
- Implement rendering-layer external-link policy for Markdown content so http/https links open in a new browser tab/window with safe link attributes.

## Capabilities

### New Capabilities

- `markdown-content-pages`: Baseline contract for Markdown-authored site pages rendered by Astro.

### Modified Capabilities

- None.

## Impact

- Adds a new OpenSpec delta under `openspec/changes/` for later sync into main specs.
- Updates markdown rendering behavior in Astro configuration without requiring per-link changes in Markdown content files.
