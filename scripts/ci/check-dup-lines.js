/**
 * Simple CI check to detect adjacent duplicate lines in HTML files.
 * - Scans repository recursively
 * - Skips common build/infra folders
 * - Flags identical adjacent lines (after trim)
 * - Exits with code 1 if any duplicates are found
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.git', '_site', '.github']);
const EXT = '.html';

const problems = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.DS_Store')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith(EXT)) {
      checkFile(full);
    }
  }
}

function checkFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  let prevTrim = null;
  for (let i = 0; i < lines.length; i++) {
    const curTrim = lines[i].trim();
    // ignore empty lines and comments for duplicate detection
    const isEmpty = curTrim.length === 0;
    const isHtmlComment = curTrim.startsWith('<!--') && curTrim.endsWith('-->');
    if (!isEmpty && !isHtmlComment && prevTrim !== null && curTrim === prevTrim) {
      problems.push({
        file: filePath,
        line: i + 1, // 1-based
        snippet: lines[i],
      });
    }
    prevTrim = curTrim;
  }
}

walk(ROOT);

if (problems.length > 0) {
  console.error('Duplicate adjacent lines detected in HTML files:');
  for (const p of problems) {
    console.error(`- ${p.file}:${p.line} -> ${p.snippet}`);
  }
  console.error(
    '\nPlease remove the duplicate adjacent line(s). This check trims whitespace and ignores empty lines and single-line HTML comments.'
  );
  process.exit(1);
} else {
  console.log('No duplicate adjacent lines found in HTML files.');
}