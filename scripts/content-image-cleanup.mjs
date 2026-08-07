import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const MARKDOWN_ROOT = "src/content/pages";
const IMAGE_ROOT = "src/content/pages/image";
const PUBLIC_ROOT = "public";
const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\(([^)]+)\)/g;

const toPosix = (value) => value.replaceAll(path.sep, "/");

const hasProtocol = (value) => /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value);

const normalizeReference = (rawReference) => {
  const trimmed = rawReference.trim();

  if (!trimmed) {
    return { kind: "invalid", value: "", reason: "empty image reference" };
  }

  const unwrapped =
    trimmed.startsWith("<") && trimmed.endsWith(">")
      ? trimmed.slice(1, -1).trim()
      : trimmed;

  if (!unwrapped) {
    return { kind: "invalid", value: "", reason: "empty image reference" };
  }

  if (hasProtocol(unwrapped) || unwrapped.startsWith("//")) {
    return { kind: "external", value: unwrapped };
  }

  if (unwrapped.startsWith("#") || unwrapped.startsWith("/")) {
    return { kind: "outside", value: unwrapped };
  }

  const withoutTitle = unwrapped.split(/\s+"/)[0].trim();

  if (!withoutTitle) {
    return { kind: "invalid", value: unwrapped, reason: "empty image path" };
  }

  return { kind: "relative", value: withoutTitle };
};

const listFilesRecursive = async (rootDir) => {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const abs = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(abs)));
      continue;
    }

    if (entry.isFile()) {
      files.push(abs);
    }
  }

  return files;
};

const getMarkdownFiles = async (workspaceRoot) => {
  const markdownRoot = path.join(workspaceRoot, MARKDOWN_ROOT);
  return (await listFilesRecursive(markdownRoot)).filter((filePath) =>
    filePath.endsWith(".md"),
  );
};

const extractImageReferencesFromMarkdown = (markdownSource) => {
  const references = [];

  for (const match of markdownSource.matchAll(MARKDOWN_IMAGE_REGEX)) {
    const target = match[1];
    if (target) {
      references.push(target);
    }
  }

  return references;
};

const isWithin = (candidatePath, rootPath) => {
  const relative = path.relative(rootPath, candidatePath);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
};

const gatherReferencedImageFiles = async (workspaceRoot, markdownFiles) => {
  const imageRootAbs = path.resolve(workspaceRoot, IMAGE_ROOT);
  const referencedImageFiles = new Set();
  const skippedReferences = [];
  const warnings = [];

  for (const markdownFile of markdownFiles) {
    const source = await fs.readFile(markdownFile, "utf8");
    const references = extractImageReferencesFromMarkdown(source);

    for (const reference of references) {
      const normalized = normalizeReference(reference);

      if (normalized.kind === "invalid") {
        warnings.push(
          `Warning: ${toPosix(path.relative(workspaceRoot, markdownFile))} has invalid image reference '${reference}' (${normalized.reason}).`,
        );
        continue;
      }

      if (normalized.kind !== "relative") {
        skippedReferences.push({
          file: markdownFile,
          reference,
          reason:
            normalized.kind === "external"
              ? "external reference"
              : "outside content-image scope",
        });
        continue;
      }

      const resolvedPath = path.resolve(
        path.dirname(markdownFile),
        normalized.value,
      );
      const decodedResolvedPath = path.resolve(
        path.dirname(markdownFile),
        decodeURIComponent(normalized.value),
      );

      const candidates = [resolvedPath, decodedResolvedPath];
      let matched = false;

      for (const candidateAbs of candidates) {
        if (!isWithin(candidateAbs, imageRootAbs)) {
          continue;
        }

        referencedImageFiles.add(path.normalize(candidateAbs));
        matched = true;
      }

      if (!matched) {
        skippedReferences.push({
          file: markdownFile,
          reference,
          reason: "outside content-image scope",
        });
      }
    }
  }

  return { referencedImageFiles, skippedReferences, warnings };
};

const listCandidateContentImages = async (workspaceRoot) => {
  const imageRootAbs = path.resolve(workspaceRoot, IMAGE_ROOT);

  try {
    const imageFiles = await listFilesRecursive(imageRootAbs);

    return imageFiles
      .filter((filePath) => {
        const baseName = path.basename(filePath);
        const extension = path.extname(baseName).toLowerCase();
        return !baseName.startsWith(".") && IMAGE_EXTENSIONS.has(extension);
      })
      .map((filePath) => path.normalize(filePath));
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
};

export const planContentImageCleanup = async (
  workspaceRoot = process.cwd(),
) => {
  const rootAbs = path.resolve(workspaceRoot);
  const markdownFiles = await getMarkdownFiles(rootAbs);
  const { referencedImageFiles, skippedReferences, warnings } =
    await gatherReferencedImageFiles(rootAbs, markdownFiles);
  const candidateImages = await listCandidateContentImages(rootAbs);

  const orphanedImages = candidateImages.filter(
    (filePath) => !referencedImageFiles.has(path.normalize(filePath)),
  );

  return {
    workspaceRoot: rootAbs,
    imageRoot: path.resolve(rootAbs, IMAGE_ROOT),
    publicRoot: path.resolve(rootAbs, PUBLIC_ROOT),
    markdownFiles,
    referencedImageFiles: [...referencedImageFiles],
    candidateImages,
    orphanedImages,
    skippedReferences,
    warnings,
  };
};

const formatWorkspaceRelative = (workspaceRoot, absPath) =>
  toPosix(path.relative(workspaceRoot, absPath));

const deleteOrphanedFiles = async (workspaceRoot, orphanedImages) => {
  const deleted = [];
  const warnings = [];

  for (const filePath of orphanedImages) {
    try {
      await fs.unlink(filePath);
      deleted.push(filePath);
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "unknown error";
      warnings.push(
        `Warning: failed to delete ${formatWorkspaceRelative(workspaceRoot, filePath)} (${message}).`,
      );
    }
  }

  return { deleted, warnings };
};

const parseArgs = (argv) => {
  const args = new Set(argv.slice(2));
  return {
    dryRun: args.has("--dry-run"),
  };
};

const logSummary = ({
  workspaceRoot,
  imageRoot,
  publicRoot,
  markdownFiles,
  candidateImages,
  orphanedImages,
  deleted,
  skippedReferences,
  warnings,
  dryRun,
}) => {
  console.log("Content image cleanup");
  console.log(`Scope: ${formatWorkspaceRelative(workspaceRoot, imageRoot)}/**`);
  console.log(
    `Excluded: ${formatWorkspaceRelative(workspaceRoot, publicRoot)}/**`,
  );
  console.log(`Markdown scanned: ${markdownFiles.length}`);
  console.log(`Candidate images: ${candidateImages.length}`);
  console.log(`Orphans detected: ${orphanedImages.length}`);

  if (deleted.length > 0) {
    console.log(`Deleted: ${deleted.length}`);
    for (const deletedPath of deleted) {
      console.log(`  - ${formatWorkspaceRelative(workspaceRoot, deletedPath)}`);
    }
  } else if (!dryRun) {
    console.log("Deleted: 0");
  }

  if (dryRun) {
    console.log("Dry run: no files were deleted.");
  }

  if (skippedReferences.length > 0) {
    console.log(`Skipped references: ${skippedReferences.length}`);
    for (const skipped of skippedReferences) {
      console.log(
        `  - ${toPosix(path.relative(workspaceRoot, skipped.file))}: '${skipped.reference}' (${skipped.reason})`,
      );
    }
  } else {
    console.log("Skipped references: 0");
  }

  if (warnings.length > 0) {
    console.warn(`Warnings: ${warnings.length}`);
    for (const warning of warnings) {
      console.warn(`  - ${warning}`);
    }
  } else {
    console.log("Warnings: 0");
  }
};

export const runContentImageCleanup = async ({
  workspaceRoot = process.cwd(),
  dryRun = false,
} = {}) => {
  const plan = await planContentImageCleanup(workspaceRoot);

  const deletionResult = dryRun
    ? { deleted: [], warnings: [] }
    : await deleteOrphanedFiles(plan.workspaceRoot, plan.orphanedImages);

  const warnings = [...plan.warnings, ...deletionResult.warnings];

  logSummary({
    workspaceRoot: plan.workspaceRoot,
    imageRoot: plan.imageRoot,
    publicRoot: plan.publicRoot,
    markdownFiles: plan.markdownFiles,
    candidateImages: plan.candidateImages,
    orphanedImages: plan.orphanedImages,
    deleted: deletionResult.deleted,
    skippedReferences: plan.skippedReferences,
    warnings,
    dryRun,
  });

  return {
    ...plan,
    deleted: deletionResult.deleted,
    warnings,
  };
};

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  const { dryRun } = parseArgs(process.argv);

  runContentImageCleanup({ dryRun }).catch((error) => {
    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "unknown error";

    console.warn(`Warning: content image cleanup failed (${message}).`);
    process.exitCode = 0;
  });
}
