/**
 * CI check to detect and auto-fix adjacent duplicate lines in HTML files.
 * - Scans repository recursively
 * - Skips common build/infra folders
 * - Auto-fixes identical adjacent lines (after trim) by merging them onto one line
 * - Re-checks and fails if any duplicates remain (unexpected)
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.git', '_site', '.github']);
const EXT = '.html';

function listHtmlFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.DS_Store')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...listHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(EXT)) {
      files.push(full);
    }
  }
  return files;
}

function mergeAdjacentDuplicatesInLines(lines) {
  const out = [];
  let i = 0;
  let changed = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // skip empty and single-line HTML comments for merging comparison
    const isEmpty = trimmed.length === 0;
    const isHtmlComment = trimmed.startsWith('<!--') && trimmed.endsWith('-->');

    if (!isEmpty && !isHtmlComment) {
      // collect run of identical trimmed lines
      let j = i + 1;
      let count = 1;
      while (j < lines.length) {
        const nextTrim = lines[j].trim();
        const nextEmpty = nextTrim.length === 0;
        const nextComment = nextTrim.startsWith('<!--') && nextTrim.endsWith('-->');
        if (!nextEmpty && !nextComment && nextTrim === trimmed) {
          count++;
          j++;
        } else {
          break;
        }
      }
      if (count > 1) {
        // preserve indentation of the first line
        const indentMatch = line.match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : '';
        out.push(indent + trimmed.repeat(count));
        i = j;
        changed = true;
        continue;
      }
    }

    out.push(line);
    i++;
  }

  return { lines: out, changed };
}

function fixFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const { lines: fixed, changed } = mergeAdjacentDuplicatesInLines(lines);
  if (changed) {
    fs.writeFileSync(filePath, fixed.join('\n'), 'utf8');
  }
  return changed;
}

function checkFile(filePath, problems) {
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

const files = listHtmlFiles(ROOT);

// First pass: auto-fix
let changedCount = 0;
for (const f of files) {
  if (fixFile(f)) changedCount++;
}

// Second pass: verify
const problems = [];
for (const f of files) checkFile(f, problems);

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
  if (changedCount > 0) {
    console.log(`Auto-fixed adjacent duplicate lines in ${changedCount} HTML file(s).`);
  } else {
    console.log('No duplicate adjacent lines found in HTML files.');
  }
}