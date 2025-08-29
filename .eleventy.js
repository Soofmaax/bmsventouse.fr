const registerFilters = require('./src/eleventy/filters');
const registerTransforms = require('./src/eleventy/transforms');
const registerPlugins = require('./src/eleventy/plugins');
const registerShortcodes = require('./src/eleventy/shortcodes');
const utils = require('./src/lib/utils');

module.exports = function (eleventyConfig) {
  // Filters, transforms, plugins, shortcodes
  registerFilters(eleventyConfig, utils);
  registerTransforms(eleventyConfig);
  registerPlugins(eleventyConfig);
  registerShortcodes(eleventyConfig);

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