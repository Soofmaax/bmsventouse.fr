// Nunjucks date filter (default yyyy-MM-dd)
function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') return new Date(value);
  return new Date();
}
module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksFilter('date', (value, format = 'yyyy-MM-dd') => {
    const d = toDate(value);
    if (!d || isNaN(d.getTime())) return '';
    if (format === 'yyyy-MM-dd') return d.toISOString().slice(0, 10);
    // Fallback: return ISO if unknown format
    return d.toISOString();
  });
  eleventyConfig.addPassthroughCopy("images");
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