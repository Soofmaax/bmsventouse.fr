/**
 * Generate responsive, optimized images (WebP + JPG) for hero and key visuals.
 * - Input: images/hero-background-custom.jpg
 * - Output: WebP and JPG variants at multiple widths.
 */
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true }).catch(() => {});
}

async function generateVariants(inputPath, baseOutName, widths, formats = ['webp', 'jpg']) {
  const extless = baseOutName;

  const outDir = path.dirname(inputPath);
  await ensureDir(outDir);

  for (const w of widths) {
    for (const fmt of formats) {
      const outFile = path.join(outDir, `${extless}-${w}.${fmt}`);
      const pipeline = sharp(inputPath)
        .resize({
          width: w,
          withoutEnlargement: true,
          fit: 'cover',
          position: 'center',
        });

      if (fmt === 'webp') {
        await pipeline
          .webp({ quality: 82 })
          .toFile(outFile);
      } else if (fmt === 'jpg') {
        await pipeline
          .jpeg({ quality: 82, mozjpeg: true })
          .toFile(outFile);
      }
      console.log(`Generated ${outFile} (${w}px, ${fmt})`);
    }
  }

  // Also create a moderately compressed original format copy if needed
  const originalWebp = path.join(outDir, `${extless}.webp`);
  await sharp(inputPath).webp({ quality: 82 }).toFile(originalWebp);
  console.log(`Generated ${originalWebp}`);
}

async function main() {
  const imagesDir = path.join(__dirname, '..', 'images');
  const heroJpg = path.join(imagesDir, 'hero-background-custom.jpg');

  // Variants widths tuned for mobile-first LCP improvements
  const widths = [640, 960, 1280, 1920];

  await generateVariants(heroJpg, 'hero-background-custom', widths, ['webp', 'jpg']);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});