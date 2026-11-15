import portfolio from "@/content/portfolio.json";
import mediaMeta from "@/content/media-meta.json";
import type { Locale, Localized } from "@/lib/i18n";
import { srcSetFor, wixImage } from "@/lib/media-url";

export { wixImage };

export type CategorySlug = "landscapes" | "real-estate" | "hotels" | "extreme" | "commercials" | "weddings-events";

export type Category = {
  slug: CategorySlug;
  title: Localized;
  blurb: Localized;
  count: number;
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
  draftTitle: boolean;
  year: number | null;
  coords: [number, number] | null;
  src: string;
  duration?: number;
  poster?: string;
  hasAudio?: boolean;
  color: string;
  blur: string;
};

const meta = mediaMeta as Record<string, { color: string; blur: string }>;

export const categories = portfolio.categories as Category[];
export const items: MediaItem[] = (portfolio.items as Omit<MediaItem, "color" | "blur">[]).map((i) => ({
  ...i,
  coords: i.coords as [number, number] | null,
  ...meta[i.id],
}));
export const selectedItems: MediaItem[] = portfolio.selected.map((id) => items.find((i) => i.id === id)!);
export const itemsByCategory = (slug: CategorySlug) => items.filter((i) => i.category === slug);

export function imageSrcSet(item: Pick<MediaItem, "src" | "poster" | "type" | "width">) {
  const source = item.type === "video" ? item.poster! : item.src;
  const max = item.type === "video" ? 1920 : item.width;
  return { src: wixImage(source, Math.min(1200, max)), srcSet: srcSetFor(source, max) };
}

/** Wix stores each video in several renditions; pick one by height */
export function videoUrl(item: Pick<MediaItem, "src">, quality: "480p" | "720p" | "1080p") {
  return item.src.replace(/\/(360p|480p|720p|1080p)\/mp4\//, `/${quality}/mp4/`);
}

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
  draft: boolean;
  telemetry: string;
  /** Wix source URL of the image (or the video poster) */
  image: string;
  maxWidth: number;
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
    draft: item.draftTitle,
    telemetry: telemetry(item),
    image: item.type === "video" ? item.poster! : item.src,
    maxWidth: item.type === "video" ? 1920 : item.width,
    color: item.color,
    blur: item.blur,
    video:
      item.type === "video"
        ? { sd: videoUrl(item, "720p"), hd: videoUrl(item, "1080p"), hasAudio: Boolean(item.hasAudio) }
        : undefined,
  };
}
