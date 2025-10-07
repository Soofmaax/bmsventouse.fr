/**
 * Bing URL Submission API
 * Submits all URLs from sitemap.xml to Bing for faster indexing.
 * Requires a Bing Webmaster Tools API key set as env BING_API_KEY.
 * Optionally set SITE_URL env (defaults to https://www.bmsventouse.fr).
 *
 * Docs: https://learn.microsoft.com/en-us/bingwebmaster/api/url-submission-api
 */
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.BING_API_KEY;
const SITE_URL = process.env.SITE_URL || 'https://www.bmsventouse.fr';
const SITEMAP_PATH = path.resolve(process.cwd(), 'sitemap.xml');
const ENDPOINT = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${API_KEY}`;

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

  const urls = readSitemapUrls(SITEMAP_PATH);
  if (urls.length === 0) {
    console.error('❌ No URLs found in sitemap.xml');
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URL(s) to Bing...`);
  await submitToBing(urls);
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});