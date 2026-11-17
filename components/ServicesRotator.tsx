"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const INTERVAL_MS = 4500;

/**
 * Wraps the categories index and decides which category the large preview shows (data-active, read by CSS).
 * The preview cycles through the categories on its own while it is on screen. Pointing at a row or tabbing to
 * it shows that category and pauses the cycle until the pointer or focus leaves. Nothing cycles when the device
 * asks for reduced motion, or where the preview is hidden (below the lg breakpoint, the rows have thumbnails).
 */
export function ServicesRotator({ count, className, children }: { count: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  // Only cycle while the preview is actually on screen (a hidden preview never intersects)
  useEffect(() => {
    const preview = ref.current?.querySelector(".services-preview");
    if (!preview) return;
    const io = new IntersectionObserver(([e]) => setPreviewVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(preview);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!previewVisible || held || reduceMotion) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [previewVisible, held, reduceMotion, count]);

  const show = (target: EventTarget) => {
    const li = (target as Element).closest?.<HTMLElement>("li[data-i]");
    if (li) setActive(Number(li.dataset.i));
  };

  return (
    <div
      ref={ref}
      className={className}
      data-active={active}
      data-held={held || undefined}
      onPointerOver={(e) => {
        if (e.pointerType !== "mouse") return;
        show(e.target);
        setHeld(true);
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
      onFocus={(e) => {
        show(e.target);
        setHeld(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      {children}
    </div>
  );
}
