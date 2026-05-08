#!/usr/bin/env node
/**
 * Compiles all HTML pages that use <script type="text/babel"> inline.
 * Removes the Babel CDN script tag and replaces text/babel blocks with
 * plain compiled <script> tags. Uses @babel/preset-react only (no preset-env)
 * so modern JS syntax (optional chaining, nullish coalescing, etc.) is preserved.
 */

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const BASE = '/Users/aayush/Downloads/PTC Website';

// Find all HTML files containing Babel references
function findBabelFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and assets
      if (['node_modules', 'assets', '.git', 'ptc-os'].includes(entry.name)) continue;
      findBabelFiles(fullPath, results);
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('babel') && content.includes('type="text/babel"')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const BABEL_CDN_RE = /<script[^>]+unpkg\.com\/@babel[^>]*><\/script>\s*/g;
const BABEL_SCRIPT_START = '<script type="text/babel">';
const SCRIPT_END = '</script>';

function compilePage(fpath) {
  let html = fs.readFileSync(fpath, 'utf8');

  // Find the text/babel block
  const start = html.indexOf(BABEL_SCRIPT_START);
  if (start === -1) return false;

  const end = html.indexOf(SCRIPT_END, start + BABEL_SCRIPT_START.length);
  if (end === -1) return false;

  const jsx = html.slice(start + BABEL_SCRIPT_START.length, end);

  // Compile JSX → plain JS
  let compiled;
  try {
    const result = babel.transformSync(jsx, {
      presets: ['@babel/preset-react'],
      filename: path.basename(fpath),
    });
    compiled = result.code;
  } catch (err) {
    console.error(`  ERROR compiling ${fpath.replace(BASE + '/', '')}: ${err.message}`);
    return false;
  }

  // Remove Babel CDN script tags
  let newHtml = html.replace(BABEL_CDN_RE, '');

  // Also remove local babel.min.js references if any
  newHtml = newHtml.replace(/<script[^>]+babel\.min\.js[^>]*><\/script>\s*/g, '');

  // Replace <script type="text/babel">...</script> with <script>compiled</script>
  const compiledBlock = '<script>\n' + compiled + '\n</script>';
  newHtml = newHtml.slice(0, newHtml.indexOf(BABEL_SCRIPT_START))
    + compiledBlock
    + newHtml.slice(newHtml.indexOf(SCRIPT_END, newHtml.indexOf(BABEL_SCRIPT_START) + BABEL_SCRIPT_START.length) + SCRIPT_END.length);

  fs.writeFileSync(fpath, newHtml, 'utf8');
  return true;
}

const files = findBabelFiles(BASE);
console.log(`Found ${files.length} pages with Babel\n`);

let ok = 0, failed = 0;
for (const f of files) {
  const rel = f.replace(BASE + '/', '');
  const result = compilePage(f);
  if (result) {
    ok++;
    process.stdout.write(`  ✓ ${rel}\n`);
  } else {
    failed++;
    process.stdout.write(`  ✗ ${rel}\n`);
  }
}

console.log(`\nDone: ${ok} compiled, ${failed} failed`);
