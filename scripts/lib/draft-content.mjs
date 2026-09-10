/**
 * Detecting content that is still marked `draft: true`.
 *
 * Everything here is pure: no filesystem, no git, no network. The CLI in
 * ../check-draft-content.mjs supplies the outside world, which is what keeps
 * this file unit testable.
 */

/** Extensions the content collections are written in. */
export const CONTENT_EXTENSIONS = [".md", ".mdx"];

/** Directory the content collections live under. */
export const CONTENT_DIR = "src/content";

/** Identifies our own pull request comment so it can be updated in place. */
export const COMMENT_MARKER = "<!-- draft-content-check -->";

/**
 * YAML 1.2 accepts exactly `true`, `True` and `TRUE` as boolean true, which is
 * what Astro's frontmatter parser and the zod schema in src/content.config.ts
 * agree on. A quoted "true" is a string and would fail that schema, so it is
 * deliberately not matched here. A trailing `#` comment is allowed.
 */
const DRAFT_TRUE = /^draft:[ \t]*(?:true|True|TRUE)[ \t]*(?:#.*)?$/m;

/**
 * Returns the frontmatter block of a content file, or null when the file has
 * no frontmatter at all.
 *
 * Only the block at the very top of the file counts. A line reading
 * `draft: true` further down is prose, not a setting.
 *
 * @param {string} source Full text of the file.
 * @returns {string | null}
 */
export function extractFrontmatter(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  if (lines[0] !== "---") return null;

  const closing = lines.indexOf("---", 1);
  if (closing === -1) return null;

  return lines.slice(1, closing).join("\n");
}

/**
 * Whether a content file is marked as a draft.
 *
 * @param {string} source Full text of the file.
 * @returns {boolean}
 */
export function isDraft(source) {
  const frontmatter = extractFrontmatter(source);
  if (frontmatter === null) return false;
  return DRAFT_TRUE.test(frontmatter);
}

/**
 * Narrows a list of changed paths to the content files worth inspecting.
 *
 * @param {string[]} paths
 * @param {{dir?: string, extensions?: string[]}} [options]
 * @returns {string[]}
 */
export function selectContentFiles(paths, options = {}) {
  const dir = options.dir ?? CONTENT_DIR;
  const extensions = options.extensions ?? CONTENT_EXTENSIONS;
  const prefix = dir.endsWith("/") ? dir : `${dir}/`;

  return paths
    .map((path) => path.trim())
    .filter((path) => path.length > 0)
    .filter((path) => path.startsWith(prefix))
    .filter((path) => extensions.some((ext) => path.endsWith(ext)));
}

/**
 * Finds which of the given files are drafts.
 *
 * @param {string[]} paths
 * @param {(path: string) => string} readSource Reads a file's full text.
 * @returns {string[]} The subset of paths that are drafts, order preserved.
 */
export function findDrafts(paths, readSource) {
  return paths.filter((path) => isDraft(readSource(path)));
}

/**
 * Builds the pull request comment body.
 *
 * The marker on the first line is how the workflow finds a comment it has
 * already posted, so it can update that one instead of stacking new ones.
 *
 * @param {string[]} draftPaths
 * @returns {string}
 */
export function renderComment(draftPaths) {
  if (draftPaths.length === 0) {
    return [
      COMMENT_MARKER,
      "### ✅ No draft content",
      "",
      "Everything this pull request touches is set to publish on merge.",
      "",
    ].join("\n");
  }

  const one = draftPaths.length === 1;

  return [
    COMMENT_MARKER,
    "### 📝 Draft content in this pull request",
    "",
    `${one ? "This file is" : "These files are"} still marked \`draft: true\`:`,
    "",
    ...draftPaths.map((path) => `- \`${path}\``),
    "",
    `${one ? "It renders" : "They render"} in the Netlify deploy preview above, but the production`,
    `build leaves ${one ? "it" : "them"} out. Flip \`draft: false\` when this content should go`,
    "live on merge.",
    "",
    "Merging as-is is safe: nothing appears on the live site until the flag changes.",
    "",
  ].join("\n");
}

/**
 * Formats the `found` and `list` values for GitHub Actions' $GITHUB_OUTPUT.
 *
 * The list is multi-line, which that file format only supports through a
 * heredoc-style delimiter.
 *
 * @param {string[]} draftPaths
 * @param {string} [delimiter]
 * @returns {string}
 */
export function renderGithubOutput(draftPaths, delimiter = "DRAFTS_EOF") {
  return [
    `found=${draftPaths.length > 0}`,
    `list<<${delimiter}`,
    ...draftPaths,
    delimiter,
    "",
  ].join("\n");
}
