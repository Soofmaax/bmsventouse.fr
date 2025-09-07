/**
 * Register Nunjucks filters.
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 * @param {{ fileHash: Function, loadLocale: Function, getByPath: Function, toDate: Function }} utils
 */
module.exports = function registerFilters(eleventyConfig, utils) {
  eleventyConfig.addNunjucksFilter('fingerprint', (p) => {
    const v = utils.fileHash(p);
    return `${p}${p.includes('?') ? '&' : '?'}v=${v}`;
  });

  eleventyConfig.addNunjucksFilter('t', (key, lang = 'fr', fallback = '') => {
    const dict = utils.loadLocale(lang) || {};
    const val = utils.getByPath(dict, key);
    return val !== undefined && val !== null ? val : fallback || key;
  });

  eleventyConfig.addNunjucksFilter('date', (value, format = 'yyyy-MM-dd') => {
    const d = utils.toDate(value);
    if (!d || isNaN(d.getTime())) return '';
    if (format === 'yyyy-MM-dd') return d.toISOString().slice(0, 10);
    return d.toISOString();
  });
};