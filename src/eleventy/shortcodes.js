/**
 * Register shortcodes.
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
module.exports = function registerShortcodes(eleventyConfig) {
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
    return `
<section class="hero">
  <picture class="hero-bg">
    ${imageMobile ? `<source media="(max-width: 767px)" srcset="${imageMobile}" type="image/webp">` : ''}
    <img src="${imageDesktop}" alt="${alt}" loading="${loading}" ${
      fetchpriority ? `fetchpriority="${fetchpriority}"` : ''
    } width="${width}" height="${height}">
  </picture>
  <div class="hero-overlay"><div class="container">${content}</div></div>
</section>`;
  });

  eleventyConfig.addShortcode(
    'contentCard',
    (title, html, className = '') =>
      `<article class="content-card${className ? ' ' + className : ''}">${
        title ? `<h3 class="content-card-title">${title}</h3>` : ''
      }${html}</article>`
  );

  eleventyConfig.addShortcode(
    'sectionHeader',
    (eyebrow, title, subtitle) =>
      `<div class="section-header">
      ${
        eyebrow
          ? `<div class="eyebrow" style="color:var(--brand-orange);font-weight:800;letter-spacing:.02em;margin-bottom:.25rem">${eyebrow}</div>`
          : ''
      }
      <h2 class="section-title" style="margin:.25rem 0 .5rem">${title}</h2>
      ${subtitle ? `<p class="section-subtitle" style="margin:0;color:#4b5563">${subtitle}</p>` : ''}
    </div>`
  );
};