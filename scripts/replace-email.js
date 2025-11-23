/**
 * Replace legacy email addresses across the repository before deployment.
 * This is a build-time script and does not run in the browser.
 *
 * NOTE 2025-11: politique mise à jour.
 * L’email principal est désormais bms.ventouse@gmail.com.
 * Ce script est conservé pour compatibilité mais ne fait plus de remplacement.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = new Set(['.html', '.txt', '.md', '.xml', '.json']);

function shouldProcess(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!TARGETS.has(ext)) return false;
  // Avoid binary or lock files by basic heuristics
  const basename = path.basename(filePath);
  if (basename.endsWith('.lock') || basename.endsWith('.ico')) return false;
  return true;
}

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    // Skip common directories we shouldn't touch
    if (entry.isDirectory()) {
      if (['.git', 'node_modules', 'netlify'].includes(entry.name)) continue;
      walk(path.join(dir, entry.name), files);
    } else {
      const full = path.join(dir, entry.name);
      if (shouldProcess(full)) files.push(full);
    }
  }
  return files;
}

function replaceAll(content, map) {
  let updated = content;
  for (const [from, to] of map) {
    if (updated.includes(from)) {
      updated = updated.split(from).join(to);
    }
  }
  return updated;
}

function main() {
  const files = walk(ROOT, []);
  // Plus aucun remplacement automatique: les emails sont maintenus directement dans le code.
  const map = new Map([]);

  let changed = 0;
  for (const file of files) {
    try {
      const original = fs.readFileSync(file, 'utf8');
      const updated = replaceAll(original, map);
      if (updated !== original) {
        fs.writeFileSync(file, updated, 'utf8');
        changed++;
      }
    } catch (_) {
      // ignore and continue
    }
  }

  // Minimal stdout so build logs show effect without noise
  process.stdout.write(`replace-email: updated ${changed} files\n`);
}

main();