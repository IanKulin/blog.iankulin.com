#!/usr/bin/env node
/**
 * Generates "summary" and "description" frontmatter fields for a post using an LLM via
 * OpenRouter, and inserts (or replaces) them in the post's frontmatter.
 *
 * The summary is a first-person 1-3 sentence blurb for the post listing. The description is
 * a single sentence of about 150 characters condensed from the summary, used for the
 * meta description and og:description tags.
 *
 * Reads:
 *   scripts/.env  - OPENROUTER_API_KEY and MODEL_NAME
 *
 * Posts that already have both fields are skipped unless --force is passed (which
 * regenerates both). A post with a summary but no description keeps its existing summary
 * (including any hand edits) and only gets a description generated from it.
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

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const ENV_PATH = path.join(__dirname, '.env');

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

const DESCRIPTION_PROMPT = `You are condensing the summary of a blog post into a meta description, used for search results and social media link previews.

Rules:
- Exactly one sentence, at most 150 characters. Shorter is fine.
- Keep the first-person point of view of the summary ("I ...").
- Keep the most useful specifics (technologies, the problem, the outcome); drop secondary details.
- Do not change facts or add information that is not in the summary.
- Plain prose only — no markdown formatting, no surrounding quotation marks, no leading label like "Description:".
- Output only the description text.

Summary to condense:

{{summary}}
`;

const MAX_DESCRIPTION_LENGTH = 160;

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const ALL = process.argv.includes('--all');
const fileArg = process.argv.slice(2).find(a => !a.startsWith('--'));

if (!ALL && !fileArg) {
  console.error('Usage: node scripts/add-summary.js <post-filename> [--dry-run] [--force]');
  console.error('       node scripts/add-summary.js --all [--dry-run] [--force]');
  process.exit(1);
}

try {
  process.loadEnvFile(ENV_PATH);
} catch {
  console.error(`Could not load ${path.relative(ROOT, ENV_PATH)}`);
  console.error('Create it with:\n  OPENROUTER_API_KEY=sk-or-...\n  MODEL_NAME=some/model-name');
  process.exit(1);
}

const { OPENROUTER_API_KEY, MODEL_NAME } = process.env;
if (!OPENROUTER_API_KEY || !MODEL_NAME) {
  console.error('scripts/.env must set both OPENROUTER_API_KEY and MODEL_NAME');
  process.exit(1);
}

// Split a post into its frontmatter block (lines between the `---` markers) and body.
function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error('No frontmatter found');
  return { fmBlock: match[1], body: raw.slice(match[0].length) };
}

// Group frontmatter lines into blocks keyed by their top-level YAML key, so multi-line
// values (lists, folded scalars) move together when a block is inserted, removed, or reordered.
function parseBlocks(fmBlock) {
  const blocks = [];
  for (const line of fmBlock.split('\n')) {
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):/);
    if (keyMatch) {
      blocks.push({ key: keyMatch[1], lines: [line] });
    } else if (blocks.length > 0) {
      blocks[blocks.length - 1].lines.push(line);
    }
  }
  return blocks;
}

function yamlQuote(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  const escaped = clean.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

// Read a top-level frontmatter value written by yamlQuote (a double-quoted scalar on one line).
function getQuotedValue(fmBlock, key) {
  const block = parseBlocks(fmBlock).find(b => b.key === key);
  if (!block) return null;
  const m = block.lines[0].match(/^[A-Za-z0-9_-]+:\s*"(.*)"\s*$/);
  if (!m) return null;
  return m[1].replace(/\\(["\\])/g, '$1');
}

function insertSummary(fmBlock, summaryText, descriptionText) {
  const blocks = parseBlocks(fmBlock).filter(b => b.key !== 'summary' && b.key !== 'description');
  const newBlocks = [
    { key: 'summary', lines: [`summary: ${yamlQuote(summaryText)}`] },
    { key: 'description', lines: [`description: ${yamlQuote(descriptionText)}`] },
  ];

  let insertAt = blocks.findIndex(b => b.key === 'slug');
  insertAt = insertAt === -1 ? blocks.length : insertAt + 1;

  blocks.splice(insertAt, 0, ...newBlocks);
  return blocks.map(b => b.lines.join('\n')).join('\n');
}

async function callLLM(prompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://blog.iankulin.com',
      'X-Title': 'blog.iankulin.com add-summary script',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error(`No content in OpenRouter response: ${JSON.stringify(data)}`);
  }
  return text;
}

async function generateSummary(postBody) {
  const prompt = SUMMARY_PROMPT.replace('{{content}}', postBody);
  return callLLM(prompt);
}

async function toFirstPerson(summary) {
  const prompt = FIRST_PERSON_PROMPT.replace('{{summary}}', summary);
  return callLLM(prompt);
}

async function toDescription(summary) {
  const prompt = DESCRIPTION_PROMPT.replace('{{summary}}', summary);
  const description = await callLLM(prompt);
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    console.warn(`Warning: description is ${description.length} chars (target ~150)`);
  }
  return description;
}

async function processPost(postFilename) {
  const postPath = path.join(POSTS_DIR, postFilename);
  const raw = fs.readFileSync(postPath, 'utf-8');
  const { fmBlock, body } = splitFrontmatter(raw);

  const keys = parseBlocks(fmBlock).map(b => b.key);
  const hasSummary = keys.includes('summary');
  const hasDescription = keys.includes('description');
  if (hasSummary && hasDescription && !FORCE) {
    console.log(`Skipping ${postFilename}: already has a summary and description (use --force to regenerate)`);
    return;
  }

  // Reuse the existing summary (it may have been hand-edited) unless --force or it can't be read.
  let summary = !FORCE && hasSummary ? getQuotedValue(fmBlock, 'summary') : null;

  if (summary) {
    console.log(`Using existing summary for ${postFilename}`);
  } else {
    console.log(`Generating summary for ${postFilename} (model: ${MODEL_NAME})...`);
    const draftSummary = await generateSummary(body);
    console.log(`Draft summary: ${draftSummary}`);

    console.log(`Rewriting summary in first person...`);
    summary = await toFirstPerson(draftSummary);
  }
  console.log(`Summary: ${summary}`);

  console.log(`Condensing summary into a description...`);
  const description = await toDescription(summary);
  console.log(`Description (${description.length} chars): ${description}`);

  const newFmBlock = insertSummary(fmBlock, summary, description);
  const newRaw = `---\n${newFmBlock}\n---\n${body}`;

  if (DRY_RUN) {
    console.log('(dry run, not writing)');
  } else {
    fs.writeFileSync(postPath, newRaw);
    console.log(`Updated ${path.relative(ROOT, postPath)}`);
  }
}

async function main() {
  if (ALL) {
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_')).sort();
    console.log(`Processing ${files.length} posts (model: ${MODEL_NAME})...\n`);

    let failures = 0;
    for (const file of files) {
      try {
        await processPost(file);
      } catch (err) {
        failures++;
        console.error(`Error processing ${file}: ${err.message}`);
      }
    }

    if (failures > 0) {
      console.error(`\n${failures} of ${files.length} post(s) failed`);
      process.exit(1);
    }
    return;
  }

  const postFilename = fileArg.endsWith('.md') ? fileArg : `${fileArg}.md`;
  if (postFilename.startsWith('_')) {
    console.error(`Skipping ${postFilename}: files starting with an underscore are not posts`);
    process.exit(1);
  }
  if (!fs.existsSync(path.join(POSTS_DIR, postFilename))) {
    console.error(`Post not found: content/posts/${postFilename}`);
    process.exit(1);
  }
  await processPost(postFilename);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
