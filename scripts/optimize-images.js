const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const webp = require('imagemin-webp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '..', 'images');
const outputDir = inputDir;

(async () => {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const files = await imagemin([`${inputDir}/*.{jpg,jpeg,png}`], {
    destination: outputDir,
    plugins: [
      mozjpeg({ quality: 82 }),
      pngquant({ quality: [0.7, 0.9] })
    ]
  });

  // Generate webp versions
  await imagemin([`${inputDir}/*.{jpg,jpeg,png}`], {
    destination: outputDir,
    plugins: [
      webp({ quality: 80 })
    ]
  });

  console.log(`Optimized ${files.length} images to ${outputDir}`);
})();