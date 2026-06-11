#!/usr/bin/env node
/**
 * Converts HTML <img> tags in content/posts to plain markdown image syntax.
 *
 * Rules:
 *   <a href="X"><img src="X" ...></a>  →  ![alt](src)          (same URL, drop anchor)
 *   <a href="Y"><img src="X" ...></a>  →  [![alt](src)](href)  (attribution link)
 *   <img src="/images/..." ...>        →  ![alt](src)
 *   <img src="relative/...">           →  skipped (can't resolve)
 *   <img> inside fenced code blocks    →  skipped
 *
 * Images are resized in-place (via sips) when the actual pixel width exceeds
 * the width= attribute value. Since most images were already pre-sized during
 * migration, resizes are rare.
 *
 * Usage:
 *   node scripts/convert-img-to-markdown.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = path.resolve(__dirname, '..');
const STATIC_DIR = path.join(ROOT, 'static');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');

const stats = { files: 0, conversions: 0, resizes: 0, skipped: 0 };

function getImageWidth(filePath) {
  try {
    const out = execSync(`sips -g pixelWidth "${filePath}"`, {
      stdio: ['pipe', 'pipe', 'ignore'],
    }).toString();
    const m = out.match(/pixelWidth:\s*(\d+)/);
    return m ? parseInt(m[1]) : null;
  } catch {
    return null;
  }
}

function resizeImage(filePath, width) {
  execSync(`sips --resampleWidth ${width} "${filePath}"`, { stdio: 'ignore' });
}

function parseAttrs(attrStr) {
  return {
    src: (attrStr.match(/src="([^"]+)"/) || [])[1] ?? null,
    width: parseInt((attrStr.match(/width="(\d+)"/) || [])[1] ?? '0') || null,
    alt: (attrStr.match(/alt="([^"]*)"/) || [])[1] ?? '',
  };
}

function maybeResize(src, width, label) {
  if (!width) return;
  const filePath = path.join(STATIC_DIR, src);
  if (!fs.existsSync(filePath)) return;
  const actual = getImageWidth(filePath);
  if (actual && actual > width) {
    if (!DRY_RUN) resizeImage(filePath, width);
    console.log(`  resize  ${src}  ${actual} → ${width}px  [${label}]`);
    stats.resizes++;
  }
}

// Process a single non-code-block segment of text
function convertSegment(text, postName) {
  // <a href="..."><img ...></a>
  text = text.replace(
    /<a\s+href="([^"]+)"[^>]*>\s*<img\s+([^>]+?)\/?\s*>\s*<\/a>/gi,
    (match, href, attrs) => {
      const { src, width, alt } = parseAttrs(attrs);
      if (!src || !src.startsWith('/')) {
        stats.skipped++;
        return match;
      }
      maybeResize(src, width, postName);
      stats.conversions++;
      if (href === src) {
        return `![${alt}](${src})`;
      }
      return `[![${alt}](${src})](${href})`;
    }
  );

  // Standalone <img ...>
  text = text.replace(/<img\s+([^>]+?)\/?\s*>/gi, (match, attrs) => {
    const { src, width, alt } = parseAttrs(attrs);
    if (!src || !src.startsWith('/')) {
      stats.skipped++;
      return match;
    }
    maybeResize(src, width, postName);
    stats.conversions++;
    return `![${alt}](${src})`;
  });

  return text;
}

function processFile(mdPath) {
  const postName = path.basename(mdPath);
  const content = fs.readFileSync(mdPath, 'utf-8');

  // Split on fenced code blocks; odd-indexed segments are inside fences — leave them alone
  const parts = content.split(/(^```[\s\S]*?^```[ \t]*$)/m);
  const processed = parts.map((part, i) =>
    i % 2 === 0 ? convertSegment(part, postName) : part
  );
  const result = processed.join('');

  if (result !== content) {
    if (!DRY_RUN) fs.writeFileSync(mdPath, result);
    stats.files++;
    return true;
  }
  return false;
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();
console.log(`Processing ${files.length} posts${DRY_RUN ? ' (dry run)' : ''}...\n`);

for (const file of files) {
  const changed = processFile(path.join(POSTS_DIR, file));
  if (changed) {
    console.log(`  ${DRY_RUN ? 'would change' : 'changed'}  ${file}`);
  }
}

console.log(
  `\nDone: ${stats.files} files changed, ${stats.conversions} conversions, ` +
  `${stats.resizes} images resized, ${stats.skipped} skipped`
);
