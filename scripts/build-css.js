// Simple CSS bundler to inline @import entries from css/style.css into a single file.
// No external dependencies. Intended to run before Eleventy so that the bundle is copied via passthrough.
//
// Input:  css/style.css (contains only @import url('./...') lines and comments)
// Output: css/style.bundle.css (concatenation of imported files, in order), minified
//
// Usage: node scripts/build-css.js

const fs = require('fs');
const path = require('path');

const CSS_DIR = path.join(process.cwd(), 'css');
const ENTRY = path.join(CSS_DIR, 'style.css');
const OUT = path.join(CSS_DIR, 'style.bundle.css');

/**
 * Read a file as UTF-8 text.
 */
function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Very small helper to strip BOM and normalize newlines.
 */
function normalize(text) {
  return text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

/**
 * Extract import paths from a CSS file content.
 */
function extractImports(css) {
  const imports = [];
  const re = /@import\s+url\((['"]?)([^'")]+)\1\)\s*;/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    imports.push(m[2]);
  }
  return imports;
}

/**
 * Resolve a CSS import path relative to CSS_DIR.
 */
function resolveImport(p) {
  // remove optional leading ./ or /
  let rel = p.replace(/^\.?\//, '');
  return path.join(CSS_DIR, rel);
}

/**
 * Naive CSS minifier:
 * - remove /* ... *\/ comments
 * - collapse whitespace to single spaces
 * - remove spaces around symbols : ; , { } (safe)
 * - trim
 */
function minifyCss(css) {
  let out = css;

  // Remove comments
  out = out.replace(/\/\*[\s\S]*?\*\//g, '');

  // Collapse whitespace
  out = out.replace(/\s+/g, ' ');

  // Remove spaces around separators
  out = out
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',');

  // Keep a single newline at the end (optional)
  return out.trim();
}

/**
 * Concatenate imported files in order. Skips missing files gracefully.
 */
function bundle() {
  if (!fs.existsSync(ENTRY)) {
    console.warn(`[build-css] Entry not found: ${ENTRY}`);
    return;
  }
  const entry = normalize(read(ENTRY));
  const imports = extractImports(entry);

  let out = '';

  if (!imports.length) {
    // No imports found; just copy the entry as bundle (minified)
    out = minifyCss(entry);
    fs.writeFileSync(OUT, out, 'utf8');
    const bytes = Buffer.byteLength(out, 'utf8');
    console.log(`[build-css] No @import found, wrote bundle ${path.relative(process.cwd(), OUT)} (${bytes} bytes)`);
    return;
  }

  let concatenated = '';
  imports.forEach((imp) => {
    const abs = resolveImport(imp);
    if (!fs.existsSync(abs)) {
      console.warn(`[build-css] Missing import: ${imp} -> ${abs}`);
      return;
    }
    const css = normalize(read(abs));
    concatenated += `\n/* ${path.relative(process.cwd(), abs)} */\n`;
    concatenated += css;
  });

  out = minifyCss(concatenated);
  fs.writeFileSync(OUT, out, 'utf8');
  const bytes = Buffer.byteLength(out, 'utf8');
  console.log(`[build-css] Wrote bundle: ${path.relative(process.cwd(), OUT)} (${bytes} bytes, minified)`);
}

bundle();