#!/usr/bin/env node
/**
 * Rates how smoothly each post's "description" frontmatter field reads, using an LLM via
 * OpenRouter, so the clumsy ones can be found and fixed by hand.
 *
 * This script is read-only: it never modifies a post. Each description is scored 1-5
 * (5 = reads naturally, 1 = clumsy or ungrammatical) with a one-sentence reason.
 *
 * Reads:
 *   scripts/.env  - OPENROUTER_API_KEY and MODEL_NAME
 *
 * Posts without a description are skipped. When the run ends (or is interrupted with Ctrl-C),
 * the posts scoring at or below the threshold are listed worst first, and every rating so far
 * is written to scripts/output/description-ratings.tsv (scripts/output is gitignored).
 *
 * Usage:
 *   node scripts/rate-descriptions.js <post-filename> [--threshold=N]
 *   node scripts/rate-descriptions.js --all [--threshold=N]
 *   node scripts/rate-descriptions.js npm-publishing-with-github   (.md is optional)
 *
 * --threshold=N  list posts scoring N or lower in the final summary (default 3)
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
  callLLM,
  runCli,
} = require('./lib/post-utils');

const RATE_PROMPT = `You are proofreading the meta descriptions of a personal tech blog. Each description is a headline-style fragment (a noun phrase or a gerund phrase, with no subject) used in search results and social media link previews.

Rate how smoothly the description reads as natural, grammatical English, from 1 to 5:
5 = reads naturally; a reader would not stumble
4 = fine, with a minor awkwardness
3 = understandable but clunky or choppy
2 = awkward: stacked nouns, a dangling participle, a clause that changes grammatical shape halfway, or an ambiguous reading
1 = ungrammatical or confusing

Judge fluency only. Do not judge whether it is interesting or accurate, and do not penalise a missing subject or an opening gerund, since that is the intended style.

Reply in exactly this format and nothing else:
SCORE: <1-5>
REASON: <one short sentence naming the specific problem, or "reads naturally">

Description to rate:

{{description}}
`;

const thresholdArg = process.argv.find(a => a.startsWith('--threshold='));
const THRESHOLD = thresholdArg ? Number(thresholdArg.split('=')[1]) : 3;
if (!Number.isFinite(THRESHOLD)) {
  console.error('--threshold must be a number, e.g. --threshold=3');
  process.exit(1);
}

const ALL = process.argv.includes('--all');
const fileArg = process.argv.slice(2).find(a => !a.startsWith('--'));

const config = loadConfig();
const OUTPUT_PATH = path.join(ROOT, 'scripts', 'output', 'description-ratings.tsv');

const results = [];

function parseRating(text) {
  const score = text.match(/SCORE:\s*([1-5])\b/i);
  const reason = text.match(/REASON:\s*(.+)/i);
  if (!score) throw new Error(`Could not parse a score from: ${text}`);
  return { score: Number(score[1]), reason: reason ? reason[1].trim() : '' };
}

async function processPost(postFilename) {
  const postPath = path.join(POSTS_DIR, postFilename);
  const { fmBlock } = splitFrontmatter(fs.readFileSync(postPath, 'utf-8'));

  const keys = parseBlocks(fmBlock).map(b => b.key);
  const description = keys.includes('description') ? getQuotedValue(fmBlock, 'description') : null;
  if (!description) {
    console.log(`Skipping ${postFilename}: no readable description`);
    return;
  }

  const reply = await callLLM(RATE_PROMPT.replace('{{description}}', description), config);
  const { score, reason } = parseRating(reply);
  results.push({ file: postFilename, score, reason, description });
  console.log(`${score}/5  ${postFilename}\n     ${description}\n     ${reason}`);
}

// Runs on normal exit and on Ctrl-C, so a long --all run that is interrupted still reports.
function report() {
  if (results.length === 0) return;

  const sorted = [...results].sort((a, b) => a.score - b.score || a.file.localeCompare(b.file));

  const flagged = sorted.filter(r => r.score <= THRESHOLD);
  console.log(`\n--- ${flagged.length} of ${results.length} rated post(s) scored ${THRESHOLD} or lower ---`);
  for (const r of flagged) {
    console.log(`\n${r.score}/5  ${r.file}\n     ${r.description}\n     ${r.reason}`);
  }

  const counts = [1, 2, 3, 4, 5].map(n => `${n}: ${results.filter(r => r.score === n).length}`);
  console.log(`\nScore distribution - ${counts.join('  ')}`);

  const clean = s => s.replace(/[\t\r\n]+/g, ' ');
  const tsv = ['score\tfile\tdescription\treason']
    .concat(sorted.map(r => [r.score, r.file, clean(r.description), clean(r.reason)].join('\t')))
    .join('\n');
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, tsv + '\n');
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}`);
}

process.on('SIGINT', () => process.exit(130));
process.on('exit', report);

runCli({
  all: ALL,
  fileArg,
  processPost,
  label: `model: ${config.MODEL_NAME}`,
  usage: [
    'node scripts/rate-descriptions.js <post-filename> [--threshold=N]',
    'node scripts/rate-descriptions.js --all [--threshold=N]',
  ],
});
