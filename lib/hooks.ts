"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Read a browser-only value once on the client (null during server render) */
export function useClientValue<T>(read: () => T): T | null {
  return useSyncExternalStore(noopSubscribe, read, () => null);
}

const REDUCED = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(REDUCED);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => true, // server: assume reduced motion, so nothing autoplays before hydration
  );
}
