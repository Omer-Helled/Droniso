"use client";

import type { ReactNode } from "react";

/**
 * "Back to top" link. It scrolls the window itself instead of relying on the #top fragment: iOS Safari
 * does not always scroll to an empty marker element. Focus moves to the top of the page too, so the next
 * Tab continues from there. Without JavaScript the plain #top link still works.
 */
export function BackToTop({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href="#top"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("top")?.focus({ preventScroll: true });
      }}
    >
      {children}
    </a>
  );
}
