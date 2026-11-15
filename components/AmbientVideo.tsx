"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@/components/Icons";
import { useClientValue } from "@/lib/hooks";
import { autoplayAllowed, pickHeroSource } from "@/lib/hero-video";

const pick720 = () => pickHeroSource("720");

/** The intro video as a dimmed background (contact page), with a pause button as required for moving content */
export function AmbientVideo({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const src = useClientValue(pick720);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (v && src && autoplayAllowed()) v.play().catch(() => {});
  }, [src]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      <picture>
        <source media="(max-width: 767px) and (orientation: portrait)" type="image/avif" srcSet="/media/hero/poster-vertical.avif" />
        <source type="image/avif" srcSet="/media/hero/poster-1080.avif" />
        <source type="image/webp" srcSet="/media/hero/poster-1080.webp" />
        <img src="/media/hero/poster-1080.jpg" alt="" className="absolute inset-0 size-full object-cover" />
      </picture>
      <video
        ref={ref}
        src={src ?? undefined}
        muted
        loop
        playsInline
        aria-hidden
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
      />
      <div aria-hidden className="absolute inset-0 bg-bg/80" />
      <button
        type="button"
        onClick={() => {
          const v = ref.current;
          if (!v) return;
          if (v.paused) v.play().catch(() => {});
          else v.pause();
        }}
        aria-label={playing ? pauseLabel : playLabel}
        className="absolute bottom-3 end-3 z-10 grid size-10 place-items-center text-white/60 hover:text-white"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </div>
  );
}
