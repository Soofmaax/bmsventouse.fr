/**
 * IndexNow submission script
 * Reads sitemap.xml and submits all URLs to IndexNow endpoint.
 * Requires the key file to be hosted at the site root with the same key value.
 */

import fs from 'fs';
import path from 'path';

const HOST = 'www.bmsventouse.fr';
// IMPORTANT: Keep this key exactly equal to the content and filename suffix of the key file at repository root.
const KEY = '4f9c42a5b1e34cb08b65e0a9d3c7f864';
const KEY_LOCATION = `https://${HOST}/indexnow-${KEY}.txt`;
const SITEMAP_PATH = path.resolve(process.cwd(), 'sitemap.xml');
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function readSitemapUrls(filePath) {
  const xml = fs.readFileSync(filePath, 'utf-8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  const urls = matches.map(m => m[1].trim()).filter(Boolean);
  return [...new Set(urls)];
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

  const urls = readSitemapUrls(SITEMAP_PATH);
  if (urls.length === 0) {
    console.error('❌ No URLs found in sitemap.xml');
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);
  await submitIndexNow(urls);
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});