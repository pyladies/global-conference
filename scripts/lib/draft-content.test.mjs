import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  COMMENT_MARKER,
  extractFrontmatter,
  findDrafts,
  isDraft,
  renderComment,
  renderGithubOutput,
  selectContentFiles,
} from "./draft-content.mjs";

/** Builds a content file with the given frontmatter lines and body. */
function file(frontmatterLines, body = "Some body text.") {
  return ["---", ...frontmatterLines, "---", "", body, ""].join("\n");
}

describe("extractFrontmatter", () => {
  it("returns the block between the opening and closing fences", () => {
    const source = file(['title: "A post"', "draft: true"]);
    assert.equal(extractFrontmatter(source), 'title: "A post"\ndraft: true');
  });

  it("returns null when the file does not open with a fence", () => {
    assert.equal(extractFrontmatter("# Just a heading\n"), null);
  });

  it("returns null when the fence is never closed", () => {
    assert.equal(extractFrontmatter('---\ntitle: "Unclosed"\n'), null);
  });

  it("returns an empty string for an empty block", () => {
    assert.equal(extractFrontmatter("---\n---\nBody.\n"), "");
  });

  it("handles CRLF line endings", () => {
    const source = '---\r\ntitle: "A post"\r\ndraft: true\r\n---\r\nBody.\r\n';
    assert.equal(extractFrontmatter(source), 'title: "A post"\ndraft: true');
  });

  it("stops at the first closing fence, ignoring later ones", () => {
    const source = [
      "---",
      "draft: false",
      "---",
      "",
      "---",
      "draft: true",
      "",
    ].join("\n");
    assert.equal(extractFrontmatter(source), "draft: false");
  });
});

describe("isDraft", () => {
  it("detects draft: true", () => {
    assert.equal(isDraft(file(["draft: true"])), true);
  });

  it("tolerates extra spacing around the value", () => {
    assert.equal(isDraft(file(["draft:   true  "])), true);
  });

  it("accepts the YAML 1.2 boolean spellings", () => {
    for (const value of ["true", "True", "TRUE"]) {
      assert.equal(isDraft(file([`draft: ${value}`])), true, value);
    }
  });

  it("ignores a trailing YAML comment", () => {
    assert.equal(isDraft(file(["draft: true # publish after review"])), true);
  });

  it("returns false for draft: false", () => {
    assert.equal(isDraft(file(["draft: false"])), false);
  });

  it("returns false when there is no draft field", () => {
    assert.equal(isDraft(file(['title: "A post"'])), false);
  });

  // The reason extractFrontmatter exists: a post about drafts should not
  // trip the check by quoting `draft: true` in its own body.
  it("ignores draft: true appearing in the body", () => {
    const source = file(
      ["draft: false"],
      "Set this in frontmatter:\ndraft: true",
    );
    assert.equal(isDraft(source), false);
  });

  it("returns false for a quoted value, which the zod schema would reject anyway", () => {
    assert.equal(isDraft(file(['draft: "true"'])), false);
  });

  it("does not match a field that merely ends in draft", () => {
    assert.equal(isDraft(file(["is_draft: true"])), false);
  });

  it("returns false for a file with no frontmatter", () => {
    assert.equal(isDraft("draft: true\n"), false);
  });
});

describe("selectContentFiles", () => {
  it("keeps markdown files under the content directory", () => {
    const paths = [
      "src/content/posts/a-post.mdx",
      "src/content/docs/a-doc.md",
      "src/lib/contentParser.astro",
      "public/images/posts/hero.png",
      ".github/workflows/draft-content-check.yml",
    ];
    assert.deepEqual(selectContentFiles(paths), [
      "src/content/posts/a-post.mdx",
      "src/content/docs/a-doc.md",
    ]);
  });

  it("drops blank lines from git output", () => {
    assert.deepEqual(
      selectContentFiles(["src/content/posts/a.mdx", "", "  ", "\n"]),
      ["src/content/posts/a.mdx"],
    );
  });

  it("does not match a directory that merely shares a prefix", () => {
    assert.deepEqual(selectContentFiles(["src/contentParser/a.md"]), []);
  });

  it("honours a narrower directory", () => {
    const paths = ["src/content/posts/a.mdx", "src/content/docs/b.md"];
    assert.deepEqual(selectContentFiles(paths, { dir: "src/content/posts" }), [
      "src/content/posts/a.mdx",
    ]);
  });

  it("preserves input order", () => {
    const paths = ["src/content/posts/z.mdx", "src/content/posts/a.mdx"];
    assert.deepEqual(selectContentFiles(paths), paths);
  });
});

describe("findDrafts", () => {
  const sources = {
    "src/content/posts/draft.mdx": file(["draft: true"]),
    "src/content/posts/live.mdx": file(["draft: false"]),
    "src/content/posts/plain.mdx": file(['title: "No flag"']),
  };
  const read = (path) => sources[path];

  it("returns only the drafts", () => {
    assert.deepEqual(findDrafts(Object.keys(sources), read), [
      "src/content/posts/draft.mdx",
    ]);
  });

  it("returns an empty array when nothing is a draft", () => {
    const paths = ["src/content/posts/live.mdx", "src/content/posts/plain.mdx"];
    assert.deepEqual(findDrafts(paths, read), []);
  });

  it("returns an empty array for no input", () => {
    assert.deepEqual(findDrafts([], read), []);
  });
});

describe("renderComment", () => {
  it("starts with the marker so the comment can be found and updated", () => {
    for (const paths of [[], ["src/content/posts/a.mdx"]]) {
      assert.ok(renderComment(paths).startsWith(COMMENT_MARKER));
    }
  });

  it("lists every draft file", () => {
    const body = renderComment([
      "src/content/posts/a.mdx",
      "src/content/posts/b.mdx",
    ]);
    assert.match(body, /- `src\/content\/posts\/a\.mdx`/);
    assert.match(body, /- `src\/content\/posts\/b\.mdx`/);
  });

  it("says merging is safe, because it is", () => {
    assert.match(renderComment(["src/content/posts/a.mdx"]), /safe/);
  });

  it("uses singular wording throughout for one file", () => {
    const body = renderComment(["a/b.mdx"]);
    assert.match(body, /This file is/);
    assert.match(body, /It renders/);
    assert.match(body, /leaves it out/);
    assert.doesNotMatch(body, /These files|They render|leaves them/);
  });

  it("uses plural wording throughout for several files", () => {
    const body = renderComment(["a/b.mdx", "a/c.mdx"]);
    assert.match(body, /These files are/);
    assert.match(body, /They render/);
    assert.match(body, /leaves them out/);
    assert.doesNotMatch(body, /This file is|It renders|leaves it out/);
  });

  it("reports the all-clear when there are no drafts", () => {
    const body = renderComment([]);
    assert.match(body, /No draft content/);
    assert.doesNotMatch(body, /- `/);
  });
});

describe("renderGithubOutput", () => {
  it("reports found=false and an empty list when clean", () => {
    assert.equal(
      renderGithubOutput([]),
      "found=false\nlist<<DRAFTS_EOF\nDRAFTS_EOF\n",
    );
  });

  it("wraps a multi-line list in the delimiter", () => {
    assert.equal(
      renderGithubOutput(["a.mdx", "b.mdx"]),
      "found=true\nlist<<DRAFTS_EOF\na.mdx\nb.mdx\nDRAFTS_EOF\n",
    );
  });

  it("ends with a newline so appending twice cannot corrupt the file", () => {
    assert.ok(renderGithubOutput(["a.mdx"]).endsWith("\n"));
  });
});
