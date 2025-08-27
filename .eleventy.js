const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pluginSitemap = require('@nichoth/eleventy-plugin-sitemap');
const pluginRobotsTxt = require('eleventy-plugin-robotstxt');
const htmlmin = require('html-minifier').minify;

// i18n: locale loader and helpers
const localesCache = {};
function loadLocale(lang) {
  if (localesCache[lang]) return localesCache[lang];
  try {
    const p = path.join(process.cwd(), 'src', '_data', 'locales', `${lang}.json`);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    localesCache[lang] = data;
    return data;
  } catch { return {}; }
}
function getByPath(obj, key) {
  return key.split('.').reduce((o,k)=> (o && o[k]!==undefined) ? o[k] : undefined, obj);
}

// Asset fingerprinting filter (cache-busting)
const fpCache = new Map();
function fileHash(relPath){
  const key = relPath;
  if (fpCache.has(key)) return fpCache.get(key);
  try {
    const p = path.join(process.cwd(), relPath.replace(/^\//,''));
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0,10);
    fpCache.set(key, hash);
    return hash;
  } catch(e){ return Date.now().toString(); }
}

// Util: filtre date (yyyy-MM-dd)
function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") return new Date(value);
  return new Date();
}

module.exports = function(eleventyConfig) {
  // Filters
  eleventyConfig.addNunjucksFilter('fingerprint', p => `${p}${p.includes('?') ? '&' : '?'}v=${fileHash(p)}`);
  eleventyConfig.addNunjucksFilter('t', (key, lang = 'fr', fallback = '') => {
    const dict = loadLocale(lang) || {};
    const val = getByPath(dict, key);
    return (val !== undefined && val !== null) ? val : (fallback || key);
  });
  eleventyConfig.addNunjucksFilter("date", (value, format = "yyyy-MM-dd") => {
    const d = toDate(value);
    if (!d || isNaN(d.getTime())) return "";
    if (format === "yyyy-MM-dd") return d.toISOString().slice(0, 10);
    return d.toISOString();
  });

  // Transforms
  eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html') && process.env.NODE_ENV === 'production') {
      return htmlmin(content, {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true
      });
    }
    return content;
  });
  eleventyConfig.addTransform('img-lazy', function(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      return content.replace(/<img\s+([^>]*?)>/gi, (match, attrs) => {
        if (attrs.includes('loading=')) return match;
        return `<img loading="lazy" ${attrs}>`;
      });
    }
    return content;
  });

  // Plugins
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: process.env.SITE_URL || 'https://www.bmsventouse.fr'
    }
  });
  eleventyConfig.addPlugin(pluginRobotsTxt, {
    policy: [{ userAgent: '*', allow: '/' }],
    sitemap: process.env.SITE_URL
      ? `${process.env.SITE_URL}/sitemap.xml`
      : 'https://www.bmsventouse.fr/sitemap.xml'
  });

  // Shortcodes
  eleventyConfig.addPairedShortcode('hero', (content, kwargs = {}) => {
    const {
      imageDesktop = '', imageMobile = '', alt = '',
      loading = 'eager', fetchpriority, width = 1920, height = 1080,
    } = kwargs || {};
    return `
<section class="hero">
  <picture class="hero-bg">
    ${imageMobile ? `<source media="(max-width: 767px)" srcset="${imageMobile}" type="image/webp">` : ''}
    <img src="${imageDesktop}" alt="${alt}" loading="${loading}" ${fetchpriority ? `fetchpriority="${fetchpriority}"` : ''} width="${width}" height="${height}">
  </picture>
  <div class="hero-overlay"><div class="container">${content}</div></div>
</section>`;
  });
  eleventyConfig.addShortcode('contentCard', (title, html, className = '') =>
    `<article class="content-card${className ? ' ' + className : ''}">${title ? `<h3 class="content-card-title">${title}</h3>` : ''}${html}</article>`
  );
  eleventyConfig.addShortcode('sectionHeader', (eyebrow, title, subtitle) =>
    `<div class="section-header">
      ${eyebrow ? `<div class="eyebrow" style="color:var(--brand-orange);font-weight:800;letter-spacing:.02em;margin-bottom:.25rem">${eyebrow}</div>` : ''}
      <h2 class="section-title" style="margin:.25rem 0 .5rem">${title}</h2>
      ${subtitle ? `<p class="section-subtitle" style="margin:0;color:#4b5563">${subtitle}</p>` : ''}
    </div>`
  );

  // Passthroughs (NO robots.txt passthrough, handled by plugin)
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('js');
  eleventyConfig.addPassthroughCopy('android-chrome-192x192.png');
  eleventyConfig.addPassthroughCopy('android-chrome-192x192.webp');
  eleventyConfig.addPassthroughCopy('android-chrome-512x512.png');
  eleventyConfig.addPassthroughCopy('apple-touch-icon.png');
  eleventyConfig.addPassthroughCopy('favicon-16x16.png');
  eleventyConfig.addPassthroughCopy('favicon-32x32.png');
  eleventyConfig.addPassthroughCopy('favicon.ico');
  eleventyConfig.addPassthroughCopy('site.webmanifest');
  eleventyConfig.addPassthroughCopy('netlify.toml');
  eleventyConfig.addPassthroughCopy('sw.js');

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html'],
  };
};