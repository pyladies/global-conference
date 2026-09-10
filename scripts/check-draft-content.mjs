#!/usr/bin/env node
/**
 * Reports content files that are still marked `draft: true`.
 *
 * Exit codes are the point of this script, and the workflow reads them:
 *
 *   0  no draft content
 *   1  draft content found
 *   2  the check itself could not run
 *
 * Usage:
 *   check-draft-content.mjs --base main
 *   check-draft-content.mjs src/content/posts/a-post.mdx ...
 *
 * Options:
 *   --base <ref>            Compare against this ref to find changed files.
 *                           Without it, files are taken from the arguments.
 *   --dir <path>            Content directory to inspect (default src/content).
 *   --comment-body <path>   Write the pull request comment body here.
 *   --github-output <path>  Append `found` and `list` for GitHub Actions.
 *   --json                  Print the result as JSON instead of plain text.
 *   --help                  Show this message.
 *
 * The logic lives in ./lib/draft-content.mjs so it can be unit tested. This
 * file is the part that touches git, the filesystem and stdout.
 */

import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

import {
  CONTENT_DIR,
  findDrafts,
  renderComment,
  renderGithubOutput,
  selectContentFiles,
} from "./lib/draft-content.mjs";

const EXIT_CLEAN = 0;
const EXIT_DRAFTS_FOUND = 1;
const EXIT_ERROR = 2;

const USAGE = `Usage: check-draft-content.mjs [--base <ref>] [options] [files...]

  --base <ref>            Compare against this ref to find changed files
  --dir <path>            Content directory to inspect (default ${CONTENT_DIR})
  --comment-body <path>   Write the pull request comment body here
  --github-output <path>  Append \`found\` and \`list\` for GitHub Actions
  --json                  Print the result as JSON
  --help                  Show this message

Exit codes: 0 no drafts, 1 drafts found, 2 error`;

/**
 * Lists files this branch adds or modifies relative to a base ref.
 *
 * Deletions are excluded: there is nothing left on disk to inspect, and a
 * removed draft is not something to warn about.
 *
 * @param {string} baseRef
 * @param {string} dir
 * @returns {string[]}
 */
function changedFilesSince(baseRef, dir) {
  const output = execFileSync(
    "git",
    ["diff", "--name-only", "--diff-filter=d", `${baseRef}...HEAD`, "--", dir],
    { encoding: "utf8" },
  );
  return output.split("\n");
}

function main(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        base: { type: "string" },
        dir: { type: "string" },
        "comment-body": { type: "string" },
        "github-output": { type: "string" },
        json: { type: "boolean", default: false },
        help: { type: "boolean", default: false },
      },
    });
  } catch (error) {
    process.stderr.write(`${error.message}\n\n${USAGE}\n`);
    return EXIT_ERROR;
  }

  const { values, positionals } = parsed;

  if (values.help) {
    process.stdout.write(`${USAGE}\n`);
    return EXIT_CLEAN;
  }

  const dir = values.dir ?? CONTENT_DIR;

  let candidates;
  try {
    candidates = values.base
      ? changedFilesSince(values.base, dir)
      : positionals;
  } catch (error) {
    process.stderr.write(`Could not list changed files: ${error.message}\n`);
    return EXIT_ERROR;
  }

  const contentFiles = selectContentFiles(candidates, { dir });

  let drafts;
  try {
    drafts = findDrafts(contentFiles, (path) => readFileSync(path, "utf8"));
  } catch (error) {
    process.stderr.write(`Could not read a content file: ${error.message}\n`);
    return EXIT_ERROR;
  }

  try {
    if (values["comment-body"]) {
      writeFileSync(values["comment-body"], renderComment(drafts), "utf8");
    }
    if (values["github-output"]) {
      appendFileSync(
        values["github-output"],
        renderGithubOutput(drafts),
        "utf8",
      );
    }
  } catch (error) {
    process.stderr.write(`Could not write output: ${error.message}\n`);
    return EXIT_ERROR;
  }

  if (values.json) {
    process.stdout.write(
      `${JSON.stringify({ inspected: contentFiles, drafts }, null, 2)}\n`,
    );
  } else if (drafts.length > 0) {
    process.stdout.write("Content still marked draft: true\n");
    for (const path of drafts) process.stdout.write(`  ${path}\n`);
    process.stdout.write(
      "\nFlip draft: false if this content should go live on merge.\n",
    );
  } else {
    process.stdout.write(
      `No draft content among ${contentFiles.length} inspected file(s).\n`,
    );
  }

  return drafts.length > 0 ? EXIT_DRAFTS_FOUND : EXIT_CLEAN;
}

process.exitCode = main(process.argv.slice(2));
