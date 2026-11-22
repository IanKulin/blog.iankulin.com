#!/usr/bin/env node
/**
 * Generates the "description" frontmatter field for a post using an LLM via OpenRouter.
 *
 * The description is a single sentence of at most 125 characters condensed from the post's
 * existing "summary" field, used for the meta description and og:description tags.
 * Run scripts/add-summary.js first to create the summary.
 *
 * Reads:
 *   scripts/.env  - OPENROUTER_API_KEY and MODEL_NAME
 *
 * Posts that already have a description are skipped unless --force is passed. Posts
 * without a summary are skipped. The summary itself is never modified.
 * Pass --all instead of a filename to process every post in content/posts.
 *
 * Usage:
 *   node scripts/add-descriptions.js <post-filename> [--dry-run] [--force]
 *   node scripts/add-descriptions.js --all [--dry-run] [--force]
 *   node scripts/add-descriptions.js npm-publishing-with-github   (.md is optional)
 */

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  POSTS_DIR,
  loadConfig,
  splitFrontmatter,
  parseBlocks,
  getQuotedValue,
  setField,
  callLLM,
  runCli,
} = require('./lib/post-utils');

const DESCRIPTION_PROMPT = `You are condensing the summary of a blog post into a meta description, used for search results and social media link previews.

Rules:
- Exactly one sentence, at most 125 characters. Shorter is fine.
- Keep the first-person point of view of the summary ("I ...").
- Keep the most useful specifics (technologies, the problem, the outcome); drop secondary details.
- Do not change facts or add information that is not in the summary.
- Plain prose only — no markdown formatting, no surrounding quotation marks, no leading label like "Description:".
- Output only the description text.

Summary to condense:

{{summary}}
`;

const MAX_DESCRIPTION_LENGTH = 125;

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const ALL = process.argv.includes('--all');
const fileArg = process.argv.slice(2).find(a => !a.startsWith('--'));

const config = loadConfig();

async function toDescription(summary) {
  const description = await callLLM(DESCRIPTION_PROMPT.replace('{{summary}}', summary), config);
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    console.warn(`Warning: description is ${description.length} chars (max 125)`);
  }
  return description;
}

async function processPost(postFilename) {
  const postPath = path.join(POSTS_DIR, postFilename);
  const raw = fs.readFileSync(postPath, 'utf-8');
  const { fmBlock, body } = splitFrontmatter(raw);

  const keys = parseBlocks(fmBlock).map(b => b.key);
  if (keys.includes('description') && !FORCE) {
    console.log(`Skipping ${postFilename}: already has a description (use --force to regenerate)`);
    return;
  }

  const summary = keys.includes('summary') ? getQuotedValue(fmBlock, 'summary') : null;
  if (!summary) {
    console.log(`Skipping ${postFilename}: no readable summary (run add-summary.js first)`);
    return;
  }

  console.log(`Condensing summary of ${postFilename} into a description (model: ${config.MODEL_NAME})...`);
  const description = await toDescription(summary);
  console.log(`Description (${description.length} chars): ${description}`);

  const newFmBlock = setField(fmBlock, 'description', description, ['summary', 'slug']);
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
    'node scripts/add-descriptions.js <post-filename> [--dry-run] [--force]',
    'node scripts/add-descriptions.js --all [--dry-run] [--force]',
  ],
});
