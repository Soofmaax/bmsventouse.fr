/**
 * Bing URL Submission API
 * - Default: reads sitemap.xml and submits ALL URLs (manual run).
 * - With --changed-only: submits ONLY URLs added or UPDATED in latest sitemap.xml diff (HEAD^..HEAD).
 * Requires env BING_API_KEY (Bing Webmaster Tools) and optional SITE_URL.
 * Docs: https://learn.microsoft.com/en-us/bingwebmaster/api/url-submission-api
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = process.env.BING_API_KEY;
const SITE_URL = process.env.SITE_URL || 'https://www.bmsventouse.fr';
const SITEMAP_PATH = path.resolve(process.cwd(), 'sitemap.xml');
const ENDPOINT = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${API_KEY}`;
const CHANGED_ONLY = process.argv.includes('--changed-only');

if (!API_KEY) {
  console.error('❌ Missing BING_API_KEY environment variable. Set it in GitHub Secrets.');
  process.exit(1);
}

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
      blocks[loc] = block.replace(/\s+/g, ' ').trim();
    }
  }
  return blocks;
}

function getChangedOrUpdatedUrls() {
  let oldXml = null;
  try {
    oldXml = execSync('git show HEAD^:sitemap.xml', { encoding: 'utf-8' });
  } catch {
    // fallback to added <loc> lines
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

  const newXml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const oldBlocks = parseUrlBlocks(oldXml);
  const newBlocks = parseUrlBlocks(newXml);

  const changed = [];
  Object.entries(newBlocks).forEach(([loc, block]) => {
    if (!(loc in oldBlocks)) {
      changed.push(loc);
    } else if (oldBlocks[loc] !== block) {
      changed.push(loc);
    }
  });
  return [...new Set(changed)];
}

async function submitToBing(urls) {
  const payload = {
    siteUrl: SITE_URL,
    urlList: urls,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('❌ Bing submission failed:', res.status, text);
    process.exit(1);
  } else {
    console.log('✅ Bing submission succeeded:', res.status, text);
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
      console.log('ℹ️ No new or updated URLs detected in sitemap.xml diff. Skipping Bing submission.');
      return;
    }
    console.log(`Submitting ${urls.length} NEW/UPDATED URL(s) to Bing...`);
  } else {
    urls = readSitemapUrls(SITEMAP_PATH);
    if (urls.length === 0) {
      console.error('❌ No URLs found in sitemap.xml');
      process.exit(1);
    }
    console.log(`Submitting ${urls.length} URL(s) to Bing...`);
  }

  await submitToBing(urls);
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});