/**
 * Shared helpers for the add-summary.js and add-descriptions.js scripts.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const ENV_PATH = path.join(ROOT, 'scripts', '.env');

// Load scripts/.env and return { OPENROUTER_API_KEY, MODEL_NAME }, exiting if unavailable.
function loadConfig() {
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
  return { OPENROUTER_API_KEY, MODEL_NAME };
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

// Insert (or replace) a single quoted frontmatter field. It goes directly after the
// `after` key (the first one present), falling back to the end of the frontmatter.
function setField(fmBlock, key, text, after = ['slug']) {
  const blocks = parseBlocks(fmBlock).filter(b => b.key !== key);

  let insertAt = blocks.length;
  for (const k of after) {
    const idx = blocks.findIndex(b => b.key === k);
    if (idx !== -1) {
      insertAt = idx + 1;
      break;
    }
  }

  blocks.splice(insertAt, 0, { key, lines: [`${key}: ${yamlQuote(text)}`] });
  return blocks.map(b => b.lines.join('\n')).join('\n');
}

async function callLLM(prompt, { OPENROUTER_API_KEY, MODEL_NAME }) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://blog.iankulin.com',
      'X-Title': 'blog.iankulin.com post metadata script',
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

function listPosts() {
  return fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_')).sort();
}

// Resolve a CLI filename argument to a post filename, exiting if it isn't a valid post.
function resolvePostArg(fileArg) {
  const postFilename = fileArg.endsWith('.md') ? fileArg : `${fileArg}.md`;
  if (postFilename.startsWith('_')) {
    console.error(`Skipping ${postFilename}: files starting with an underscore are not posts`);
    process.exit(1);
  }
  if (!fs.existsSync(path.join(POSTS_DIR, postFilename))) {
    console.error(`Post not found: content/posts/${postFilename}`);
    process.exit(1);
  }
  return postFilename;
}

// Run `processPost` over one post (fileArg) or every post (all), reporting failures.
async function runCli({ all, fileArg, usage, processPost, label }) {
  if (!all && !fileArg) {
    console.error(`Usage: ${usage[0]}`);
    console.error(`       ${usage[1]}`);
    process.exit(1);
  }

  try {
    if (all) {
      const files = listPosts();
      console.log(`Processing ${files.length} posts (${label})...\n`);

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

    await processPost(resolvePostArg(fileArg));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = {
  ROOT,
  POSTS_DIR,
  loadConfig,
  splitFrontmatter,
  parseBlocks,
  getQuotedValue,
  setField,
  callLLM,
  runCli,
};
