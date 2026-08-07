## Context

See proposal.md for motivation. The current codebase already exposes shared base/path helpers in `src/utils/paths.ts`, while `src/components/Navigation.astro` duplicates normalization, base-prefix stripping, href shaping, and active-state comparison logic locally.

## Goals / Non-Goals

**Goals:**

- Establish one source of truth for base-aware path normalization and navigation href behavior.
- Keep `pagePath` behavior stable for compatibility.
- Make `Navigation.astro` a thin consumer of shared path helpers.

**Non-Goals:**

- Changing markdown content authoring behavior.
- Changing routing structure or page slug allowlist.
- Introducing image gallery behavior or other unrelated rendering features.

## Decisions

1. Add shared helpers to `src/utils/paths.ts` for:
   - canonical internal path normalization,
   - base-prefix stripping from request pathname,
   - canonical navigation href generation (`toPageHref`),
   - base-aware active-path comparison.

   Why: these rules are reused and are currently duplicated in navigation.
   Alternative considered: keep helper logic inside `Navigation.astro`. Rejected because behavior would remain scattered and harder to keep consistent.

2. Preserve `pagePath` behavior and semantics as-is.

   Why: avoids breaking existing callers and respects current usage assumptions.
   Alternative considered: repurpose `pagePath` as canonical navigation href output. Rejected because it risks subtle regressions for existing consumers.

3. Move navigation path decisions to shared helpers and keep item definitions local to `Navigation.astro`.

   Why: keeps component intent clear (what to render) while path policy stays centralized (how URLs are formed/matched).
   Alternative considered: move nav item definitions into utilities. Rejected because item labels/order are presentation concerns.

## Risks / Trade-offs

- [Risk] Behavioral drift if helper semantics are interpreted differently by future callers.
  Mitigation: define normative requirements and scenarios in the path-handling spec.

- [Risk] Trailing-slash behavior differences may surface in edge paths.
  Mitigation: include explicit root and non-root scenarios and verify output in all deployment targets.

- [Risk] Refactor may unintentionally alter active-link highlighting.
  Mitigation: ensure active-path comparison uses the same normalized internal-path model as href generation.

## Migration Plan

1. Add new path helpers in `src/utils/paths.ts` without altering `pagePath` behavior.
2. Refactor `src/components/Navigation.astro` to consume shared helpers and remove duplicated logic.
3. Validate generated navigation hrefs and active-link states for development, staging, and production base configurations.
4. Roll back by restoring previous navigation-local path logic if regressions are found.

## Open Questions

None.
