## 1. Image Authoring Baseline

- [x] 1.1 Confirm Markdown page rendering accepts standard Markdown image syntax for normal content images without requiring HTML authoring.
- [x] 1.2 Document and enforce page-associated content-image directory scope (`src/content/pages/image/**`) used by Markdown page assets.
- [x] 1.3 Verify editor-generated/randomized filenames are accepted end-to-end in content references and publish output.

## 2. Orphan Detection and Cleanup

- [x] 2.1 Implement Markdown reference extraction for image targets across `src/content/pages/**/*.md`.
- [x] 2.2 Implement path normalization and matching logic for referenced assets versus files under content-image scope.
- [x] 2.3 Implement orphan detection that marks only safely unreferenced files within content-image scope as removable.
- [x] 2.4 Implement cleanup execution that deletes detected orphans while excluding shared or unrelated assets.
- [x] 2.5 Implement non-fatal warning behavior for cleanup uncertainties/errors so publish continues safely.

## 3. Workflow Integration

- [x] 3.1 Integrate orphan cleanup into the publication/build workflow.
- [x] 3.2 Add an optional local maintenance command that runs the same orphan-detection and cleanup logic.
- [x] 3.3 Ensure cleanup logs clearly report deleted files, skipped files, and warning conditions.

## 4. Verification

- [x] 4.1 Add tests/fixtures covering referenced images, removed-reference orphans, generated filenames, and duplicate files.
- [x] 4.2 Add tests proving files outside content-image scope (including shared site assets) are never deleted.
- [x] 4.3 Validate the change with `openspec validate --changes content-images --strict` and address any reported issues.
