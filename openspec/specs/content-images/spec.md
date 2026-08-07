# Content Images Specification

## Purpose

Define editor-friendly rules for authoring and managing Markdown content images so editors can work without Astro internals while publication remains safe and maintainable.

## Requirements

### Requirement: Standard Markdown image authoring

The system SHALL support normal content images authored with standard Markdown image syntax wherever image behavior can be represented without HTML.

#### Scenario: Editor inserts a normal content image

- **WHEN** an editor adds an image to a Markdown page body
- **THEN** the image is authored using standard Markdown image syntax

### Requirement: Page-associated image storage and filename tolerance

The system SHALL support page-associated image directories for Markdown pages and SHALL tolerate editor-generated filenames, including randomized filenames.

#### Scenario: Editor uploads image with generated filename

- **WHEN** a Markdown page references an image stored in its associated image directory using a generated filename
- **THEN** the image reference is treated as valid content input without requiring filename normalization

### Requirement: No deduplication requirement for content images

The system SHALL NOT require deduplication of content-image files.

#### Scenario: Same source image exists in multiple page image folders

- **WHEN** equivalent image binaries are stored in multiple page-associated image directories
- **THEN** publication and rendering workflows continue without deduplication preconditions

### Requirement: Rendering-layer ownership of image presentation

The system SHALL keep image presentation behavior in the Astro rendering layer, and editors SHALL NOT be required to author HTML to control image alignment or wrapping.

#### Scenario: Editor controls content but not presentation HTML

- **WHEN** an editor adds an image in Markdown content
- **THEN** rendering templates and styles determine presentation details such as alignment and text wrapping

### Requirement: Safe orphaned content-image cleanup

The publication workflow SHALL support automated cleanup of orphaned content-image assets that are no longer referenced by Markdown content.
Cleanup SHALL only evaluate files under `/src/content/pages/image/` for orphan detection and deletion.
Cleanup SHALL only remove files that can be safely identified as unreferenced content assets and SHALL NOT remove shared or unrelated site assets.
Cleanup SHALL NEVER delete files under `/public/`.

#### Scenario: Removed image reference leaves file behind

- **WHEN** a Markdown image reference is deleted and the previous image file remains in a page-associated content image directory
- **THEN** publication cleanup removes the file only if it is safely identified as unreferenced content asset

#### Scenario: Shared site asset is not a content orphan

- **WHEN** a file outside content-image scope or identified as shared asset is unreferenced by a specific page
- **THEN** cleanup does not delete that file

#### Scenario: Public assets are always excluded from cleanup

- **WHEN** orphan cleanup runs and finds unreferenced files under `/public/`
- **THEN** no file under `/public/` is considered orphaned content image for deletion
