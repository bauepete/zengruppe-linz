## 1. Content schema

- [x] 1.1 Extend the pages content schema to support title, introText, heroImage, heroImageAlt, sectionTitle, subsectionTitle, bodyParagraphs, unorderedList, orderedList, and linkReferences.
- [x] 1.2 Add validation rules: require title, require heroImageAlt when heroImage exists, require at least one populated content block among bodyParagraphs, unorderedList, and orderedList, and validate linkReferences per target type.
- [x] 1.3 Define which fields are Markdown-capable versus plain text and document this mapping in code comments or schema descriptions.
- [x] 1.4 Restrict external linkReferences to http/https URLs and require page/subsection identifiers for internal reference types.

## 2. Rendering contract

- [x] 2.1 Implement or adapt a narrative page renderer that maps structured fields to semantic HTML output.
- [x] 2.2 Render unorderedList as ul/li and orderedList as ol/li in deterministic template order when present.
- [x] 2.3 Ensure hero image rendering uses existing asset path handling and applies heroImageAlt to the image alt attribute.
- [x] 2.4 Render linkReferences as semantic links for internal pages, internal subsections, and external URLs.

## 3. First-page migration

- [x] 3.1 Create a structured content entry for leere-wolke using the new field contract.
- [x] 3.2 Update the leere-wolke route to load and render the new structured entry via the narrative renderer.
- [x] 3.3 Add representative linkReferences in the leere-wolke entry for internal-page, internal-subsection, and external-url cases.
- [x] 3.4 Verify legacy page behavior remains unchanged for non-migrated pages.

## 4. Validation and editor workflow checks

- [x] 4.1 Run the project build and confirm all routes generate successfully.
- [x] 4.2 Add a negative validation check for missing heroImageAlt when heroImage is set and confirm it fails as expected.
- [x] 4.3 Confirm that inline Markdown emphasis in Markdown-capable fields renders correctly in the output page.
- [x] 4.4 Add a negative validation check for external URLs with unsupported schemes and confirm it fails as expected.
- [x] 4.5 Verify that internal-page and internal-subsection links resolve to correct href output.

## Cleanup

- [ ] C.1 Make `template: structured-narrative` required for structured narrative entries in the schema and remove the implicit fallback behavior.
- [ ] C.2 Decide and document whether `pageType` should remain supported; if yes, add it explicitly to the spec, otherwise remove it from implementation.
- [ ] C.3 Align OpenSpec artifacts on quote support by ensuring proposal/tasks/spec text consistently document `type: quote` and optional `author`.
- [ ] C.4 Specify and verify inline link normalization behavior (supported forms, unsupported-form handling, and base-path-safe resolution) in spec scenarios.
