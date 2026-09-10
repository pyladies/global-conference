/**
 * Tests the CLI's contract with the workflow: exit codes, and the files it
 * writes for the comment and for $GITHUB_OUTPUT. The detection logic itself is
 * covered in lib/draft-content.test.mjs.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(
  new URL("./check-draft-content.mjs", import.meta.url),
);

const EXIT_CLEAN = 0;
const EXIT_DRAFTS_FOUND = 1;
const EXIT_ERROR = 2;

let workdir;

/** Writes a content file inside the temporary working directory. */
function write(relativePath, frontmatterLines) {
  const full = join(workdir, relativePath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(
    full,
    ["---", ...frontmatterLines, "---", "", "Body.", ""].join("\n"),
  );
  return relativePath;
}

/** Runs the CLI from the temporary directory and returns its result. */
function run(...args) {
  const result = spawnSync(process.execPath, [CLI, ...args], {
    cwd: workdir,
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

before(() => {
  workdir = mkdtempSync(join(tmpdir(), "draft-check-"));
  write("src/content/posts/a-draft.mdx", ['title: "Draft"', "draft: true"]);
  write("src/content/posts/b-live.mdx", ['title: "Live"', "draft: false"]);
  write("src/content/docs/c-draft.md", ['title: "Draft doc"', "draft: true"]);
});

after(() => {
  rmSync(workdir, { recursive: true, force: true });
});

describe("exit codes", () => {
  it("exits 0 when no file is a draft", () => {
    assert.equal(run("src/content/posts/b-live.mdx").status, EXIT_CLEAN);
  });

  it("exits 1 when a draft is present", () => {
    assert.equal(
      run("src/content/posts/a-draft.mdx").status,
      EXIT_DRAFTS_FOUND,
    );
  });

  it("exits 1 when only one of several files is a draft", () => {
    const result = run(
      "src/content/posts/b-live.mdx",
      "src/content/posts/a-draft.mdx",
    );
    assert.equal(result.status, EXIT_DRAFTS_FOUND);
  });

  it("exits 0 when given nothing to inspect", () => {
    assert.equal(run().status, EXIT_CLEAN);
  });

  it("exits 0 for --help", () => {
    const result = run("--help");
    assert.equal(result.status, EXIT_CLEAN);
    assert.match(result.stdout, /Usage:/);
  });

  it("exits 2 on an unknown option", () => {
    const result = run("--nonsense");
    assert.equal(result.status, EXIT_ERROR);
    assert.match(result.stderr, /Usage:/);
  });

  it("exits 2 when a listed file does not exist", () => {
    assert.equal(run("src/content/posts/missing.mdx").status, EXIT_ERROR);
  });

  it("exits 2 when --base names a ref git cannot resolve", () => {
    const result = run("--base", "no-such-ref-here");
    assert.equal(result.status, EXIT_ERROR);
    assert.match(result.stderr, /Could not list changed files/);
  });
});

describe("file filtering", () => {
  it("ignores files outside the content directory", () => {
    const result = run("astro.config.mjs", "src/lib/contentParser.astro");
    assert.equal(result.status, EXIT_CLEAN);
  });

  it("covers docs as well as posts", () => {
    assert.equal(run("src/content/docs/c-draft.md").status, EXIT_DRAFTS_FOUND);
  });

  it("can be narrowed to a single collection with --dir", () => {
    const result = run(
      "--dir",
      "src/content/posts",
      "src/content/docs/c-draft.md",
    );
    assert.equal(result.status, EXIT_CLEAN);
  });
});

describe("--json", () => {
  it("reports inspected files and the drafts among them", () => {
    const result = run(
      "--json",
      "src/content/posts/a-draft.mdx",
      "src/content/posts/b-live.mdx",
    );
    assert.equal(result.status, EXIT_DRAFTS_FOUND);
    assert.deepEqual(JSON.parse(result.stdout), {
      inspected: [
        "src/content/posts/a-draft.mdx",
        "src/content/posts/b-live.mdx",
      ],
      drafts: ["src/content/posts/a-draft.mdx"],
    });
  });
});

describe("--comment-body", () => {
  it("writes a body listing the draft", () => {
    const path = join(workdir, "comment-drafts.md");
    run("--comment-body", path, "src/content/posts/a-draft.mdx");
    const body = readFileSync(path, "utf8");
    assert.match(body, /^<!-- draft-content-check -->/);
    assert.match(body, /- `src\/content\/posts\/a-draft\.mdx`/);
  });

  it("writes an all-clear body when nothing is a draft", () => {
    const path = join(workdir, "comment-clean.md");
    run("--comment-body", path, "src/content/posts/b-live.mdx");
    assert.match(readFileSync(path, "utf8"), /No draft content/);
  });
});

describe("--github-output", () => {
  it("appends found=true and the draft list", () => {
    const path = join(workdir, "gh-output-drafts.txt");
    writeFileSync(path, "");
    run("--github-output", path, "src/content/posts/a-draft.mdx");
    assert.equal(
      readFileSync(path, "utf8"),
      "found=true\nlist<<DRAFTS_EOF\nsrc/content/posts/a-draft.mdx\nDRAFTS_EOF\n",
    );
  });

  it("appends found=false when clean", () => {
    const path = join(workdir, "gh-output-clean.txt");
    writeFileSync(path, "");
    run("--github-output", path, "src/content/posts/b-live.mdx");
    assert.match(readFileSync(path, "utf8"), /^found=false\n/);
  });

  it("appends rather than overwriting, leaving earlier entries intact", () => {
    const path = join(workdir, "gh-output-append.txt");
    writeFileSync(path, "existing=value\n");
    run("--github-output", path, "src/content/posts/b-live.mdx");
    assert.match(readFileSync(path, "utf8"), /^existing=value\nfound=false\n/);
  });
});
