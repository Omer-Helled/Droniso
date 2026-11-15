// Media URL helpers shared by server and client components.
// Prototype: images come from the Wix CDN, which resizes on the fly and negotiates AVIF/WebP via the
// Accept header. Phase 3 swaps this file to Supabase Storage — nothing else needs to change.

const WIDTHS = [320, 480, 828, 1200, 1600, 2200, 2800];

export function wixImage(sourceUrl: string, width: number, quality = 82) {
  const name = sourceUrl.split("/media/")[1].split("/")[0];
  return `https://static.wixstatic.com/media/${name}/v1/fit/w_${width},h_${width * 4},q_${quality},enc_avif,quality_auto/${name}`;
}

/** srcset for an image whose largest useful width is maxWidth */
export function srcSetFor(sourceUrl: string, maxWidth: number) {
  const cap = Math.min(maxWidth, 2800);
  const widths = WIDTHS.filter((w) => w < cap).concat(cap);
  return widths.map((w) => `${wixImage(sourceUrl, w)} ${w}w`).join(", ");
}

/** 1200×630 crop for social previews (plain JPEG: crawlers don't negotiate AVIF) */
export function ogImage(sourceUrl: string) {
  const name = sourceUrl.split("/media/")[1].split("/")[0];
  return `https://static.wixstatic.com/media/${name}/v1/fill/w_1200,h_630,al_c,q_85/${name}`;
}
