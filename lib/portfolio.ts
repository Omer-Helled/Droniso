import portfolio from "@/content/portfolio.json";
import mediaMeta from "@/content/media-meta.json";
import type { Locale, Localized } from "@/lib/i18n";
import { videoUrl, type ImageRef } from "@/lib/media-url";

export type CategorySlug = "landscapes" | "real-estate" | "hotels" | "extreme" | "commercials" | "weddings-events";

export type Category = {
  slug: CategorySlug;
  title: Localized;
  blurb: Localized;
  count: number;
  /** id of the item used as the category's cover */
  cover: string;
};

export type MediaItem = {
  id: string;
  category: CategorySlug;
  order: number;
  type: "image" | "video";
  width: number;
  height: number;
  title: Localized;
  alt: Localized;
  wixTitle: string;
  year: number | null;
  coords: [number, number] | null;
  /** Where the original came from on Wix. Provenance only: the site serves `img` / the local videos. */
  src: string;
  duration?: number;
  poster?: string;
  hasAudio?: boolean;
  /** The photo, or the poster frame of a video */
  img: ImageRef;
  color: string;
  blur: string;
};

type Meta = ImageRef & { color: string; blur: string; video?: boolean };
const metaFile = mediaMeta as unknown as { items: Record<string, Meta>; profile: Meta };

export const profileImage: ImageRef = { key: metaFile.profile.key, w: metaFile.profile.w, fb: metaFile.profile.fb };

export const categories = portfolio.categories as Category[];
export const items: MediaItem[] = (portfolio.items as Omit<MediaItem, "img" | "color" | "blur">[]).map((i) => {
  const m = metaFile.items[i.id];
  const img = { key: m.key, w: m.w, fb: m.fb, ...(m.zoom && { zoom: m.zoom }) };
  return { ...i, coords: i.coords as [number, number] | null, img, color: m.color, blur: m.blur };
});
export const selectedItems: MediaItem[] = portfolio.selected.map((id) => items.find((i) => i.id === id)!);
export const itemsByCategory = (slug: CategorySlug) => items.filter((i) => i.category === slug);

export const categoryCover = (slug: CategorySlug) => {
  const id = categories.find((c) => c.slug === slug)!.cover;
  return items.find((i) => i.id === id)!;
};

export const ratio = (i: Pick<MediaItem, "width" | "height">) => i.width / i.height;

/* --------------------------------- telemetry captions --------------------------------- */

export function formatCoords([lat, lng]: [number, number]) {
  const f = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}°${v >= 0 ? pos : neg}`;
  return `${f(lat, "N", "S")} ${f(lng, "E", "W")}`;
}

export function formatDuration(sec: number) {
  const s = Math.round(sec);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** e.g. "39.30°S 174.06°E · 2023 · VIDEO 00:12" — only real data, nothing invented */
export function telemetry(item: MediaItem) {
  const parts: string[] = [];
  if (item.coords) parts.push(formatCoords(item.coords));
  if (item.year) parts.push(String(item.year));
  if (item.type === "video" && item.duration) parts.push(`VIDEO ${formatDuration(item.duration)}`);
  return parts.join(" · ");
}

export const categoryTitle = (slug: CategorySlug, l: Locale) => categories.find((c) => c.slug === slug)!.title[l];

/** Serializable subset passed to client components */
export type ClientItem = {
  id: string;
  category: CategorySlug;
  type: "image" | "video";
  width: number;
  height: number;
  title: string;
  alt: string;
  telemetry: string;
  img: ImageRef;
  color: string;
  blur: string;
  video?: { sd: string; hd: string; hasAudio: boolean };
};

export function toClientItem(item: MediaItem, l: Locale): ClientItem {
  return {
    id: item.id,
    category: item.category,
    type: item.type,
    width: item.width,
    height: item.height,
    title: item.title[l],
    alt: item.alt[l],
    telemetry: telemetry(item),
    img: item.img,
    color: item.color,
    blur: item.blur,
    video:
      item.type === "video"
        ? { sd: videoUrl(item.img.key, "sd"), hd: videoUrl(item.img.key, "hd"), hasAudio: Boolean(item.hasAudio) }
        : undefined,
  };
}
