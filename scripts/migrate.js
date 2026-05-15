import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';
import gfmPlugin from 'turndown-plugin-gfm';

const { gfm } = gfmPlugin;
const __dirname = dirname(fileURLToPath(import.meta.url));

const POSTS_JSON = join(__dirname, 'output/posts.json');
const PAGES_JSON = join(__dirname, 'output/pages.json');
const CONTENT_POSTS = join(__dirname, '../content/posts');
const CONTENT_ROOT = join(__dirname, '../content');
const REFERENCED_IMAGES_OUT = join(__dirname, 'output/referenced-images.json');

if (!existsSync(CONTENT_POSTS)) mkdirSync(CONTENT_POSTS, { recursive: true });

// ── Step 0: Embed handling ────────────────────────────────────────────────────
// All replacements must produce HTML (not markdown), because we're still in
// the HTML pipeline before Turndown runs.  The one exception is Hugo shortcodes
// ({{< youtube >}}) which contain characters Turndown would escape — those are
// inserted via a safe placeholder that gets swapped in after Turndown.

function extractYouTubeId(url) {
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return watch[1];
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return shorts[1];
  console.warn(`  [WARN] Unrecognised YouTube URL: ${url}`);
  return null;
}

function htmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const gistCache = new Map();

async function fetchGist(id) {
  if (gistCache.has(id)) return gistCache.get(id);
  await new Promise(r => setTimeout(r, 100));
  try {
    const res = await fetch(`https://api.github.com/gists/${id}`, {
      headers: {
        'User-Agent': 'devendevour-migration',
        ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
      },
    });
    const data = res.ok ? await res.json() : null;
    if (!res.ok) console.warn(`  [WARN] GitHub API ${res.status} for gist ${id}`);
    gistCache.set(id, data);
    return data;
  } catch (e) {
    console.warn(`  [WARN] Gist fetch error for ${id}: ${e.message}`);
    gistCache.set(id, null);
    return null;
  }
}

// Returns HTML (<pre><code>) so Turndown converts it to fenced blocks
async function inlineGistAsHtml(url) {
  const id = url.split('/').pop().split('#')[0];
  const data = await fetchGist(id);
  if (!data) {
    console.warn(`  [WARN] Gist fallback (link only): ${url}`);
    return `<a href="${url}">View Gist</a>`;
  }
  const files = Object.values(data.files);
  return files
    .map(f => {
      const lang = (f.language || '').toLowerCase();
      const header = files.length > 1 ? `<p>${htmlEscape(f.filename)}</p>` : '';
      return `${header}<pre><code class="language-${lang}">${htmlEscape(f.content)}</code></pre>`;
    })
    .join('\n');
}

// Returns { content, youtubePlaceholders } where placeholders are safe ASCII
// strings that survive Turndown unchanged, replaced with Hugo shortcodes after.
async function handleEmbeds(content) {
  const youtubePlaceholders = new Map();
  const embedRe = /<!-- wp:embed ({.*}) -->\n([\s\S]*?)<!-- \/wp:embed -->/g;

  const blocks = [];
  let match;
  while ((match = embedRe.exec(content)) !== null) {
    let attrs = {};
    try { attrs = JSON.parse(match[1]); } catch { /* ignore malformed JSON */ }
    blocks.push({ full: match[0], attrs });
  }

  for (const { full, attrs } of blocks) {
    let replacement;
    const url = attrs.url || '';

    if (attrs.providerNameSlug === 'youtube') {
      const id = extractYouTubeId(url);
      if (id) {
        // Alphanumeric-only placeholder — Turndown escapes underscores in text
        const placeholder = `HUGOYOUTUBESTART${youtubePlaceholders.size}END`;
        youtubePlaceholders.set(placeholder, `{{< youtube ${id} >}}`);
        replacement = `<p>${placeholder}</p>`;
      } else {
        replacement = `<p><a href="${url}">View video</a></p>`;
      }
    } else if (url.includes('gist.github.com')) {
      replacement = await inlineGistAsHtml(url);
    } else {
      replacement = `<p><a href="${url}">View embed</a></p>`;
    }

    content = content.split(full).join(replacement);
  }

  return { content, youtubePlaceholders };
}

// ── Step 1: Strip Gutenberg block comments ───────────────────────────────────

function stripBlockComments(content) {
  content = content.replace(/<!-- wp:[^\n]* -->\n?/g, '');
  content = content.replace(/<!-- \/wp:[^\s]+ -->\n?/g, '');
  return content;
}

// ── Steps 2 & 3: Collect image URLs and rewrite to /images/ ─────────────────

const referencedImages = new Set();

function processImages(content) {
  const urlPattern =
    /(https?:\/\/devendevour\.wordpress\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"?\s<]+)(?:\?[^"<\s]*)?/g;

  let m;
  while ((m = urlPattern.exec(content)) !== null) {
    referencedImages.add(m[1]);
  }

  content = content.replace(
    /https?:\/\/devendevour\.wordpress\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([^"?\s<]+)(?:\?[^"<\s]*)?/g,
    (_, filename) => `/images/${filename}`,
  );

  return content;
}

// ── Step 4: Rewrite internal links ───────────────────────────────────────────

function rewriteInternalLinks(content) {
  // /YYYY/MM/DD/slug/ → /slug/
  content = content.replace(
    /https?:\/\/devendevour\.wordpress\.com\/\d{4}\/\d{2}\/\d{2}\/([^"/<\s]+)\//g,
    (_, slug) => `/${slug}/`,
  );

  // Known pages — strip domain only
  content = content.replace(
    /https?:\/\/devendevour\.wordpress\.com\/((?:glossary|about|web-development-links)\/)/g,
    '/$1',
  );

  // WordPress tag/category archives → Hugo tag pages
  content = content.replace(
    /https?:\/\/devendevour\.wordpress\.com\/(?:tag|category)\/([^"/<\s]+)\//g,
    '/tags/$1/',
  );

  const pLinks = content.match(/https?:\/\/devendevour\.wordpress\.com\/\?p=\d+/g);
  if (pLinks) {
    pLinks.forEach(l => console.warn(`  [WARN] Unresolved /?p= link: ${l}`));
  }

  const goalsLinks = content.match(/https?:\/\/devendevour\.wordpress\.com\/goals\//g);
  if (goalsLinks) {
    console.warn(`  [WARN] Link to discarded /goals/ page (${goalsLinks.length}x) — update manually`);
  }

  return content;
}

// ── Step 5: Turndown ─────────────────────────────────────────────────────────

function buildTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  td.use(gfm);

  td.addRule('figcaption', {
    filter: 'figcaption',
    replacement: (content) => `\n*${content.trim()}*\n\n`,
  });

  return td;
}

// ── Frontmatter ──────────────────────────────────────────────────────────────

function escapeTitle(title) {
  return title.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildFrontmatter(item, isPage = false) {
  const lines = [
    '---',
    `title: "${escapeTitle(item.title)}"`,
    `date: '${item.date}'`,
    `slug: ${item.slug}`,
  ];

  if (!isPage && item.alias) {
    lines.push('aliases:');
    lines.push(`  - ${item.alias}`);
  }

  if (item.tags && item.tags.length > 0) {
    lines.push('tags:');
    item.tags.forEach(t => lines.push(`  - ${t}`));
  }

  lines.push('---');
  return lines.join('\n') + '\n';
}

// ── Step 6: Post-process ─────────────────────────────────────────────────────

function postProcess(md) {
  md = md.replace(/\n{3,}/g, '\n\n');
  return md.trimEnd() + '\n';
}

// ── Full pipeline ─────────────────────────────────────────────────────────────

async function convertContent(item, td) {
  let content = item.content;

  const { content: c, youtubePlaceholders } = await handleEmbeds(content);
  content = c;
  content = stripBlockComments(content);
  content = processImages(content);
  content = rewriteInternalLinks(content);

  let md = td.turndown(content);

  // Replace YouTube placeholders with Hugo shortcodes (must be post-Turndown)
  for (const [placeholder, shortcode] of youtubePlaceholders) {
    md = md.split(placeholder).join(shortcode);
  }

  return postProcess(md);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const posts = JSON.parse(readFileSync(POSTS_JSON, 'utf8'));
  const pages = JSON.parse(readFileSync(PAGES_JSON, 'utf8'));
  const td = buildTurndown();

  console.log(`Processing ${posts.length} posts...`);
  let n = 0;
  for (const post of posts) {
    const md = await convertContent(post, td);
    writeFileSync(
      join(CONTENT_POSTS, `${post.slug}.md`),
      buildFrontmatter(post) + '\n' + md,
      'utf8',
    );
    n++;
    if (n % 50 === 0) console.log(`  ${n}/${posts.length}`);
  }

  console.log(`Processing ${pages.length} pages...`);
  for (const page of pages) {
    const md = await convertContent(page, td);
    writeFileSync(
      join(CONTENT_ROOT, `${page.slug}.md`),
      buildFrontmatter(page, true) + '\n' + md,
      'utf8',
    );
  }

  const imagesArray = [...referencedImages].sort();
  writeFileSync(REFERENCED_IMAGES_OUT, JSON.stringify(imagesArray, null, 2), 'utf8');

  console.log('\nDone!');
  console.log(`Posts written:       ${posts.length}`);
  console.log(`Pages written:       ${pages.length}`);
  console.log(`Referenced images:   ${imagesArray.length}`);
  console.log(`Unique gists cached: ${gistCache.size}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
