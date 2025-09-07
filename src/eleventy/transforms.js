const htmlmin = require('html-minifier').minify;

/**
 * Register Eleventy transforms.
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
module.exports = function registerTransforms(eleventyConfig) {
  // HTML minification in production
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html') && process.env.NODE_ENV === 'production') {
      return htmlmin(content, {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
      });
    }
    return content;
  });

  // Add loading=lazy to <img> without it
  eleventyConfig.addTransform('img-lazy', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      return content.replace(/<img\s+([^>]*?)>/gi, (match, attrs) => {
        if (attrs.includes('loading=')) return match;
        return `<img loading="lazy" ${attrs}>`;
      });
    }
    return content;
  });
};