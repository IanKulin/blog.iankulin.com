#!/usr/bin/env node
/**
 * Generates a 1200x630 Open Graph card (PNG) for a post and sets the post's "image"
 * frontmatter field to point at it.
 *
 * Card layout (dark theme, matching the site's dark mode):
 *   - favicon + site name top left
 *   - post title on the left
 *   - the post's first local image on the right (if it has a usable one; otherwise the
 *     title takes the full width)
 *   - the post URL along the bottom
 *
 * Output: static/og/<slug>.png, referenced as `image: /og/<slug>.png`
 *
 * Posts that already have an image card are skipped unless --force is passed. A post whose
 * `image` field points somewhere other than /og/ is treated as hand-picked and is never
 * touched.
 *
 * Setup (once):  cd scripts && npm install
 *
 * Usage:
 *   node scripts/generate-og-image.js <post-filename> [--dry-run] [--force]
 *   node scripts/generate-og-image.js --all [--dry-run] [--force]
 *   node scripts/generate-og-image.js npm-publishing-with-github   (.md is optional)
 *
 * --dry-run renders nothing into the repo: it reports what would happen and writes a
 * preview PNG to the OS temp directory instead, without touching the post.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const STATIC_DIR = path.join(ROOT, 'static');
const OG_DIR = path.join(STATIC_DIR, 'og');
const FAVICON_PATH = path.join(STATIC_DIR, 'favicon.svg');
const SITE_NAME = 'blog.iankulin.com';
const SITE_HOST = 'blog.iankulin.com';

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const ALL = process.argv.includes('--all');
const fileArg = process.argv.slice(2).find(a => !a.startsWith('--'));

if (!ALL && !fileArg) {
  console.error('Usage: node scripts/generate-og-image.js <post-filename> [--dry-run] [--force]');
  console.error('       node scripts/generate-og-image.js --all [--dry-run] [--force]');
  process.exit(1);
}

let satori, Resvg, sharp, YAML;
try {
  satori = require('satori').default || require('satori');
  ({ Resvg } = require('@resvg/resvg-js'));
  sharp = require('sharp');
  YAML = require('yaml');
} catch (err) {
  console.error(`Missing dependencies (${err.message.split('\n')[0]}).`);
  console.error('Run:  cd scripts && npm install');
  process.exit(1);
}

// ---- Design -------------------------------------------------------------------------------
// Nord Polar Night / Frost, matching the dark-mode variables in assets/css/_custom.css.
const COLORS = {
  bg: '#2e3440',
  panel: '#3b4252',
  title: '#eceff4',
  text: '#d8dee9',
  meta: '#8f98a8',
  accent: '#88c0d0',
  border: '#4c566a',
};
const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 64;
const IMG_W = 440;
const IMG_H = 360;
const MIN_IMG_W = 300; // smaller images (icons, badges) make poor card art
const MIN_IMG_H = 150;

const fontDir = path.dirname(require.resolve('@fontsource/inter/package.json'));
const fontFile = name => fs.readFileSync(path.join(fontDir, 'files', name));
const FONTS = [
  { name: 'Inter', data: fontFile('inter-latin-700-normal.woff'), weight: 700, style: 'normal' },
  { name: 'Inter', data: fontFile('inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Inter', data: fontFile('inter-latin-ext-700-normal.woff'), weight: 700, style: 'normal' },
  { name: 'Inter', data: fontFile('inter-latin-ext-400-normal.woff'), weight: 400, style: 'normal' },
];

// Characters the bundled font can draw: the latin and latin-ext subsets we load above. Anything
// outside these (emoji, CJK, ...) renders as a blank box on the card.
const SUPPORTED_RANGES = (() => {
  const unicode = require('@fontsource/inter/unicode.json');
  return [unicode.latin, unicode['latin-ext']]
    .join(',')
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(r => r.replace('U+', '').split('-').map(hex => parseInt(hex, 16)))
    .map(([lo, hi = lo]) => [lo, hi]);
})();

function unsupportedChars(text) {
  const bad = new Set();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (!SUPPORTED_RANGES.some(([lo, hi]) => cp >= lo && cp <= hi)) bad.add(ch);
  }
  return [...bad];
}

// ---- Frontmatter --------------------------------------------------------------------------
function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error('No frontmatter found');
  return { fmBlock: match[1], body: raw.slice(match[0].length) };
}

// Group frontmatter lines into blocks keyed by top-level YAML key, so multi-line values move
// together. (Same approach as add-summary.js.)
function parseBlocks(fmBlock) {
  const blocks = [];
  for (const line of fmBlock.split('\n')) {
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):/);
    if (keyMatch) blocks.push({ key: keyMatch[1], lines: [line] });
    else if (blocks.length > 0) blocks[blocks.length - 1].lines.push(line);
  }
  return blocks;
}

function setImageField(fmBlock, imagePath) {
  const blocks = parseBlocks(fmBlock).filter(b => b.key !== 'image');
  let insertAt = -1;
  for (const key of ['description', 'summary', 'slug']) {
    insertAt = blocks.findIndex(b => b.key === key);
    if (insertAt !== -1) break;
  }
  insertAt = insertAt === -1 ? blocks.length : insertAt + 1;
  blocks.splice(insertAt, 0, { key: 'image', lines: [`image: ${imagePath}`] });
  return blocks.map(b => b.lines.join('\n')).join('\n');
}

// ---- Image selection ----------------------------------------------------------------------
// Returns local image paths referenced in the body, in document order.
function findImageRefs(body) {
  const refs = [];
  const re = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?[^)]*\)|<img\b[^>]*?\bsrc=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(body))) refs.push(m[1] || m[2]);
  return refs;
}

async function pickImage(body) {
  for (const ref of findImageRefs(body)) {
    if (/^[a-z]+:\/\//i.test(ref) || ref.startsWith('//')) continue; // remote
    const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
    const file = path.join(STATIC_DIR, clean.replace(/^\//, ''));
    if (!file.startsWith(STATIC_DIR) || !fs.existsSync(file)) continue;
    try {
      const meta = await sharp(file).metadata();
      if (meta.width >= MIN_IMG_W && meta.height >= MIN_IMG_H) return file;
    } catch {
      // unreadable image: try the next one
    }
  }
  return null;
}

async function imageDataUri(file) {
  // Cover-crop to the panel size and flatten so transparency doesn't render as black.
  const buf = await sharp(file)
    .resize(IMG_W, IMG_H, { fit: 'cover', position: 'attention' })
    .flatten({ background: COLORS.panel })
    .jpeg({ quality: 88 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

// ---- Rendering ----------------------------------------------------------------------------
const h = (type, style, children, props = {}) => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...props },
});

function titleFontSize(title, hasImage) {
  const n = title.length;
  const scale = hasImage ? 1 : 1.25;
  if (n <= 28) return Math.round(72 * scale);
  if (n <= 48) return Math.round(60 * scale);
  if (n <= 72) return Math.round(50 * scale);
  return Math.round(42 * scale);
}

function buildCard({ title, url, imageUri, faviconUri }) {
  const header = h('div', { alignItems: 'center' }, [
    h('img', { width: 44, height: 44 }, undefined, { src: faviconUri, width: 44, height: 44 }),
    h('div', { marginLeft: 16, fontSize: 28, fontWeight: 400, color: COLORS.text }, SITE_NAME),
  ]);

  const titleBlock = h(
    'div',
    {
      flex: 1,
      alignItems: 'center',
      paddingRight: imageUri ? 48 : 0,
    },
    h(
      'div',
      {
        fontSize: titleFontSize(title, !!imageUri),
        fontWeight: 700,
        lineHeight: 1.18,
        color: COLORS.title,
        letterSpacing: '-0.02em',
        lineClamp: 5,
      },
      title,
    ),
  );

  const imagePanel = imageUri
    ? h(
        'div',
        {
          width: IMG_W,
          height: IMG_H,
          alignSelf: 'center',
          borderRadius: 20,
          overflow: 'hidden',
          border: `2px solid ${COLORS.border}`,
        },
        undefined,
        { children: h('img', {}, undefined, { src: imageUri, width: IMG_W, height: IMG_H }) },
      )
    : null;

  const middle = h('div', { flex: 1, marginTop: 8, marginBottom: 8 }, [titleBlock, imagePanel].filter(Boolean));

  const footer = h(
    'div',
    { borderTop: `2px solid ${COLORS.border}`, paddingTop: 24, fontSize: 30, fontWeight: 400, color: COLORS.accent },
    url,
  );

  return h(
    'div',
    {
      width: WIDTH,
      height: HEIGHT,
      flexDirection: 'column',
      padding: `${PAD - 12}px ${PAD}px ${PAD - 20}px`,
      backgroundColor: COLORS.bg,
      fontFamily: 'Inter',
    },
    [header, middle, footer],
  );
}

let faviconUriCache;
function faviconUri() {
  if (!faviconUriCache) {
    const svg = fs.readFileSync(FAVICON_PATH);
    faviconUriCache = `data:image/svg+xml;base64,${svg.toString('base64')}`;
  }
  return faviconUriCache;
}

async function renderCard(opts) {
  const svg = await satori(buildCard({ ...opts, faviconUri: faviconUri() }), {
    width: WIDTH,
    height: HEIGHT,
    fonts: FONTS,
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
  // Re-encode with a palette: flat-colour cards compress dramatically with little visible loss.
  return sharp(png).png({ palette: true, quality: 90, compressionLevel: 9, effort: 10 }).toBuffer();
}

// ---- Per-post processing ------------------------------------------------------------------
function cleanTitle(title) {
  return String(title).replace(/`/g, '').replace(/\s+/g, ' ').trim();
}

async function processPost(postFilename) {
  const postPath = path.join(POSTS_DIR, postFilename);
  const raw = fs.readFileSync(postPath, 'utf-8');
  const { fmBlock, body } = splitFrontmatter(raw);
  const fm = YAML.parse(fmBlock) || {};

  if (!fm.title) throw new Error('post has no title');
  const slug = fm.slug || postFilename.replace(/\.md$/, '');
  const imageField = fm.image ? String(fm.image) : '';
  const ogRelPath = `/og/${slug}.png`;
  const ogFile = path.join(OG_DIR, `${slug}.png`);

  if (imageField && !imageField.startsWith('/og/')) {
    console.log(`Skipping ${postFilename}: has a hand-picked image (${imageField})`);
    return;
  }
  if (imageField && fs.existsSync(ogFile) && !FORCE) {
    console.log(`Skipping ${postFilename}: already has an image card (use --force to regenerate)`);
    return;
  }

  const title = cleanTitle(fm.title);
  const missing = unsupportedChars(title);
  if (missing.length > 0) {
    const shown = missing.map(ch => `${ch} (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')})`);
    console.warn(`WARNING ${postFilename}: title has characters the card font can't draw (they will show as blank boxes): ${shown.join(', ')}`);
  }

  const sourceImage = await pickImage(body);
  const imageUri = sourceImage ? await imageDataUri(sourceImage) : null;
  const png = await renderCard({
    title,
    url: `${SITE_HOST}/${slug}/`,
    imageUri,
  });

  const note = sourceImage ? `image: ${path.relative(STATIC_DIR, sourceImage)}` : 'title only (no usable image)';
  const kb = (png.length / 1024).toFixed(0);

  if (DRY_RUN) {
    const preview = path.join(os.tmpdir(), `og-preview-${slug}.png`);
    fs.writeFileSync(preview, png);
    console.log(`(dry run) ${postFilename}: ${note}, ${kb} KB, preview at ${preview}`);
    return;
  }

  fs.mkdirSync(OG_DIR, { recursive: true });
  fs.writeFileSync(ogFile, png);
  if (imageField !== ogRelPath) {
    fs.writeFileSync(postPath, `---\n${setImageField(fmBlock, ogRelPath)}\n---\n${body}`);
  }
  console.log(`Generated ${path.relative(ROOT, ogFile)} for ${postFilename}: ${note}, ${kb} KB`);
}

async function main() {
  if (ALL) {
    const files = fs
      .readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .sort();
    console.log(`Processing ${files.length} posts...\n`);

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
