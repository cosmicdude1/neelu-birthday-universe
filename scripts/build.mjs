import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

const copyTargets = ['index.html', 'css', 'js', 'assets'];
const ignoredFiles = new Set(['README.txt', '.DS_Store', 'Thumbs.db']);

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (ignoredFiles.has(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function collectFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      collectFiles(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

console.log('Building "A Little Universe for Neelu" for production...');

// 1. Validate all JS files syntax before building
const jsFiles = collectFiles(path.join(rootDir, 'js')).filter((f) => f.endsWith('.js'));
for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}
console.log(`✓ Verified syntax for ${jsFiles.length} JavaScript files`);

// 2. Clean and recreate dist/
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const target of copyTargets) {
  const srcPath = path.join(rootDir, target);
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Missing required production path: ${target}`);
  }
  copyRecursive(srcPath, path.join(distDir, target));
}

// 3. Write Cloudflare Workers Static Assets _headers (mirroring vercel.json)
const headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/css/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/js/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
`;
fs.writeFileSync(path.join(distDir, '_headers'), headersContent, 'utf8');

// 4. Verify all asset paths referenced in index.html & js/config.js exist in dist/
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const configJs = fs.readFileSync(path.join(distDir, 'js', 'config.js'), 'utf8');

const htmlRefs = [...indexHtml.matchAll(/(?:src|href)="(?!https?:\/\/|data:)([^"]+)"/g)].map((m) => m[1]);
const assetRefs = [...new Set([...configJs.matchAll(/assets\/[a-zA-Z0-9_./-]+\.[a-zA-Z0-9]+/g)].map((m) => m[0]))];

for (const ref of [...htmlRefs, ...assetRefs]) {
  const distFile = path.join(distDir, ref);
  if (!fs.existsSync(distFile) || fs.statSync(distFile).size === 0) {
    throw new Error(`Missing or empty asset in dist/: ${ref}`);
  }
}

const builtFiles = collectFiles(distDir);
const totalBytes = builtFiles.reduce((sum, f) => sum + fs.statSync(f).size, 0);
const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

console.log(`✓ Verified ${htmlRefs.length} HTML local references and ${assetRefs.length} media assets`);
console.log(`✓ Production build ready in dist/ (${builtFiles.length} files, ${totalMB} MB)`);
