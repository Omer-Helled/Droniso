// Picks the right rendition of the intro video for the current device (client only).
// Files are made by scripts/process-media.mjs from the owner's master. Each size exists in three codecs, and the
// browser gets the most efficient one it can play, so it downloads the smallest file for the same picture:
// AV1 (Chrome, Edge, Firefox, Android, the newest Apple devices), HEVC (Safari on every iPhone and Mac), H.264 (the rest).
// New encodes go in a new folder (v2, v3, ...): /media is cached for a year, so a file's address must never be reused.

export const HERO_BASE = "/media/hero/v2";

const CODECS = [
  ["av1", 'video/mp4; codecs="av01.0.08M.08"'],
  ["hevc", 'video/mp4; codecs="hvc1.1.6.L120.90"'],
] as const;

let codec: "av1" | "hevc" | "h264" | undefined;
function bestCodec() {
  if (!codec) {
    const probe = document.createElement("video");
    codec = CODECS.find(([, type]) => probe.canPlayType(type) !== "")?.[0] ?? "h264";
  }
  return codec;
}

export function pickHeroSource(maxQuality: "720" | "1080" = "1080") {
  const portrait = window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  const slow = conn?.effectiveType && /(^|-)2g|3g/.test(conn.effectiveType);
  const size = portrait ? "vertical" : maxQuality === "720" || window.innerWidth * window.devicePixelRatio <= 1280 || slow ? "720" : "1080";
  return `${HERO_BASE}/hero-${size}-${bestCodec()}.mp4`;
}

/** Safety net: a browser that claimed it can play AV1 or HEVC but then fails to decode the file gets the H.264 one */
export function fallBackToH264(v: HTMLVideoElement) {
  if (!/-(av1|hevc)\.mp4$/.test(v.currentSrc || v.src)) return;
  v.src = (v.currentSrc || v.src).replace(/-(av1|hevc)\.mp4$/, "-h264.mp4");
  if (autoplayAllowed()) v.play().catch(() => {});
}

export function autoplayAllowed() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !reduce && !saveData;
}
