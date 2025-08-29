const fs = require('fs');
const path = require('path');
const { toDate, getByPath, fileHash } = require('../src/lib/utils');

describe('utils.toDate', () => {
  it('returns Date for string input', () => {
    const d = toDate('2024-01-02');
    expect(d instanceof Date).toBe(true);
  });

  it('returns Date for number input', () => {
    const d = toDate(1704153600000);
    expect(d instanceof Date).toBe(true);
  });

  it('returns Date for invalid input', () => {
    const d = toDate({ a: 1 });
    expect(d instanceof Date).toBe(true);
  });
});

describe('utils.getByPath', () => {
  it('gets nested value by dot path', () => {
    const obj = { a: { b: { c: 5 } } };
    expect(getByPath(obj, 'a.b.c')).toBe(5);
    expect(getByPath(obj, 'a.x.c')).toBeUndefined();
  });
});

describe('utils.fileHash', () => {
  const tmpFile = path.join(process.cwd(), 'tmp_test_utils.txt');

  beforeAll(() => {
    fs.writeFileSync(tmpFile, 'hello world');
  });

  afterAll(() => {
    try { fs.unlinkSync(tmpFile); } catch {}
  });

  it('returns stable hash for same file', () => {
    const rel = tmpFile.replace(process.cwd(), '').replace(/^\/+/, '');
    const h1 = fileHash(rel);
    const h2 = fileHash(rel);
    expect(typeof h1).toBe('string');
    expect(h1).toBe(h2);
  });
});