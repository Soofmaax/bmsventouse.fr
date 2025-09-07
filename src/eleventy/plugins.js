const pluginSitemap = require('@nichoth/eleventy-plugin-sitemap');
const pluginRobotsTxt = require('eleventy-plugin-robotstxt');

/**
 * Register Eleventy plugins (sitemap, robots.txt).
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
module.exports = function registerPlugins(eleventyConfig) {
  const isProd = process.env.CONTEXT === 'production' || process.env.NODE_ENV === 'production';
  const siteUrl = process.env.SITE_URL || 'https://www.bmsventouse.fr';

  // Sitemap
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: siteUrl,
    },
  });

  // Robots.txt
  eleventyConfig.addPlugin(
    pluginRobotsTxt,
    isProd
      ? {
          policy: [{ userAgent: '*', allow: '/' }],
          sitemap: `${siteUrl}/sitemap.xml`,
          host: siteUrl,
        }
      : {
          policy: [{ userAgent: '*', disallow: '/' }],
        }
  );
};