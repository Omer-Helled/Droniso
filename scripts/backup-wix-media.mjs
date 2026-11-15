#!/usr/bin/env node
// Downloads every original photo/video from the current Wix site into media/originals/.
// Source list: content/wix-export/site-content.json (62 gallery items + site assets, ~375 MB).
// Usage: node scripts/backup-wix-media.mjs   (Node 18+, no dependencies; safe to re-run, skips finished files)

import { readFile, mkdir, stat, writeFile, rename } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const content = JSON.parse(await readFile(path.join(root, 'content/wix-export/site-content.json'), 'utf8'));
const outDir = path.join(root, 'media/originals');

const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
const extOf = (url, type) => (type === 'video' ? '.mp4' : path.extname(new URL(url).pathname) || '.jpg');

const jobs = [];
for (const cat of content.categories) {
  for (const item of cat.items) {
    const n = String(item.order).padStart(2, '0');
    const base = `${n}-${item.title ? slugify(item.title) : 'untitled'}-${item.wixId.slice(-6)}`;
    jobs.push({ url: item.source, file: path.join(outDir, cat.slug, base + extOf(item.source, item.type)), bytes: item.bytes });
    if (item.poster) jobs.push({ url: item.poster, file: path.join(outDir, cat.slug, base + '.poster.jpg') });
  }
}
for (const a of content.siteAssets) {
  jobs.push({ url: a.source, file: path.join(outDir, 'site', a.key + extOf(a.source, a.type)), bytes: a.bytes });
}

async function exists(file, bytes) {
  try { const s = await stat(file); return bytes ? s.size === bytes : s.size > 0; } catch { return false; }
}

async function download({ url, file, bytes }, attempt = 1) {
  if (await exists(file, bytes)) return 'skip';
  await mkdir(path.dirname(file), { recursive: true });
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tmp = file + '.part';
    await pipeline(Readable.fromWeb(res.body), createWriteStream(tmp));
    await rename(tmp, file);
    return 'ok';
  } catch (e) {
    if (attempt < 4) { await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt)); return download({ url, file, bytes }, attempt + 1); }
    return 'fail: ' + e.message;
  }
}

let done = 0;
const failures = [];
const queue = [...jobs];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const job = queue.shift();
    const r = await download(job);
    done++;
    if (r.startsWith('fail')) failures.push({ ...job, error: r });
    process.stdout.write(`\r${done}/${jobs.length}  ${path.relative(outDir, job.file).padEnd(70).slice(0, 70)}`);
  }
}));
console.log(`\nDone. ${jobs.length - failures.length}/${jobs.length} files in ${path.relative(root, outDir)}/`);
if (failures.length) {
  await writeFile(path.join(outDir, 'failures.json'), JSON.stringify(failures, null, 2));
  console.log(`${failures.length} failed - see media/originals/failures.json and re-run.`);
  process.exitCode = 1;
}
