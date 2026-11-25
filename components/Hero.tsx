"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Pause, Play } from "@/components/Icons";
import { useClientValue } from "@/lib/hooks";
import { autoplayAllowed, pickHeroSource } from "@/lib/hero-video";

type Props = {
  sub: string;
  ctaWork: { href: string; label: string };
  ctaQuote: { href: string; label: string };
  pauseLabel: string;
  playLabel: string;
  scrollLabel: string;
};

const SLOGAN = ["ABOVE AND BEYOND", "PHOTOGRAPHY"];
const FPS = 30;

function timecode(t: number) {
  const total = Math.floor(t);
  const ff = Math.floor((t - total) * FPS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}:${pad(ff)}`;
}

export function Hero({ sub, ctaWork, ctaQuote, pauseLabel, playLabel, scrollLabel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  // Choose the right rendition once we know the viewport (client only)
  const src = useClientValue(pickHeroSource);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Respect reduced-motion and data-saver: show the poster and let the visitor press play
    const v = videoRef.current;
    if (!v || !src) return;
    if (!autoplayAllowed()) return;
    v.play().catch(() => setPlaying(false));
  }, [src]);

  // Pause when the hero is off-screen (saves battery), resume when it comes back
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let userPaused = false;
    const onPause = () => {
      if (document.visibilityState === "visible" && v.dataset.autopaused !== "1") userPaused = true;
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !v.paused) {
        v.dataset.autopaused = "1";
        v.pause();
      } else if (e.isIntersecting && v.dataset.autopaused === "1" && !userPaused) {
        v.dataset.autopaused = "";
        v.play().catch(() => {});
      }
    });
    io.observe(v);
    v.addEventListener("pause", onPause);
    v.addEventListener("play", () => (userPaused = false));
    return () => {
      io.disconnect();
      v.removeEventListener("pause", onPause);
    };
  }, []);

  // Running timecode, read straight from the video
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v && tcRef.current) tcRef.current.textContent = timecode(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    if (playing) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const offsets = SLOGAN.map((_, li) => SLOGAN.slice(0, li).reduce((n, l) => n + l.length, 0));
  return (
    <section aria-labelledby="hero-title" className="relative isolate h-[100svh] min-h-[560px] w-full overflow-hidden bg-black">
      {/* Poster: the video's first frame, so there is no jump when playback starts */}
      <picture>
        <source media="(max-width: 767px) and (orientation: portrait)" type="image/avif" srcSet="/media/hero/poster-vertical.avif" />
        <source media="(max-width: 767px) and (orientation: portrait)" type="image/webp" srcSet="/media/hero/poster-vertical.webp" />
        <source type="image/avif" srcSet="/media/hero/poster-1080.avif" />
        <source type="image/webp" srcSet="/media/hero/poster-1080.webp" />
        <img
          src="/media/hero/poster-1080.jpg"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover"
        />
      </picture>
      <video
        ref={videoRef}
        src={src ?? undefined}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
        onPlaying={() => {
          setPlaying(true);
          setReady(true);
        }}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 -z-10 size-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />
      {/* Legibility scrim */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

      <div className="viewfinder hidden sm:block" style={{ ["--vf-inset" as string]: "clamp(14px, 2.2vw, 28px)", top: "calc(var(--header-h) + 8px)" }} aria-hidden />

      <div className="container-x flex h-full flex-col justify-end pb-[max(20px,env(safe-area-inset-bottom))]">
        {/* The slogan is English in both languages, so it always reads and aligns left to right */}
        <h1 id="hero-title" lang="en" dir="ltr" className="text-left font-light uppercase leading-[0.95] tracking-[0.06em] text-text">
          <span className="sr-only">Above and beyond photography</span>
          {SLOGAN.map((line, li) => (
            <span key={li} aria-hidden className="block text-[clamp(2.25rem,8.2vw,8.5rem)]">
              {line.split("").map((ch, i) => (
                <span key={i} className="slogan-letter" style={{ ["--i" as string]: offsets[li] + i }}>
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="mt-6 flex flex-col gap-6 sm:mt-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[36ch] text-[1.0625rem] leading-relaxed text-text/85 sm:text-lg">{sub}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={ctaWork.href}
              className="inline-flex h-12 items-center bg-text px-6 font-medium text-bg transition-colors hover:bg-white"
            >
              {ctaWork.label}
            </a>
            <a
              href={ctaQuote.href}
              className="inline-flex h-12 items-center border border-white/50 px-6 text-text transition-colors hover:border-text hover:bg-white/10"
            >
              {ctaQuote.label}
            </a>
          </div>
        </div>

        {/* OSD row */}
        <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-3 sm:mt-10">
          <div className="telemetry flex items-center gap-2 !text-white/75">
            <span className={`rec-dot inline-block size-1.5 rounded-full bg-accent ${playing ? "" : "!animate-none opacity-40"}`} />
            <span>TC</span>
            <span ref={tcRef}>00:00:00:00</span>
          </div>
          <a href={ctaWork.href} className="telemetry hidden items-center gap-1.5 !text-white/75 hover:!text-white sm:flex">
            <ArrowDown className="size-3.5" />
            {scrollLabel}
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? pauseLabel : playLabel}
            className="-me-2 grid size-10 place-items-center text-white/85 hover:text-white"
          >
            {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
        </div>
      </div>
    </section>
  );
}
