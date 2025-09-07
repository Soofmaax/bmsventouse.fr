const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Cache for locales
const localesCache = {};

/**
 * Load locale JSON file from src/_data/locales/{lang}.json
 */
function loadLocale(lang) {
  if (localesCache[lang]) return localesCache[lang];
  try {
    const p = path.join(process.cwd(), 'src', '_data', 'locales', `${lang}.json`);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    localesCache[lang] = data;
    return data;
  } catch {
    return {};
  }
}

/**
 * Safe get nested property from object via dot path (e.g., "a.b.c").
 */
function getByPath(obj, key) {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

// Cache for file hashes to avoid recompute
const fpCache = new Map();

/**
 * Compute short md5 hash for a given relative path, to use as fingerprint.
 * Falls back to current timestamp string if file cannot be read.
 */
function fileHash(relPath) {
  const key = relPath;
  if (fpCache.has(key)) return fpCache.get(key);
  try {
    const p = path.join(process.cwd(), relPath.replace(/^\//, ''));
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 10);
    fpCache.set(key, hash);
    return hash;
  } catch (e) {
    const fallback = Date.now().toString();
    fpCache.set(key, fallback);
    return fallback;
  }
}

/**
 * Normalize input to Date instance.
 */
function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') return new Date(value);
  return new Date();
}

module.exports = {
  loadLocale,
  getByPath,
  fileHash,
  toDate,
};