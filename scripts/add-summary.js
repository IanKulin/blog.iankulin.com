#!/usr/bin/env node
/**
 * Generates the "summary" frontmatter field for a post using an LLM via OpenRouter, and
 * inserts (or replaces) it in the post's frontmatter.
 *
 * The summary is a first-person 1-3 sentence blurb for the post listing. To generate the
 * meta description from the summary, run scripts/add-descriptions.js afterwards.
 *
 * Reads:
 *   scripts/.env  - OPENROUTER_API_KEY and MODEL_NAME
 *
 * Posts that already have a summary are skipped unless --force is passed. Note that --force
 * does not touch the description; re-run add-descriptions.js --force to refresh it.
 * Pass --all instead of a filename to process every post in content/posts.
 *
 * Usage:
 *   node scripts/add-summary.js <post-filename> [--dry-run] [--force]
 *   node scripts/add-summary.js --all [--dry-run] [--force]
 *   node scripts/add-summary.js npm-publishing-with-github.md
 *   node scripts/add-summary.js npm-publishing-with-github   (.md is optional)
 */

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  POSTS_DIR,
  loadConfig,
  splitFrontmatter,
  parseBlocks,
  setField,
  callLLM,
  runCli,
} = require('./lib/post-utils');

const SUMMARY_PROMPT = `You are writing a one-to-three sentence summary of a blog post, to be shown in the post-listing page of a personal tech blog covering iOS dev, web dev, and homelab topics. The purpose is to enable a reader to determine if this is a post they are interested in.

Rules:
- 1-3 sentences, no more than about 100 words total. Short posts only need a short summary.
- Plain prose only — no markdown formatting, no surrounding quotation marks, no leading label like "Summary:".
- Matter-of-fact tone. Describe what the post covers, don't write it as if it's part of the post itself, and don't try and 'sell' the post.
- Do not start with "This post" or "In this post".
- It's a summary, not a blow-by-blow listing. There shouldn't be multiple occurrences of "then..."
- Base it only on the content below — do not invent details.

Post content:

{{content}}
`;

const FIRST_PERSON_PROMPT = `You are rewriting the summary of a blog post so that it is written from the author's own point of view, in first person, instead of third person.

Rules:
- Change only the point of view — e.g. "the author", "he", "she", "they" becomes "I", "my", "me".
- Do not change any facts, details, or meaning. Do not add or remove information.
- Adjust grammar as needed so the result reads naturally in first person (e.g. "The author compares X and Y" becomes "I compare X and Y").
- Plain prose only — no markdown formatting, no surrounding quotation marks, no leading label like "Summary:".
- Output only the rewritten summary text.

Summary to rewrite:

{{summary}}
`;

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const ALL = process.argv.includes('--all');
const fileArg = process.argv.slice(2).find(a => !a.startsWith('--'));

const config = loadConfig();

async function processPost(postFilename) {
  const postPath = path.join(POSTS_DIR, postFilename);
  const raw = fs.readFileSync(postPath, 'utf-8');
  const { fmBlock, body } = splitFrontmatter(raw);

  const keys = parseBlocks(fmBlock).map(b => b.key);
  if (keys.includes('summary') && !FORCE) {
    console.log(`Skipping ${postFilename}: already has a summary (use --force to regenerate)`);
    return;
  }

  console.log(`Generating summary for ${postFilename} (model: ${config.MODEL_NAME})...`);
  const draftSummary = await callLLM(SUMMARY_PROMPT.replace('{{content}}', body), config);
  console.log(`Draft summary: ${draftSummary}`);

  console.log(`Rewriting summary in first person...`);
  const summary = await callLLM(FIRST_PERSON_PROMPT.replace('{{summary}}', draftSummary), config);
  console.log(`Summary: ${summary}`);

  if (keys.includes('description')) {
    console.log(`Note: description left unchanged (run add-descriptions.js --force to refresh it)`);
  }

  const newFmBlock = setField(fmBlock, 'summary', summary, ['slug']);
  const newRaw = `---\n${newFmBlock}\n---\n${body}`;

  if (DRY_RUN) {
    console.log('(dry run, not writing)');
  } else {
    fs.writeFileSync(postPath, newRaw);
    console.log(`Updated ${path.relative(ROOT, postPath)}`);
  }
}

runCli({
  all: ALL,
  fileArg,
  processPost,
  label: `model: ${config.MODEL_NAME}`,
  usage: [
    'node scripts/add-summary.js <post-filename> [--dry-run] [--force]',
    'node scripts/add-summary.js --all [--dry-run] [--force]',
  ],
});
