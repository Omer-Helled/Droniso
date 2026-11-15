"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ClientItem } from "@/lib/portfolio";
import { Play } from "@/components/Icons";
import { srcSetFor, wixImage } from "@/lib/media-url";
import { usePrefersReducedMotion } from "@/lib/hooks";

const videoBadge = (item: ClientItem) =>
  item.telemetry.split(" · ").find((p) => p.startsWith("VIDEO"))?.replace("VIDEO ", "") ?? "VIDEO";

type Props = {
  item: ClientItem;
  sizes: string;
  onOpen: () => void;
  openLabel: string;
  /** Autoplay a muted preview of videos while they are on screen */
  autoplayVideo?: boolean;
  /** Show title + telemetry overlay on hover (gallery). Selected work shows captions below instead. */
  overlay?: boolean;
  priority?: boolean;
  /** Hint the browser to fetch this image first (likely LCP) */
  highPriority?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function MediaTile({ item, sizes, onOpen, openLabel, autoplayVideo, overlay, priority, highPriority, className = "", style }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const motionOk = !usePrefersReducedMotion();

  useEffect(() => {
    if (item.type !== "video") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [item.type]);

  const playPreview = item.type === "video" && motionOk && ((autoplayVideo && inView) || (hover && inView));

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      aria-label={item.type === "video" ? `${openLabel} · ${videoBadge(item)}` : openLabel}
      className={`media-frame media-hover group block w-full cursor-zoom-in text-start ${className}`}
      style={{ ["--ph-color" as string]: item.color, ["--ph-blur" as string]: `url("${item.blur}")`, ...style }}
    >
      <img
        src={wixImage(item.image, Math.min(1200, item.maxWidth))}
        srcSet={srcSetFor(item.image, item.maxWidth)}
        sizes={sizes}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading={priority || highPriority ? "eager" : "lazy"}
        fetchPriority={highPriority ? "high" : undefined}
        decoding="async"
      />
      {playPreview && item.video && (
        <video src={item.video.sd} muted loop playsInline autoPlay preload="metadata" aria-hidden className="pointer-events-none" />
      )}
      <span className="viewfinder" style={{ ["--vf-inset" as string]: "10px", ["--vf-size" as string]: "14px" }} aria-hidden />
      {item.type === "video" && (
        <span className="telemetry absolute start-2.5 top-2.5 flex items-center gap-1.5 bg-black/55 px-1.5 py-1 !text-white/90" aria-hidden>
          <Play className="size-2.5" />
          {videoBadge(item)}
        </span>
      )}
      {overlay && (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 hidden translate-y-1 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2.5 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:block"
        >
          <span className="block truncate text-sm text-white">{item.title}</span>
          {item.telemetry && <span className="telemetry mt-0.5 block truncate !text-white/70">{item.telemetry}</span>}
        </span>
      )}
    </button>
  );
}
