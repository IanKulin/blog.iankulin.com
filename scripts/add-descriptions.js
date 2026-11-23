#!/usr/bin/env node
/**
 * Generates the "description" frontmatter field for a post using an LLM via OpenRouter.
 *
 * The description is at most 125 characters, written as a headline-style fragment (a noun or
 * gerund phrase such as "Securing a Node.js app ...", with no "I" and no opening verb like
 * "Explains") condensed from the post's existing "summary" field, used for the meta description
 * and og:description tags. If the result has first-person wording or a verb opener, one rewrite
 * call is made.
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
- Aim for around 100 characters; never exceed 125. Shorter is fine, and it is better to drop a secondary detail than to squeeze or strain the grammar.
- End with a full stop.
- Write a headline-style fragment, like a magazine standfirst: either a noun phrase ("A Python CLI that ...") or a gerund phrase ("Securing ...", "Fixing ..."). Pick whichever reads most naturally.
- No subject and no conjugated opening verb: never start with "I", "Covers", "Explains", "Shows", "Describes" and the like, and never use "I" or any other first-person pronoun. The blog's author is implied.
- It must still read as grammatical English; do not drop words just to be short.
- Keep the most useful specifics (technologies, the problem, the outcome); drop secondary details.
- Do not change facts or add information that is not in the summary.
- Plain prose only — no markdown formatting, no surrounding quotation marks, no leading label like "Description:".
- Output only the description text.

Examples:

Summary: I explain SwiftUI's @Binding with a C pointer analogy and a code example where a parent passes @State to a subview via $.
Description: Explaining SwiftUI's @Binding with a C pointer analogy and a code example of a parent passing @State to a subview via $.

Summary: I write a Python CLI that converts bank CSV statements into Beancount transactions, including GST for Australian banks.
Description: A Python CLI that converts bank CSV statements into Beancount transactions, including GST for Australian banks.

Summary: I cover securing a Node.js web app on a VPS behind Nginx with basic auth, HTTPS, Fail2ban, SSH hardening, and Uptime Kuma monitoring.
Description: Securing a Node.js web app on a VPS behind Nginx with basic auth, HTTPS, Fail2ban, SSH hardening, and Uptime Kuma.

Summary: I hit an apt BADSIG error on Debian after a repository key changed, and fix it by refreshing the signing key.
Description: Fixing an apt BADSIG signature error on Debian by refreshing the repository signing key.

Summary: I compare three ways of animating a SwiftUI view and explain why one of them is better for my flag-guessing game.
Description: Three ways to animate a SwiftUI view, and why one suits a flag-guessing game best.

Summary to condense:

{{summary}}
`;

const MAX_DESCRIPTION_LENGTH = 125;

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const ALL = process.argv.includes('--all');
const fileArg = process.argv.slice(2).find(a => !a.startsWith('--'));

const config = loadConfig();

const FIRST_PERSON = /\b(I|I'm|I've|I'll|I'd|my|me|we|our)\b/;
const VERB_OPENER = /^(Covers?|Explains?|Shows?|Describes?|Walks?|Builds?|Writes?|Sets? up|Uses?|Looks?|Discusses|Details?|Demonstrates?|Introduces?|Compares?)\b/;

function needsRewrite(text) {
  return FIRST_PERSON.test(text) || VERB_OPENER.test(text);
}

const REWRITE_PROMPT = `Rewrite this blog post meta description as a headline-style fragment: a noun phrase or a gerund phrase ("Securing ...", "A Python CLI that ..."). It must have no subject, no first-person wording, and must not open with a conjugated verb like "Covers" or "Explains". Keep all facts, keep it grammatical, stay at most 125 characters, and output only the rewritten text.

Description:

{{description}}
`;

async function toDescription(summary) {
  let description = await callLLM(DESCRIPTION_PROMPT.replace('{{summary}}', summary), config);
  if (needsRewrite(description)) {
    console.log('First-person wording or verb opener found, rewriting...');
    description = await callLLM(REWRITE_PROMPT.replace('{{description}}', description), config);
    if (needsRewrite(description)) {
      console.warn('Warning: description still has first-person wording or a verb opener');
    }
  }
  description = description.replace(/[.\s]+$/, '') + '.';
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
