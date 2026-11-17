#!/usr/bin/env node
// Turns the original media (media/originals, see backup-wix-media.mjs) into the files the site serves:
//   public/media/v1/<key>/<width>.avif   responsive images (AVIF)
//   public/media/v1/<key>/<width>.jpg    fallback for browsers without AVIF
//   public/media/v1/<key>/hd.mp4, sd.mp4 videos (lightbox / tile preview)
//   public/media/v1/<key>/og.jpg         1200x630 social preview (category covers, profile)
//   public/media/v1/<key>/<zoom>.avif    panoramas only: a wide version for the lightbox's zoom view
//   public/media/hero/*                  the intro video in three renditions, with poster frames
// and writes content/media-meta.json (key, widths, placeholder colour + blur per item).
// Finished files are skipped, so it is safe to re-run. Use --force to redo everything.
// If an image is ever re-encoded differently, bump "base" in content/media-config.json (files are cached for a year).

import { readFile, readdir, writeFile, mkdir, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import sharp from "sharp";

const run = promisify(execFile);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const orig = path.join(root, "media/originals");
const cfg = JSON.parse(await readFile(path.join(root, "content/media-config.json"), "utf8"));
const wix = JSON.parse(await readFile(path.join(root, "content/wix-export/site-content.json"), "utf8"));
const portfolio = JSON.parse(await readFile(path.join(root, "content/portfolio.json"), "utf8"));
const outRoot = path.join(root, "public", cfg.base);
const force = process.argv.includes("--force");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);

const exists = async (f) => !force && (await stat(f).then((s) => s.size > 0, () => false));
const toHex = (d) => "#" + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
export const keyOf = (wixId) => wixId.slice(-10);

/** Widths to generate: the standard ladder below the cap, plus the cap itself */
function ladder(srcW, srcH) {
  const ratio = srcW / srcH;
  const cap = Math.round(Math.min(srcW, ratio >= 1 ? cfg.maxSide : cfg.maxSide * ratio));
  const widths = cfg.widths.filter((w) => w <= cap * 0.87).concat(cap);
  const fallback = [...new Set(cfg.fallbackWidths.map((w) => Math.min(w, cap)))];
  return { cap, widths, fallback };
}

async function images(file, key, { og = false } = {}) {
  const dir = path.join(outRoot, key);
  await mkdir(dir, { recursive: true });
  const meta = await sharp(file).rotate().metadata();
  const [srcW, srcH] = meta.orientation >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  const { cap, widths, fallback } = ladder(srcW, srcH);

  // Decode and downscale the original once; every size is derived from this master
  let master;
  const getMaster = async () =>
    (master ??= await sharp(file, { limitInputPixels: false }).rotate().resize({ width: cap }).removeAlpha().raw().toBuffer({ resolveWithObject: true }));
  const from = async () => {
    const m = await getMaster();
    return sharp(m.data, { raw: m.info });
  };

  for (const w of widths) {
    const f = path.join(dir, `${w}.avif`);
    if (!(await exists(f))) await (await from()).resize({ width: w }).avif({ quality: w <= 800 ? 52 : 56, effort: 4 }).toFile(f);
  }
  for (const w of fallback) {
    const f = path.join(dir, `${w}.jpg`);
    if (!(await exists(f))) await (await from()).resize({ width: w }).jpeg({ quality: 76, mozjpeg: true }).toFile(f);
  }
  if (og) {
    const f = path.join(dir, "og.jpg");
    if (!(await exists(f))) await (await from()).resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toFile(f);
  }
  // Panoramas are tiny on a phone when fitted to the screen. The lightbox can show them at full screen
  // height instead, panned sideways, which needs far more pixels than the regular sizes. Loaded only on demand.
  let zoom;
  if (srcW / srcH >= cfg.panorama.minRatio && srcW > cap) {
    zoom = Math.min(srcW, cfg.panorama.zoomWidth);
    const f = path.join(dir, `${zoom}.avif`);
    if (!(await exists(f))) await sharp(file, { limitInputPixels: false }).rotate().resize({ width: zoom }).removeAlpha().avif({ quality: 50, effort: 4 }).toFile(f);
  }
  const tiny = await from();
  const { data } = await tiny.clone().resize(1, 1, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
  const blur = await (await from()).resize(24, 24, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return { key, w: widths, fb: fallback, ...(zoom && { zoom }), color: toHex(data), blur: `data:image/webp;base64,${blur.toString("base64")}` };
}

async function video(file, key, hasAudio) {
  const dir = path.join(outRoot, key);
  const common = ["-v", "error", "-y", "-i", file, "-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
  const hd = path.join(dir, "hd.mp4");
  if (!(await exists(hd))) {
    const audio = hasAudio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"];
    await run("ffmpeg", [...common, "-crf", "23", "-maxrate", "4000k", "-bufsize", "8000k", ...audio, hd], { maxBuffer: 1 << 26 });
  }
  const sd = path.join(dir, "sd.mp4"); // muted tile preview: longest side 1280 at most, never upscaled
  if (!(await exists(sd))) {
    const scale = "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'";
    await run("ffmpeg", [...common, "-vf", scale, "-crf", "26", "-maxrate", "1400k", "-bufsize", "2800k", "-an", sd], { maxBuffer: 1 << 26 });
  }
}

async function findOriginal(dir, wixId, kind) {
  const files = await readdir(path.join(orig, dir));
  const tag = wixId.slice(-6);
  const hit = files.find((f) => {
    if (!f.includes(tag)) return false;
    if (kind === "poster") return f.endsWith(".poster.jpg");
    if (kind === "video") return f.endsWith(".mp4");
    return !f.endsWith(".poster.jpg") && !f.endsWith(".mp4");
  });
  if (!hit) throw new Error(`missing original for ${dir}/${wixId} (${kind}) — run scripts/backup-wix-media.mjs first`);
  return path.join(orig, dir, hit);
}

const covers = new Set(portfolio.categories.map((c) => c.cover).concat(portfolio.selected[0]));
const audio = new Set(portfolio.items.filter((i) => i.hasAudio).map((i) => i.id));
const jobs = wix.categories.flatMap((c) => c.items.map((i) => ({ ...i, slug: c.slug })));
const keys = jobs.map((j) => keyOf(j.wixId));
if (new Set(keys).size !== keys.length) throw new Error("media keys are not unique");

const metaPath = path.join(root, "content/media-meta.json");
const previous = JSON.parse(await readFile(metaPath, "utf8").catch(() => "{}"));
const out = { items: { ...(previous.items ?? {}) }, profile: previous.profile };

let done = 0;
const queue = jobs.filter((j) => !only || j.slug === only || keyOf(j.wixId) === only);
const started = Date.now();
await Promise.all(
  Array.from({ length: 2 }, async () => {
    while (queue.length) {
      const j = queue.shift();
      const key = keyOf(j.wixId);
      const src = await findOriginal(j.slug, j.wixId, j.type === "video" ? "poster" : "image");
      const m = await images(src, key, { og: covers.has(j.wixId) });
      if (j.type === "video") {
        await video(await findOriginal(j.slug, j.wixId, "video"), key, audio.has(j.wixId));
        m.video = true;
      }
      out.items[j.wixId] = m;
      process.stdout.write(`\r${++done}/${jobs.length} ${j.slug}/${key}            `);
    }
  }),
);

/** The intro video: three renditions (desktop, small screens, vertical for phones) and their poster frames */
async function hero() {
  const src = path.join(orig, "site/hero-video.mp4");
  const dir = path.join(root, "public/media/hero");
  await mkdir(dir, { recursive: true });
  const x264 = ["-an", "-c:v", "libx264", "-preset", "slower", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
  const vertical = "crop=608:1080:656:0,scale=720:1280:flags=lanczos"; // centre 9:16 crop
  const renditions = {
    "hero-1080.mp4": ["-b:v", "1800k", "-maxrate", "3000k", "-bufsize", "3600k"],
    "hero-720.mp4": ["-vf", "scale=1280:720", "-crf", "25", "-maxrate", "1100k", "-bufsize", "2200k"],
    "hero-vertical.mp4": ["-vf", vertical, "-crf", "25", "-maxrate", "950k", "-bufsize", "1500k"],
  };
  for (const [name, args] of Object.entries(renditions)) {
    const f = path.join(dir, name);
    if (!(await exists(f))) await run("ffmpeg", ["-v", "error", "-y", "-i", src, ...x264, ...args, f], { maxBuffer: 1 << 26 });
  }
  // Posters are the first frame, so nothing jumps when playback starts
  const frame = async (filter) =>
    (await run("ffmpeg", ["-v", "error", "-i", src, "-frames:v", "1", ...(filter ? ["-vf", filter] : []), "-f", "image2pipe", "-vcodec", "png", "-"], { encoding: "buffer", maxBuffer: 1 << 27 })).stdout;
  for (const [name, filter] of [["poster-1080", null], ["poster-vertical", vertical]]) {
    if (await exists(path.join(dir, `${name}.jpg`))) continue;
    const base = sharp(await frame(filter));
    await base.clone().avif({ quality: 55 }).toFile(path.join(dir, `${name}.avif`));
    await base.clone().webp({ quality: 72 }).toFile(path.join(dir, `${name}.webp`));
    await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(dir, `${name}.jpg`));
  }
  const og = path.join(dir, "og.jpg"); // social preview for the home page
  if (!(await exists(og))) await sharp(path.join(dir, "poster-1080.jpg")).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toFile(og);
}

if (!only) {
  out.profile = await images(path.join(orig, "site/profile-2.jpg"), "profile", { og: true });
  await hero();
}
await writeFile(metaPath, JSON.stringify(out, null, 1) + "\n");
console.log(`\nDone in ${Math.round((Date.now() - started) / 1000)}s → ${path.relative(root, outRoot)}/, content/media-meta.json`);
