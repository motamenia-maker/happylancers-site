// Builds the hosted (claude.ai Artifact) copy of the website from index.html.
// The host wraps the page in its own <html>/<head>/<body>, so those tags, the charset/viewport
// metas and the favicon link are removed, and the tab title becomes just the name.
// Usage: node build-hosted.js <output folder>   → <output>/happy-lancers.html + <output>/assets/logo.png
const fs = require('fs');
const path = require('path');

const out = process.argv[2];
if (!out) { console.error('usage: node build-hosted.js <output folder>'); process.exit(1); }

let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const drop = [
  /<!doctype html>\s*/i, /<html[^>]*>\s*/i, /<\/html>\s*/i, /<head>\s*/i, /<\/head>\s*/i, /<body>\s*/i, /<\/body>\s*/i,
  /\s*<meta charset="[^"]*">/i, /\s*<meta name="viewport"[^>]*>/i, /\s*<link rel="icon"[^>]*>/i,
];
for (const re of drop) {
  if (!re.test(html)) throw new Error(`expected to find ${re} in index.html`);
  html = html.replace(re, '');
}
html = html.replace(/<title>[^<]*<\/title>/, '<title>Happy Lancers</title>').trim() + '\n';

fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
fs.writeFileSync(path.join(out, 'happy-lancers.html'), html);
fs.copyFileSync(path.join(__dirname, 'assets', 'logo.png'), path.join(out, 'assets', 'logo.png'));
console.log('built', path.join(out, 'happy-lancers.html'), html.length, 'chars');
