/**
 * Generate sitemap.xml by scanning the built site (_site).
 * - Includes all .html files copied/built into _site (including passthrough pages)
 * - Derives URL paths from file locations
 * - Adds lastmod from file mtime in ISO format
 */
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(process.cwd(), '_site');
const SITE_URL = 'https://www.bmsventouse.fr';

function walk(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...walk(full));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function toRoute(filePath) {
  // Make relative to OUTPUT_DIR
  const rel = path.relative(OUTPUT_DIR, filePath).replace(/\\/g, '/'); // normalize
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel; // e.g. /offline.html
}

function formatDate(ts) {
  return new Date(ts).toISOString();
}

function build() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error(`Sitemap: output dir not found: ${OUTPUT_DIR}`);
    process.exit(1);
  }
  const files = walk(OUTPUT_DIR);
  const urls = files.map((f) => {
    const stat = fs.statSync(f);
    const loc = SITE_URL.replace(/\/+$/, '') + toRoute(f);
    const lastmod = formatDate(stat.mtimeMs || stat.mtime);
    return { loc, lastmod };
  });

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`
      )
      .join('\n') +
    '\n</urlset>\n';

  const dest = path.join(OUTPUT_DIR, 'sitemap.xml');
  fs.writeFileSync(dest, xml, 'utf8');
  console.log(`Sitemap written: ${dest} (${urls.length} urls)`);
}

build();