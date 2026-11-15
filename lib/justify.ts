/**
 * Justified rows (Flickr-style) without JavaScript at runtime.
 * Rows are computed ahead of time for four breakpoint ranges at a representative container width.
 * The markup then contains invisible line-break markers per breakpoint, and each item grows in
 * proportion to its aspect ratio — so every row fills the width exactly and all items in a row share
 * one height, in the server HTML already (no layout shift after hydration).
 */
export type Breakpoint = "s" | "m" | "l" | "x";

/** Representative container width, gap and target row height per range (see .jg in globals.css) */
export const BREAKPOINTS: Record<Breakpoint, { width: number; gap: number; target: number; minViewport: number }> = {
  s: { width: 358, gap: 6, target: 118, minViewport: 0 },
  m: { width: 754, gap: 8, target: 190, minViewport: 640 },
  l: { width: 1184, gap: 8, target: 250, minViewport: 1024 },
  x: { width: 1344, gap: 8, target: 300, minViewport: 1500 },
};

type Row = { start: number; end: number; height: number; last: boolean };

function rows(ratios: number[], width: number, gap: number, target: number): Row[] {
  const out: Row[] = [];
  const h = (sum: number, n: number) => (width - gap * (n - 1)) / sum;
  let start = 0;
  let sum = 0;
  for (let i = 0; i < ratios.length; i++) {
    const r = ratios[i];
    const n = i - start + 1;
    const withItem = h(sum + r, n);
    if (withItem > target) {
      sum += r;
      continue;
    }
    // The row would get shorter than the target: close it with or without this item,
    // whichever lands closer to the target height.
    const without = n > 1 ? h(sum, n - 1) : Infinity;
    if (n > 1 && Math.abs(without - target) < Math.abs(withItem - target)) {
      out.push({ start, end: i - 1, height: without, last: false });
      start = i;
      sum = r;
    } else {
      out.push({ start, end: i, height: withItem, last: false });
      start = i + 1;
      sum = 0;
    }
  }
  if (start < ratios.length) out.push({ start, end: ratios.length - 1, height: Math.min(target, h(sum, ratios.length - start)), last: true });
  return out;
}

export type JustifiedPlan = {
  /** Breakpoints at which a row ends after item i (not including the very last item) */
  breaksAfter: Breakpoint[][];
  /** Growth of the invisible filler in the last row per breakpoint, so a short last row isn't stretched */
  fillers: Partial<Record<Breakpoint, number>>;
  /** Approximate rendered width of each item per breakpoint, for the `sizes` attribute */
  widths: Record<Breakpoint, number>[];
};

export function planJustified(ratios: number[]): JustifiedPlan {
  const breaksAfter: Breakpoint[][] = ratios.map(() => []);
  const fillers: JustifiedPlan["fillers"] = {};
  const widths: Record<Breakpoint, number>[] = ratios.map(() => ({ s: 0, m: 0, l: 0, x: 0 }));
  for (const bp of Object.keys(BREAKPOINTS) as Breakpoint[]) {
    const { width, gap, target } = BREAKPOINTS[bp];
    for (const row of rows(ratios, width, gap, target)) {
      for (let i = row.start; i <= row.end; i++) widths[i][bp] = Math.round(ratios[i] * row.height);
      if (!row.last) breaksAfter[row.end].push(bp);
      else {
        const n = row.end - row.start + 1;
        const sum = ratios.slice(row.start, row.end + 1).reduce((a, b) => a + b, 0);
        const spare = (width - gap * n) / target - sum; // ratio units left empty at target height
        if (spare > 0.05) fillers[bp] = +spare.toFixed(3);
      }
    }
  }
  return { breaksAfter, fillers, widths };
}

export function sizesFor(w: Record<Breakpoint, number>) {
  return `(min-width: 1500px) ${w.x}px, (min-width: 1024px) ${w.l}px, (min-width: 640px) ${w.m}px, ${w.s}px`;
}
