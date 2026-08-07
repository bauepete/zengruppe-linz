## Context

Current Markdown content pages are loaded from `src/content/pages/` and rendered through `src/components/ContentPage.astro` using Astro content rendering. Existing page content already includes Markdown image references (for example under `src/content/pages/image/<page>/...`) and accepts generated filenames. There is currently no explicit publication-step contract for identifying and removing orphaned content-image files. See `proposal.md` for motivation and `specs/content-images/spec.md` for behavior requirements.

## Goals / Non-Goals

**Goals:**

- Keep image authoring editor-friendly by preserving standard Markdown image syntax.
- Preserve compatibility with page-associated image directories and arbitrary editor-generated filenames.
- Add a deterministic, safe orphan-cleanup flow for content images as part of publication workflow.
- Keep presentation control in Astro templates/styles rather than content-authored HTML.

**Non-Goals:**

- Global media-library deduplication or cross-page canonicalization.
- Changes to unrelated shared static assets in `public/`.
- Introducing MDX or HTML-first authoring patterns for normal content images.

## Decisions

1. Define content-image scope by directory convention

- Decision: Treat content images as files under page-associated content image directories rooted in `src/content/pages/image/`.
- Rationale: Matches current repository layout and keeps cleanup boundaries explicit.
- Alternatives considered:
  - Infer scope from all image references across repository: rejected because it risks false positives in unrelated directories.
  - Move images to `public/` and reference from there: rejected because it leaks Astro path concerns into editor workflows.

2. Resolve image references from Markdown only

- Decision: Build the live-reference set for cleanup from Markdown image/link references in page content files.
- Rationale: Aligns with the requirement that editors use standard Markdown syntax and avoids parsing custom HTML conventions.
- Alternatives considered:
  - Parse rendered HTML output: rejected as more brittle and less transparent to content authors.

3. Cleanup uses conservative deletion rules

- Decision: Delete only files within content-image scope that are not referenced by any Markdown page after path normalization.
- Rationale: Satisfies safe cleanup requirements and protects shared/unrelated assets.
- Alternatives considered:
  - Aggressive deletion of all unreferenced images across `src/content`: rejected due to higher accidental deletion risk.
  - No automated cleanup: rejected because it leaves persistent orphan growth in editor-driven workflows.

4. Keep presentation ownership in Astro layer

- Decision: Continue handling alignment/wrapping through templates and CSS, not author-facing HTML requirements.
- Rationale: Maintains existing rendering architecture and separation of concerns.
- Alternatives considered:
  - Require HTML classes in content for image layout: rejected because it increases editor complexity and couples content to implementation details.

5. Cleanup execution and failure policy

- Decision: Run orphan cleanup in the publication/build workflow and expose the same logic as an optional local maintenance command.
- Rationale: Publication guarantees consistent output, while a local command supports editor feedback and repository hygiene between releases.
- Alternatives considered:
  - CI-only cleanup with no local command: rejected because local repositories can accumulate stale assets unnoticed.

6. Cleanup error handling

- Decision: Treat cleanup errors as non-fatal warnings by default, leaving files untouched on uncertain matches.
- Rationale: Prioritizes safety against accidental deletion and preserves successful publication when cleanup confidence is insufficient.
- Alternatives considered:
  - Fail publication on cleanup errors: rejected because it can block deployment for non-critical cleanup issues.

## Risks / Trade-offs

- [Risk] False orphan detection due to path-variant references (for example `./`, URL encoding, case differences). -> Mitigation: normalize and compare paths with a strict, documented rule set before deletion.
- [Risk] Accidentally deleting assets reused outside Markdown pages. -> Mitigation: restrict cleanup scope to content-image directories only and exclude `public/` and other shared asset roots.
- [Risk] Cleanup script drift from content conventions over time. -> Mitigation: codify conventions in tests using representative Markdown/image fixtures.

## Migration Plan

1. Introduce content-image reference collection from Markdown page sources.
2. Implement safe orphan detection limited to content-image scope.
3. Wire cleanup into publication workflow so stale content images are removed during publish/build.
4. Add tests covering generated filenames, duplicate files, referenced files, and protected shared assets.
5. Rollback strategy: disable cleanup step while keeping authoring and rendering behavior unchanged.

## Open Questions

- None.
