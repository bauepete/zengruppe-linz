# Path Handling Specification

## Purpose

Provide one canonical, base-aware path behavior contract so navigation hrefs and active-link state remain consistent across deployment targets.

## Requirements

### Requirement: Shared path normalization

The system SHALL provide shared path normalization behavior that converts path inputs to canonical internal form using a leading slash and no trailing slash, except that the root path SHALL remain `/`.

#### Scenario: Root path remains canonical

- **WHEN** normalization receives `/`
- **THEN** the normalized result is `/`

#### Scenario: Non-root path is normalized

- **WHEN** normalization receives a path with extra leading or trailing slashes
- **THEN** the normalized result uses exactly one leading slash and no trailing slash

### Requirement: Canonical navigation page href generation

The system SHALL provide a shared function for navigation page href generation that respects the configured deployment base path and emits canonical page links.

#### Scenario: Root navigation href

- **WHEN** href generation is requested for the internal root page path `/`
- **THEN** the resulting href is the configured base root href

#### Scenario: Non-root navigation href

- **WHEN** href generation is requested for a non-root internal page path
- **THEN** the resulting href is base-aware and ends with a trailing slash

### Requirement: Base-aware active path evaluation

The system SHALL provide shared active-path evaluation that compares the current request pathname with internal page paths after removing any configured deployment base path prefix.

#### Scenario: Active match under non-root deployment base

- **WHEN** the current request pathname includes the configured deployment base prefix and points to an internal page path
- **THEN** active-path evaluation matches the corresponding internal page path

#### Scenario: Non-matching internal path

- **WHEN** the current request pathname resolves to a different internal page path
- **THEN** active-path evaluation does not match

### Requirement: pagePath compatibility

The system SHALL preserve existing `pagePath` behavior while introducing canonical navigation href generation as a separate helper.

#### Scenario: Existing pagePath caller behavior remains unchanged

- **WHEN** existing callers use `pagePath` with the same inputs as before this change
- **THEN** the returned outputs remain behaviorally unchanged
