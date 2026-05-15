import { XMLParser } from 'fast-xml-parser';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const XML_PATH = join(
  __dirname,
  '..',
  'devendevour.wordpress.com-2026-05-15-05_07_46',
  'devendevour.wordpress.com.2026-05-15.000.xml'
);
const OUTPUT_DIR = join(__dirname, 'output');
const PAGES_TO_KEEP = new Set(['about', 'glossary', 'web-development-links']);

// Unwrap CDATA objects or return plain string values
function getText(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && '__cdata' in val) return String(val.__cdata);
  return String(val);
}

function normaliseTag(tag) {
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractAlias(link, postDate, slug) {
  const m = link.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/?#]+)\/?$/);
  if (m) return `/${m[1]}/${m[2]}/${m[3]}/${m[4]}/`;
  const [year, month, day] = postDate.substring(0, 10).split('-');
  return `/${year}/${month}/${day}/${slug}/`;
}

function extractTags(categories) {
  const tagSet = new Set();
  for (const cat of (categories || [])) {
    const domain = cat['@_domain'];
    if (domain === 'post_tag' || domain === 'category') {
      const nicename = cat['@_nicename'] || '';
      const normalised = normaliseTag(nicename);
      if (normalised) tagSet.add(normalised);
    }
  }
  return [...tagSet];
}

console.log('Reading XML...');
const xml = readFileSync(XML_PATH, 'utf8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: false,
  parseTagValue: false,
  cdataPropName: '__cdata',
  isArray: (name) => ['item', 'category', 'wp:postmeta'].includes(name),
});

console.log('Parsing XML...');
const result = parser.parse(xml);
const items = result.rss.channel.item;
console.log(`Total items in XML: ${items.length}`);

const attachments = {};
const posts = [];
const pages = [];

for (const item of items) {
  const postType = getText(item['wp:post_type']);
  const status = getText(item['wp:status']);

  if (postType === 'attachment') {
    const id = getText(item['wp:post_id']);
    const url = getText(item['wp:attachment_url']);
    if (url) {
      const filename = url.split('/').pop().split('?')[0];
      attachments[id] = { url, filename };
    }
    continue;
  }

  if (postType === 'post' && status === 'publish') {
    const title = getText(item.title);
    const slug = getText(item['wp:post_name']);
    const postDate = getText(item['wp:post_date']);
    const date = postDate.substring(0, 10);
    const link = getText(item.link);
    const content = getText(item['content:encoded']);
    const tags = extractTags(item.category);
    const alias = extractAlias(link, postDate, slug);
    posts.push({ title, slug, date, alias, tags, content });
    continue;
  }

  if (postType === 'page' && status === 'publish') {
    const slug = getText(item['wp:post_name']);
    if (!PAGES_TO_KEEP.has(slug)) continue;
    const title = getText(item.title);
    const postDate = getText(item['wp:post_date']);
    const date = postDate.substring(0, 10);
    const content = getText(item['content:encoded']);
    const tags = extractTags(item.category);
    pages.push({ title, slug, date, tags, content });
  }
}

// Detect and resolve duplicate slugs
const slugCounts = {};
for (const post of posts) {
  slugCounts[post.slug] = (slugCounts[post.slug] || 0) + 1;
}
const duplicateSlugs = Object.keys(slugCounts).filter(s => slugCounts[s] > 1);
if (duplicateSlugs.length > 0) {
  console.warn(`WARNING: Duplicate slugs found: ${duplicateSlugs.join(', ')}`);
  const seen = {};
  for (const post of posts) {
    if (slugCounts[post.slug] > 1) {
      seen[post.slug] = (seen[post.slug] || 0) + 1;
      if (seen[post.slug] > 1) post.slug = `${post.slug}-${seen[post.slug]}`;
    }
  }
}

writeFileSync(join(OUTPUT_DIR, 'posts.json'), JSON.stringify(posts, null, 2));
writeFileSync(join(OUTPUT_DIR, 'pages.json'), JSON.stringify(pages, null, 2));
writeFileSync(
  join(OUTPUT_DIR, 'attachments.json'),
  JSON.stringify(attachments, null, 2)
);

console.log(`Attachments: ${Object.keys(attachments).length}`);
console.log(`Posts (published): ${posts.length}`);
console.log(`Pages (migrated): ${pages.length}`);
if (pages.length > 0) {
  console.log(`  Page slugs: ${pages.map(p => p.slug).join(', ')}`);
}
