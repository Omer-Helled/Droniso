"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientItem } from "@/lib/portfolio";
import { ChevronEnd, ChevronStart, Close, ZoomIn } from "@/components/Icons";
import { fmt } from "@/lib/i18n";
import { jpgUrl, zoomUrl } from "@/lib/media-url";
import { Picture } from "@/components/Picture";

export type LightboxLabels = { close: string; next: string; prev: string; of: string; zoom: string; zoomOut: string; pan: string };

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
  // id of the panorama shown in the zoom view, if any
  const [zoomId, setZoomId] = useState<string | null>(null);
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
  const zoomed = open && item?.img.zoom && zoomId === item.id ? item : null;
  const zoomButtonRef = useRef<HTMLButtonElement>(null);
  const unzoom = () => {
    setZoomId(null);
    requestAnimationFrame(() => zoomButtonRef.current?.focus());
  };
  const close = () => {
    setZoomId(null);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      onClose={close}
      // Esc leaves the zoom view first, then the lightbox
      onCancel={(e) => {
        if (zoomed) {
          e.preventDefault();
          unzoom();
        }
      }}
      onKeyDown={onKeyDown}
      aria-label={item?.title ?? ""}
    >
      {open && (
        <div className="contents" inert={!!zoomed}>
          {/* Focusable so keyboard users can reach the scrolling area itself; arrow keys move between items */}
          <div ref={trackRef} className="lb-track focus-visible:-outline-offset-4" dir={dir} tabIndex={0} role="group" aria-label={fmt(labels.of, { i: current + 1, n: items.length })}>
            {items.map((it, i) => {
              const near = Math.abs(i - current) <= 1;
              return (
                <div key={it.id} className="lb-slide" data-i={i} inert={i !== current}>
                  {it.type === "video" && it.video ? (
                    near ? (
                      <video
                        poster={jpgUrl(it.img)}
                        controls
                        playsInline
                        muted={!it.video.hasAudio}
                        loop
                        preload="metadata"
                        style={{ aspectRatio: `${it.width} / ${it.height}` }}
                        aria-label={it.alt}
                      >
                        {/* Phones get the lighter file, except the one video with sound (only its HD file has audio) */}
                        {!it.video.hasAudio && <source src={it.video.sd} type="video/mp4" media="(max-width: 767px)" />}
                        <source src={it.video.hd} type="video/mp4" />
                      </video>
                    ) : null
                  ) : near ? (
                    <Picture
                      onDoubleClick={it.img.zoom ? () => setZoomId(it.id) : undefined}
                      img={it.img}
                      // The image is limited by the viewport's height as well as its width
                      sizes={`min(100vw, ${Math.round((it.width / it.height) * 100)}vh)`}
                      alt={it.alt}
                      width={it.width}
                      height={it.height}
                      loading="eager"
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
            <div className="flex items-center gap-1">
              {item?.img.zoom && (
                <button
                  ref={zoomButtonRef}
                  type="button"
                  onClick={() => setZoomId(item.id)}
                  className="pointer-events-auto inline-flex h-11 items-center gap-2 px-2 text-white/90 hover:text-white"
                >
                  <ZoomIn className="size-6" />
                  <span className="sr-only sm:not-sr-only">{labels.zoom}</span>
                </button>
              )}
              <button
                type="button"
                onClick={close}
                className="pointer-events-auto inline-flex h-11 items-center gap-2 px-2 text-white/90 hover:text-white"
                autoFocus
              >
                <Close className="size-6" />
                <span className="sr-only sm:not-sr-only">{labels.close}</span>
              </button>
            </div>
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
              </p>
              {item.telemetry && <p className="telemetry mt-1 !text-white/60">{item.telemetry}</p>}
            </div>
          )}
        </div>
      )}
      {zoomed && <PanoramaView item={zoomed} labels={labels} onClose={unzoom} />}
    </dialog>
  );
}

/** A panorama at full screen height, panned sideways by swiping, dragging, the mouse wheel or the arrow keys */
function PanoramaView({ item, labels, onClose }: { item: ClientItem; labels: LightboxLabels; onClose: () => void }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(false);

  // Start in the middle of the panorama, with the keyboard ready to pan
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.focus({ preventScroll: true });
  }, []);

  // Mouse: drag to pan (touch screens scroll natively)
  const drag = useRef<{ x: number; left: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    setMoved(true);
    drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current) e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div className="fixed inset-0 z-10 bg-[#070808]">
      <div
        ref={scrollerRef}
        dir="ltr"
        tabIndex={0}
        role="img"
        aria-label={`${item.alt}. ${labels.pan}`}
        className="no-scrollbar h-full cursor-grab overflow-x-auto overflow-y-hidden overscroll-contain focus-visible:-outline-offset-4 active:cursor-grabbing"
        // The hint goes away on the first touch (not on scroll: centering the view scrolls it too)
        onTouchStart={() => setMoved(true)}
        // A vertical mouse wheel pans sideways
        onWheel={(e) => {
          setMoved(true);
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.currentTarget.scrollLeft += e.deltaY;
        }}
        // The lightbox moves between items on arrow keys; here they pan instead
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.stopPropagation();
            setMoved(true);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="relative h-full w-max" style={{ aspectRatio: `${item.width} / ${item.height}`, backgroundColor: item.color }}>
          {/* The regular size is already loaded, so something shows at once; the wide file replaces it */}
          <Picture img={item.img} sizes={`${Math.round((item.width / item.height) * 100)}vh`} alt="" className="absolute inset-0 size-full" loading="eager" />
          <img src={zoomUrl(item.img)} alt="" draggable={false} decoding="async" className="absolute inset-0 size-full" />
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-0 flex items-center justify-end px-3 py-3 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto inline-flex h-11 items-center gap-2 bg-black/40 px-3 text-white/90 backdrop-blur-sm hover:text-white"
        >
          <Close className="size-6" />
          <span>{labels.zoomOut}</span>
        </button>
      </div>
      <p
        aria-hidden
        className={`telemetry pointer-events-none fixed inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] text-center !text-white/80 transition-opacity duration-500 ${moved ? "opacity-0" : "opacity-100"}`}
      >
        ← {labels.pan} →
      </p>
    </div>
  );
}
