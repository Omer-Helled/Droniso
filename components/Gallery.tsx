"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { justify } from "@/lib/justify";
import type { CategorySlug, ClientItem } from "@/lib/portfolio";
import { MediaTile } from "@/components/MediaTile";
import { Lightbox, type LightboxLabels } from "@/components/Lightbox";
import { fmt } from "@/lib/i18n";

type Props = {
  items: ClientItem[];
  categories: { slug: CategorySlug; title: string; count: number }[];
  labels: { all: string; filterLabel: string; open: string } & LightboxLabels;
  dir: "rtl" | "ltr";
};

/** Category deep links look like #work/landscapes; single items like #p-<id> */
export function Gallery({ items, categories, labels, dir }: Props) {
  const [filter, setFilter] = useState<CategorySlug | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(() => (filter === "all" ? items : items.filter((i) => i.category === filter)), [items, filter]);

  // Measure the container; until then (server render) the CSS-only .justified fallback is used
  const listRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const gap = width !== null && width >= 640 ? 8 : 6;
  const rows = useMemo(
    () => (width ? justify(visible, (i) => i.width / i.height, width, gap) : null),
    [visible, width, gap],
  );

  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (h.startsWith("work/")) {
        const slug = h.slice(5) as CategorySlug;
        if (categories.some((c) => c.slug === slug)) setFilter(slug);
      } else if (h.startsWith("p-")) {
        const idx = items.findIndex((i) => i.id === h.slice(2));
        if (idx >= 0) {
          setFilter("all");
          setOpenIndex(idx);
        }
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [items, categories]);

  const filters = [{ slug: "all" as const, title: labels.all, count: items.length }, ...categories];

  return (
    <>
      <div role="group" aria-label={labels.filterLabel} className="no-scrollbar -mx-[var(--gutter)] mb-6 flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mb-8">
        {filters.map((f) => {
          const active = filter === f.slug;
          return (
            <button
              key={f.slug}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.slug)}
              className={`inline-flex h-10 shrink-0 items-center gap-2 border px-4 text-[0.9375rem] transition-colors ${
                active ? "border-text bg-text text-bg" : "border-line text-text/80 hover:border-line-strong hover:text-text"
              }`}
            >
              {f.title}
              <span className={`font-mono text-[0.6875rem] ${active ? "text-bg/60" : "text-muted"}`}>{f.count}</span>
            </button>
          );
        })}
      </div>

      <div ref={listRef}>
        {rows ? (
          <ul className="flex flex-col" style={{ gap }} aria-live="polite">
            {rows.map((row, r) => (
              <li key={r} className="flex" style={{ gap, height: row.height }}>
                {row.items.map((item) => {
                  const i = visible.indexOf(item);
                  const w = (item.width / item.height) * row.height;
                  return (
                    <MediaTile
                      key={item.id}
                      item={item}
                      className="h-full shrink-0"
                      style={{ width: w }}
                      sizes={`${Math.ceil(w)}px`}
                      overlay
                      openLabel={fmt(labels.open, { title: item.title })}
                      onOpen={() => setOpenIndex(i)}
                    />
                  );
                })}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="justified">
            {visible.map((item, i) => (
              <li key={item.id} style={{ ["--r" as string]: (item.width / item.height).toFixed(4) }}>
                <MediaTile
                  item={item}
                  className="size-full"
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 70vw"
                  overlay
                  openLabel={fmt(labels.open, { title: item.title })}
                  onOpen={() => setOpenIndex(i)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Lightbox items={visible} index={openIndex} onClose={() => setOpenIndex(null)} labels={labels} dir={dir} />
    </>
  );
}
