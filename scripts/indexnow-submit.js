/**
 * IndexNow submission script
 * - Default: reads sitemap.xml and submits ALL URLs (manual run).
 * - With --changed-only: submits ONLY URLs added or UPDATED in the latest sitemap.xml diff (HEAD^..HEAD).
 *   Requires checkout fetch-depth >= 2 in CI to access the previous commit.
 * - Requires key file at site root: indexnow-<KEY>.txt
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOST = 'www.bmsventouse.fr';
// IMPORTANT: keep in sync with the file: /indexnow-<KEY>.txt
const KEY = '4f9c42a5b1e34cb08b65e0a9d3c7f864';
const KEY_LOCATION = `https://${HOST}/indexnow-${KEY}.txt`;
const SITEMAP_PATH = path.resolve(process.cwd(), 'sitemap.xml');
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const CHANGED_ONLY = process.argv.includes('--changed-only');

function readSitemapUrls(filePath) {
  const xml = fs.readFileSync(filePath, 'utf-8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  const urls = matches.map(m => m[1].trim()).filter(Boolean);
  return [...new Set(urls)];
}

function parseUrlBlocks(xml) {
  const blocks = {};
  const re = /<url[^>]*>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[0];
    const locM = block.match(/<loc>([^<]+)<\/loc>/);
    if (locM) {
      const loc = locM[1].trim();
      blocks[loc] = block.replace(/\s+/g, ' ').trim(); // normalize whitespace
    }
  }
  return blocks;
}

function getChangedOrUpdatedUrls() {
  // Try to read previous sitemap from git
  let oldXml = null;
  try {
    oldXml = execSync('git show HEAD^:sitemap.xml', { encoding: 'utf-8' });
  } catch {
    // fallback: try to extract added <loc> from unified diff
    try {
      const diff = execSync('git diff --unified=0 HEAD^ HEAD -- sitemap.xml', { encoding: 'utf-8' });
      const lines = diff.split('\n');
      const added = lines.filter(l => l.startsWith('+') && !l.startsWith('+++')).map(l => l.replace(/^\+/, '')).join('\n');
      const matches = [...added.matchAll(/<loc>([^<]+)<\/loc>/g)];
      const urls = matches.map(m => m[1].trim());
      return [...new Set(urls)];
    } catch {
      return [];
    }
  }

  // Compare blocks between old and new to detect added or updated URLs
  const newXml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const oldBlocks = parseUrlBlocks(oldXml);
  const newBlocks = parseUrlBlocks(newXml);

  const changed = [];
  Object.entries(newBlocks).forEach(([loc, block]) => {
    if (!(loc in oldBlocks)) {
      changed.push(loc); // new URL
    } else if (oldBlocks[loc] !== block) {
      changed.push(loc); // updated block (e.g., lastmod, priority, etc.)
    }
  });

  return [...new Set(changed)];
}

async function submitIndexNow(urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('❌ IndexNow submission failed:', res.status, text);
    process.exit(1);
  } else {
    console.log('✅ IndexNow submission succeeded:', res.status, text);
  }
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ sitemap.xml not found at project root');
    process.exit(1);
  }

  let urls = [];
  if (CHANGED_ONLY) {
    urls = getChangedOrUpdatedUrls();
    if (urls.length === 0) {
      console.log('ℹ️ No new or updated URLs detected in sitemap.xml diff. Skipping IndexNow submission.');
      return;
    }
    console.log(`Submitting ${urls.length} NEW/UPDATED URL(s) to IndexNow...`);
  } else {
    urls = readSitemapUrls(SITEMAP_PATH);
    if (urls.length === 0) {
      console.error('❌ No URLs found in sitemap.xml');
      process.exit(1);
    }
    console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);
  }

  await submitIndexNow(urls);
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});