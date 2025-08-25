const fs = require("fs");
const path = require("path");

// Util: filtre date (yyyy-MM-dd)
function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") return new Date(value);
  return new Date();
}

module.exports = function(eleventyConfig) {
  // Filtre Nunjucks date
  eleventyConfig.addNunjucksFilter("date", (value, format = "yyyy-MM-dd") => {
    const d = toDate(value);
    if (!d || isNaN(d.getTime())) return "";
    if (format === "yyyy-MM-dd") return d.toISOString().slice(0, 10);
    return d.toISOString();
  });

  // Shortcode hero (paired)
  eleventyConfig.addPairedShortcode("hero", (content, kwargs = {}) => {
    const {
      imageDesktop = "", imageMobile = "", alt = "",
      loading = "eager", fetchpriority, width = 1920, height = 1080,
    } = kwargs || {};
    return `
<section class="hero">
  <picture class="hero-bg">
    ${imageMobile ? `<source media="(max-width: 767px)" srcset="${imageMobile}" type="image/webp">` : ""}
    <img src="${imageDesktop}" alt="${alt}" loading="${loading}" ${fetchpriority ? `fetchpriority="${fetchpriority}"` : ""} width="${width}" height="${height}">
  </picture>
  <div class="hero-overlay"><div class="container">${content}</div></div>
</section>`;
  });

  // Shortcodes UI
  eleventyConfig.addShortcode("contentCard", (title, html, className = "") =>
    `<article class="content-card${className ? " " + className : ""}">${title ? `<h3 class="content-card-title">${title}</h3>` : ""}${html}</article>`
  );
  eleventyConfig.addShortcode("sectionHeader", (eyebrow, title, subtitle) =>
    `<div class="section-header">
      ${eyebrow ? `<div class="eyebrow" style="color:var(--brand-orange);font-weight:800;letter-spacing:.02em;margin-bottom:.25rem">${eyebrow}</div>` : ""}
      <h2 class="section-title" style="margin:.25rem 0 .5rem">${title}</h2>
      ${subtitle ? `<p class="section-subtitle" style="margin:0;color:#4b5563">${subtitle}</p>` : ""}
    </div>`
  );

  // Passthroughs
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("android-chrome-192x192.webp");
  eleventyConfig.addPassthroughCopy("android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("netlify.toml");

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
