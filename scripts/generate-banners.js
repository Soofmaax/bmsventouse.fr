const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

async function ensureFile(srcPath) {
  try {
    await fs.access(srcPath);
    return true;
  } catch {
    return false;
  }
}

async function svgToPng(svgPath, outPath, width, height) {
  const svgExists = await ensureFile(svgPath);
  if (!svgExists) {
    throw new Error(`Source SVG not found: ${svgPath}`);
  }
  const svg = await fs.readFile(svgPath);
  const image = sharp(svg, { density: 300 }); // high density for crisp text
  const buffer = await image
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();

  await fs.writeFile(outPath, buffer);
  console.log(`Generated PNG: ${outPath}`);
}

async function main() {
  const svgSrc = path.join(__dirname, '..', 'images', 'offre-15-nouveaux-clients.svg');
  const pngOut = path.join(__dirname, '..', 'images', 'offre-15-nouveaux-clients.png');

  await svgToPng(svgSrc, pngOut, 1200, 900);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});