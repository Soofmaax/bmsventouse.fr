// Nunjucks date filter (default yyyy-MM-dd)
function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') return new Date(value);
  return new Date();
}
const { EleventyI18nPlugin } = require("@11ty/eleventy-plugin-i18n");
const fs = require("fs");
const path = require("path");

// --- Shortcodes ---
module.exports = function(eleventyConfig) {
  // Nunjucks date filter (default yyyy-MM-dd)
  eleventyConfig.addNunjucksFilter('date', (value, format = 'yyyy-MM-dd') => {
    const d = toDate(value);
    if (!d || isNaN(d.getTime())) return '';
    if (format === 'yyyy-MM-dd') return d.toISOString().slice(0, 10);
    // Fallback: return ISO if unknown format
    return d.toISOString();
  });

  // Paired shortcode for hero (avoids Nunjucks caller issues)
  eleventyConfig.addPairedShortcode('hero', (content, kwargs = {}) => {
    const {
      imageDesktop = '',
      imageMobile = '',
      alt = '',
      loading = 'eager',
      fetchpriority,
      width = 1920,
      height = 1080,
    } = kwargs || {};
    return `\n<section class="hero">\n  <picture class="hero-bg">\n    ${imageMobile ? `<source media="(max-width: 767px)" srcset="${imageMobile}" type="image/webp">` : ''}\n    <img src="${imageDesktop}" alt="${alt}" loading="${loading}" ${fetchpriority ? `fetchpriority="${fetchpriority}"` : ''} width="${width}" height="${height}">\n  </picture>\n  <div class="hero-overlay">\n    <div class="container">\n      ${content}\n    </div>\n  </div>\n</section>`;
  });

  // NEW: Shortcodes for contentCard and sectionHeader
  eleventyConfig.addShortcode('contentCard', function(title, html, className='') {
    return `<article class="content-card${className ? ' ' + className : ''}">${title ? `<h3 class="content-card-title">${title}</h3>` : ''}${html}</article>`;
  });
  eleventyConfig.addShortcode('sectionHeader', function(eyebrow, title, subtitle) {
    return `<div class="section-header">${
      eyebrow ? `<div class="eyebrow" style="color:var(--brand-orange);font-weight:800;letter-spacing:.02em;margin-bottom:.25rem">${eyebrow}</div>` : ''
    }<h2 class="section-title" style="margin:.25rem 0 .5rem">${title}</h2>${
      subtitle ? `<p class="section-subtitle" style="margin:0;color:#4b5563">${subtitle}</p>` : ''
    }</div>`;
  });

  // i18n setup
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "fr",
    errorMode: "never"
  });

  // Collection for services (from Markdown)
  eleventyConfig.addCollection("services", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/services/*.md").sort((a, b) =>
      (a.data.order || 0) - (b.data.order || 0)
    );
  });

  // Passthroughs, etc.
  eleventyConfig.addPassthroughCopy("images");
};
function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') return new Date(value);
  return new Date();
}
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  [
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-192x192.webp",
    "android-chrome-512x512.png",
    "site.webmanifest",
    "robots.txt",
    "netlify.toml"
  ].forEach(asset => eleventyConfig.addPassthroughCopy(asset));
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};