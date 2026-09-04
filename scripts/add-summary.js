#!/usr/bin/env node
/**
 * Generates a "summary" frontmatter field for a post using an LLM via OpenRouter,
 * and inserts (or replaces) it in the post's frontmatter.
 *
 * Reads:
 *   scripts/.env       - OPENROUTER_API_KEY and MODEL_NAME
 *   scripts/prompt.md  - prompt template, with {{content}} replaced by the post body
 *
 * Posts that already have a summary are skipped unless --force is passed.
 * Pass "*" instead of a filename to process every post in content/posts.
 *
 * Usage:
 *   node scripts/add-summary.js <post-filename|*> [--dry-run] [--force]
 *   node scripts/add-summary.js npm-publishing-with-github.md
 *   node scripts/add-summary.js npm-publishing-with-github   (.md is optional)
 *   node scripts/add-summary.js '*'                          (all posts)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const ENV_PATH = path.join(__dirname, '.env');
const PROMPT_PATH = path.join(__dirname, 'prompt.md');

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const fileArg = process.argv.slice(2).find(a => !a.startsWith('--'));

if (!fileArg) {
  console.error('Usage: node scripts/add-summary.js <post-filename|*> [--dry-run] [--force]');
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

if (!fs.existsSync(PROMPT_PATH)) {
  console.error(`Prompt template not found: ${path.relative(ROOT, PROMPT_PATH)}`);
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

function insertSummary(fmBlock, summaryText) {
  const blocks = parseBlocks(fmBlock).filter(b => b.key !== 'summary');
  const summaryBlock = { key: 'summary', lines: [`summary: ${yamlQuote(summaryText)}`] };

  let insertAt = blocks.findIndex(b => b.key === 'description');
  if (insertAt === -1) insertAt = blocks.findIndex(b => b.key === 'slug');
  insertAt = insertAt === -1 ? blocks.length : insertAt + 1;

  blocks.splice(insertAt, 0, summaryBlock);
  return blocks.map(b => b.lines.join('\n')).join('\n');
}

async function generateSummary(postBody) {
  const template = fs.readFileSync(PROMPT_PATH, 'utf-8');
  const prompt = template.replace('{{content}}', postBody);

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
    throw new Error(`No summary in OpenRouter response: ${JSON.stringify(data)}`);
  }
  return text;
}

async function processPost(postFilename) {
  const postPath = path.join(POSTS_DIR, postFilename);
  const raw = fs.readFileSync(postPath, 'utf-8');
  const { fmBlock, body } = splitFrontmatter(raw);

  const hasSummary = parseBlocks(fmBlock).some(b => b.key === 'summary');
  if (hasSummary && !FORCE) {
    console.log(`Skipping ${postFilename}: already has a summary (use --force to regenerate)`);
    return;
  }

  console.log(`Generating summary for ${postFilename} (model: ${MODEL_NAME})...`);
  const summary = await generateSummary(body);
  console.log(`Summary: ${summary}`);

  const newFmBlock = insertSummary(fmBlock, summary);
  const newRaw = `---\n${newFmBlock}\n---\n${body}`;

  if (DRY_RUN) {
    console.log('(dry run, not writing)');
  } else {
    fs.writeFileSync(postPath, newRaw);
    console.log(`Updated ${path.relative(ROOT, postPath)}`);
  }
}

async function main() {
  if (fileArg === '*') {
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();
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
