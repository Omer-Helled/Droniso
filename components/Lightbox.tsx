"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientItem } from "@/lib/portfolio";
import { ChevronEnd, ChevronStart, Close } from "@/components/Icons";
import { fmt } from "@/lib/i18n";
import { srcSetFor, wixImage } from "@/lib/media-url";

export type LightboxLabels = { close: string; next: string; prev: string; of: string; draft: string };

type Props = {
  items: ClientItem[];
  index: number | null;
  onClose: () => void;
  labels: LightboxLabels;
  dir: "rtl" | "ltr";
};

export function Lightbox({ items, index, onClose, labels, dir }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(index ?? 0);
  const open = index !== null;

  // Open/close the native modal dialog (focus trap, Esc and inert background for free)
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      setCurrent(index!);
      d.showModal();
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(() => {
        trackRef.current?.children[index!]?.scrollIntoView({ behavior: "instant", inline: "center", block: "nearest" });
      });
    }
    if (!open && d.open) d.close();
    if (!open) document.documentElement.style.overflow = "";
  }, [open, index]);

  // Track which slide is visible
  useEffect(() => {
    const track = trackRef.current;
    if (!open || !track) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.i));
      },
      { root: track, threshold: 0.6 },
    );
    Array.from(track.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [open, items]);

  // Only the visible video plays
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.querySelectorAll("video").forEach((v) => {
      const i = Number(v.closest<HTMLElement>("[data-i]")?.dataset.i);
      if (i === current && open) v.play().catch(() => {});
      else v.pause();
    });
  }, [current, open]);

  const go = useCallback(
    (delta: number) => {
      const next = Math.min(items.length - 1, Math.max(0, current + delta));
      trackRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    },
    [current, items.length],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward) {
      e.preventDefault();
      go(1);
    } else if (e.key === back) {
      e.preventDefault();
      go(-1);
    }
  };

  const item = items[current];

  return (
    <dialog ref={dialogRef} className="lightbox" onClose={onClose} onKeyDown={onKeyDown} aria-label={item?.title ?? ""}>
      {open && (
        <>
          <div ref={trackRef} className="lb-track" dir={dir}>
            {items.map((it, i) => {
              const near = Math.abs(i - current) <= 1;
              return (
                <div key={it.id} className="lb-slide" data-i={i} inert={i !== current}>
                  {it.type === "video" && it.video ? (
                    near ? (
                      <video
                        src={it.video.hd}
                        poster={wixImage(it.image, 1920)}
                        controls
                        playsInline
                        muted={!it.video.hasAudio}
                        loop
                        preload="metadata"
                        style={{ aspectRatio: `${it.width} / ${it.height}` }}
                        aria-label={it.alt}
                      />
                    ) : null
                  ) : near ? (
                    <img
                      src={wixImage(it.image, Math.min(2800, it.maxWidth))}
                      srcSet={srcSetFor(it.image, it.maxWidth)}
                      sizes="100vw"
                      alt={it.alt}
                      width={it.width}
                      height={it.height}
                      decoding="async"
                      style={{ backgroundColor: it.color }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none fixed inset-x-0 top-0 flex items-center justify-between px-3 py-3 sm:px-6">
            <span className="font-mono text-[0.75rem] text-white/75" dir="ltr" aria-label={fmt(labels.of, { i: current + 1, n: items.length })}>
              {current + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="pointer-events-auto inline-flex h-11 items-center gap-2 px-2 text-white/90 hover:text-white"
              autoFocus
            >
              <Close className="size-6" />
              <span className="hidden sm:inline">{labels.close}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            disabled={current === 0}
            aria-label={labels.prev}
            className="fixed start-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center text-white/80 hover:text-white disabled:opacity-20 md:grid"
          >
            <ChevronStart className="size-7 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={current === items.length - 1}
            aria-label={labels.next}
            className="fixed end-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center text-white/80 hover:text-white disabled:opacity-20 md:grid"
          >
            <ChevronEnd className="size-7 rtl:rotate-180" />
          </button>

          {item && (
            <div className="fixed inset-x-0 bottom-0 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 sm:px-6" aria-live="polite">
              <p className="text-[0.9375rem] text-white">
                {item.title}
                {item.draft && <span className="telemetry ms-2 !text-accent">{labels.draft}</span>}
              </p>
              {item.telemetry && <p className="telemetry mt-1 !text-white/60">{item.telemetry}</p>}
            </div>
          )}
        </>
      )}
    </dialog>
  );
}
