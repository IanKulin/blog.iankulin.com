import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.resolve(import.meta.dirname, '../static/images');
const REFERENCED_IMAGES = path.resolve(import.meta.dirname, 'output/referenced-images.json');
const CONTENT_POSTS_DIR = path.resolve(import.meta.dirname, '../content/posts');
const CONTENT_DIR = path.resolve(import.meta.dirname, '../content');
const DELAY_MS = 100;

mkdirSync(IMAGES_DIR, { recursive: true });

const urls = JSON.parse(readFileSync(REFERENCED_IMAGES, 'utf8'));

// Build filename → [urls] map to detect collisions
const filenameMap = new Map();
for (const url of urls) {
  const filename = url.split('/').pop();
  if (!filenameMap.has(filename)) filenameMap.set(filename, []);
  filenameMap.get(filename).push(url);
}

// Resolve final filename for each URL (prefix with YYYY-MM- on collision)
function resolveFilename(url) {
  const filename = url.split('/').pop();
  const bucket = filenameMap.get(filename);
  if (bucket.length === 1) return filename;
  // Extract YYYY/MM from upload path: /uploads/YYYY/MM/filename
  const match = url.match(/uploads\/(\d{4})\/(\d{2})\//);
  const prefix = match ? `${match[1]}-${match[2]}-` : '';
  return prefix + filename;
}

// Collect collisions so we can patch markdown files
const collisions = []; // { originalFilename, newFilename, affectedUrls }
for (const [filename, urlList] of filenameMap) {
  if (urlList.length > 1) {
    for (const url of urlList) {
      const newFilename = resolveFilename(url);
      collisions.push({ originalFilename: filename, newFilename, url });
    }
  }
}

if (collisions.length > 0) {
  console.log(`⚠  ${collisions.length} filename collision(s) detected — will patch markdown files`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadAll() {
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of urls) {
    const finalFilename = resolveFilename(url);
    const destPath = path.join(IMAGES_DIR, finalFilename);

    if (existsSync(destPath)) {
      skipped++;
      continue;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`FAILED [${res.status}]: ${url}`);
        failed++;
      } else {
        const buffer = Buffer.from(await res.arrayBuffer());
        writeFileSync(destPath, buffer);
        downloaded++;
        if (downloaded % 50 === 0) {
          console.log(`  … ${downloaded} downloaded so far`);
        }
      }
    } catch (err) {
      console.log(`FAILED [${err.message}]: ${url}`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDownloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
  return { downloaded, skipped, failed };
}

async function patchMarkdownFiles() {
  if (collisions.length === 0) return;

  // Build map: /images/originalFilename → /images/newFilename
  const renames = new Map();
  for (const { originalFilename, newFilename } of collisions) {
    if (originalFilename !== newFilename) {
      renames.set(`/images/${originalFilename}`, `/images/${newFilename}`);
    }
  }

  const mdDirs = [CONTENT_POSTS_DIR, CONTENT_DIR];
  for (const dir of mdDirs) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.name.endsWith('.md')) continue;
      const filePath = path.join(dir, entry.name);
      let content = await readFile(filePath, 'utf8');
      let changed = false;
      for (const [from, to] of renames) {
        if (content.includes(from)) {
          content = content.replaceAll(from, to);
          changed = true;
        }
      }
      if (changed) {
        await writeFile(filePath, content, 'utf8');
        console.log(`  patched: ${entry.name}`);
      }
    }
  }
}

await downloadAll();
await patchMarkdownFiles();
