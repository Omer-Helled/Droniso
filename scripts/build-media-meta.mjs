#!/usr/bin/env node
// Generates content/media-meta.json (dominant color + tiny blurred placeholder per gallery item)
// and the hero poster images in public/media/hero/. Needs media/originals (run backup-wix-media.mjs first).
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const orig = path.join(root, 'media/originals');
const content = JSON.parse(await readFile(path.join(root, 'content/wix-export/site-content.json'), 'utf8'));

async function findFile(dir, wixId, poster) {
  const files = await readdir(path.join(orig, dir));
  const tag = wixId.slice(-6);
  const hit = files.find((f) => f.includes(tag) && (poster ? f.endsWith('.poster.jpg') : !f.endsWith('.poster.jpg') && !f.endsWith('.mp4')));
  if (!hit) throw new Error(`missing original for ${dir}/${wixId}`);
  return path.join(orig, dir, hit);
}

const toHex = ({ r, g, b }) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

const meta = {};
for (const cat of content.categories) {
  for (const item of cat.items) {
    const file = await findFile(cat.slug, item.wixId, item.type === 'video');
    const img = sharp(file).rotate();
    const { data } = await img.clone().resize(1, 1, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const lqip = await img.clone().resize(24, 24, { fit: 'inside' }).webp({ quality: 40 }).toBuffer();
    meta[item.wixId] = { color: toHex({ r: data[0], g: data[1], b: data[2] }), blur: `data:image/webp;base64,${lqip.toString('base64')}` };
  }
}
await writeFile(path.join(root, 'content/media-meta.json'), JSON.stringify(meta, null, 1) + '\n');
console.log(`media-meta.json: ${Object.keys(meta).length} items`);

// Hero posters = first frame of the hero video (so there is no visual jump when playback starts)
const heroDir = path.join(root, 'public/media/hero');
await mkdir(heroDir, { recursive: true });
const src = path.join(orig, 'site/hero-video.mp4');
const frame = (crop) => execFileSync('ffmpeg', ['-v', 'error', '-i', src, '-frames:v', '1', ...(crop ? ['-vf', crop] : []), '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 64 << 20 });
const posters = { 'poster-1080': [frame(), 1920], 'poster-vertical': [frame('crop=608:1080:656:0,scale=720:1280'), 720] };
for (const [name, [buf, w]] of Object.entries(posters)) {
  const base = sharp(buf).resize({ width: w });
  await base.clone().avif({ quality: 55 }).toFile(path.join(heroDir, `${name}.avif`));
  await base.clone().webp({ quality: 72 }).toFile(path.join(heroDir, `${name}.webp`));
  await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(heroDir, `${name}.jpg`));
}
console.log('hero posters written');
