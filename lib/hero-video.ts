// Picks the right rendition of the intro video for the current device (client only).
export function pickHeroSource(maxQuality: "720" | "1080" = "1080") {
  const portrait = window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
  if (portrait) return "/media/hero/hero-vertical.mp4";
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  const slow = conn?.effectiveType && /(^|-)2g|3g/.test(conn.effectiveType);
  if (maxQuality === "720" || window.innerWidth * window.devicePixelRatio <= 1280 || slow) return "/media/hero/hero-720.mp4";
  return "/media/hero/hero-1080.mp4";
}

export function autoplayAllowed() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !reduce && !saveData;
}
