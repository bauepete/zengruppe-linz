## 1. Shared path helpers

- [x] 1.1 Add canonical internal path normalization helper(s) to `src/utils/paths.ts`.
- [x] 1.2 Add base-prefix stripping helper for request pathname handling in `src/utils/paths.ts`.
- [x] 1.3 Add `toPageHref` helper that emits canonical base-aware navigation hrefs (root and non-root behavior).
- [x] 1.4 Add active-path comparison helper that uses shared normalization/base-stripping behavior.
- [x] 1.5 Confirm `pagePath` behavior remains unchanged while introducing new helpers.

## 2. Navigation refactor

- [x] 2.1 Replace local normalization and base-prefix logic in `src/components/Navigation.astro` with shared path helpers.
- [x] 2.2 Replace local href shaping in `src/components/Navigation.astro` with `toPageHref`.
- [x] 2.3 Replace local active-route comparison in `src/components/Navigation.astro` with shared active-path helper.

## 3. Verification

- [x] 3.1 Validate generated navigation hrefs for root and non-root pages under development, staging, and production base configurations.
- [x] 3.2 Validate active-link highlighting behavior with and without a base-path prefix in the current request pathname.
- [x] 3.3 Run project build and verify no regressions in routed pages.
