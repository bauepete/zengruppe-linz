## Why

Path handling logic is currently split between shared utilities and local logic in navigation rendering. This duplication increases the risk of inconsistent href generation and active-link behavior across deployment base paths.

## What Changes

- Add shared path helpers in `src/utils/paths.ts` for path normalization, base-prefix stripping, canonical page href generation, and active-path comparison.
- Keep `pagePath()` behavior unchanged for compatibility with existing callers.
- Add a new `toPageHref()` helper dedicated to canonical navigation href output.
- Update navigation rendering to consume shared helpers instead of duplicating normalization and base-path logic.

## Capabilities

### New Capabilities

- `path-handling`: Defines canonical, base-aware page href and active-path behavior through shared utilities so navigation and future callers remain consistent.

### Modified Capabilities

- None.

## Impact

- Affects shared path utilities in `src/utils/paths.ts`.
- Affects navigation link rendering and active-state calculation in `src/components/Navigation.astro`.
- Reduces path logic duplication and centralizes deployment-base behavior in one utility module.
