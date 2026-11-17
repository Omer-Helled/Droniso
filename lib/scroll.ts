"use client";

/**
 * Height used to decide when the visitor has scrolled past the full-screen hero.
 * On phones the browser bar grows and shrinks while scrolling, which changes window.innerHeight on
 * almost every frame. Measuring once (and again only when the width changes, i.e. on rotation)
 * keeps the threshold still, so elements that depend on it don't flip back and forth.
 */
export function stableViewportHeight(onChange?: (h: number) => void) {
  let width = window.innerWidth;
  let height = window.innerHeight;
  const onResize = () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    height = window.innerHeight;
    onChange?.(height);
  };
  window.addEventListener("resize", onResize);
  return { get: () => height, dispose: () => window.removeEventListener("resize", onResize) };
}

/** Scroll position clamped to the page, ignoring iOS rubber-band overscroll at the top and bottom */
export function clampedScrollY() {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(Math.max(window.scrollY, 0), max);
}
