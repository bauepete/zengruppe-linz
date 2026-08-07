import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";

import {
  planContentImageCleanup,
  runContentImageCleanup,
} from "../content-image-cleanup.mjs";

const createWorkspace = async () => {
  const workspaceRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "content-images-"),
  );

  await fs.mkdir(path.join(workspaceRoot, "src/content/pages/image/page-a"), {
    recursive: true,
  });
  await fs.mkdir(path.join(workspaceRoot, "src/content/pages/image/page-b"), {
    recursive: true,
  });
  await fs.mkdir(path.join(workspaceRoot, "public/images"), {
    recursive: true,
  });

  await fs.writeFile(
    path.join(workspaceRoot, "src/content/pages/page-a.md"),
    "![A](image/page-a/1786092079433.jpg)\n",
    "utf8",
  );

  await fs.writeFile(
    path.join(workspaceRoot, "src/content/pages/page-b.md"),
    "[![B](image/page-b/1786094326658.png)](https://example.org)\n",
    "utf8",
  );

  await fs.writeFile(
    path.join(
      workspaceRoot,
      "src/content/pages/image/page-a/1786092079433.jpg",
    ),
    "a",
    "utf8",
  );
  await fs.writeFile(
    path.join(workspaceRoot, "src/content/pages/image/page-a/orphan.jpg"),
    "orphan",
    "utf8",
  );
  await fs.writeFile(
    path.join(
      workspaceRoot,
      "src/content/pages/image/page-b/1786094326658.png",
    ),
    "b",
    "utf8",
  );
  await fs.writeFile(
    path.join(workspaceRoot, "src/content/pages/image/page-b/duplicate.jpg"),
    "dup",
    "utf8",
  );
  await fs.writeFile(
    path.join(workspaceRoot, "public/images/shared.jpg"),
    "shared",
    "utf8",
  );

  return workspaceRoot;
};

test("plans cleanup only inside src/content/pages/image and keeps randomized filenames referenced", async () => {
  const workspaceRoot = await createWorkspace();

  const plan = await planContentImageCleanup(workspaceRoot);

  assert.equal(plan.candidateImages.length, 4);
  assert.equal(plan.orphanedImages.length, 2);

  const orphanSet = new Set(
    plan.orphanedImages.map((item) => item.split(path.sep).join("/")),
  );
  assert.ok(
    orphanSet.has(
      `${workspaceRoot.replaceAll(path.sep, "/")}/src/content/pages/image/page-a/orphan.jpg`,
    ),
  );
  assert.ok(
    orphanSet.has(
      `${workspaceRoot.replaceAll(path.sep, "/")}/src/content/pages/image/page-b/duplicate.jpg`,
    ),
  );

  const referencedSet = new Set(
    plan.referencedImageFiles.map((item) => item.split(path.sep).join("/")),
  );
  assert.ok(
    referencedSet.has(
      `${workspaceRoot.replaceAll(path.sep, "/")}/src/content/pages/image/page-a/1786092079433.jpg`,
    ),
  );
  assert.ok(
    referencedSet.has(
      `${workspaceRoot.replaceAll(path.sep, "/")}/src/content/pages/image/page-b/1786094326658.png`,
    ),
  );
});

test("cleanup deletes only detected content-image orphans and never touches public assets", async () => {
  const workspaceRoot = await createWorkspace();

  const result = await runContentImageCleanup({ workspaceRoot, dryRun: false });

  assert.equal(result.deleted.length, 2);

  await assert.rejects(
    fs.access(
      path.join(workspaceRoot, "src/content/pages/image/page-a/orphan.jpg"),
    ),
  );

  await assert.rejects(
    fs.access(
      path.join(workspaceRoot, "src/content/pages/image/page-b/duplicate.jpg"),
    ),
  );

  await fs.access(path.join(workspaceRoot, "public/images/shared.jpg"));
});

test("dry run reports orphans but does not delete files", async () => {
  const workspaceRoot = await createWorkspace();

  const result = await runContentImageCleanup({ workspaceRoot, dryRun: true });

  assert.equal(result.deleted.length, 0);

  await fs.access(
    path.join(workspaceRoot, "src/content/pages/image/page-a/orphan.jpg"),
  );
  await fs.access(
    path.join(workspaceRoot, "src/content/pages/image/page-b/duplicate.jpg"),
  );
});
