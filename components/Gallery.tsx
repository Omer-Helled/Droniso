"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { planJustified, sizesFor } from "@/lib/justify";
import type { CategorySlug, ClientItem } from "@/lib/portfolio";
import { MediaTile } from "@/components/MediaTile";
import { Lightbox, type LightboxLabels } from "@/components/Lightbox";
import { fmt } from "@/lib/i18n";

type Props = {
  /** Show the category filter buttons (the /work page); category pages pass false */
  showFilter?: boolean;
  items: ClientItem[];
  categories: { slug: CategorySlug; title: string; count: number }[];
  labels: { all: string; filterLabel: string; open: string } & LightboxLabels;
  dir: "rtl" | "ltr";
};

/** Category deep links look like #work/landscapes; single items like #p-<id> */
export function Gallery({ items, categories, labels, dir, showFilter = true }: Props) {
  const [filter, setFilter] = useState<CategorySlug | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(() => (filter === "all" ? items : items.filter((i) => i.category === filter)), [items, filter]);

  // Row layout is planned ahead per breakpoint (pure function of the items), so server and client render the same markup
  const plan = useMemo(() => planJustified(visible.map((i) => i.width / i.height)), [visible]);

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
      {showFilter && (
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
      )}

      <ul className="jg">
        {visible.map((item, i) => (
          <Fragment key={item.id}>
            <li className="it" style={{ ["--r" as string]: (item.width / item.height).toFixed(4) }}>
              <MediaTile
                item={item}
                className="size-full"
                sizes={sizesFor(plan.widths[i])}
                priority={i < 6}
                highPriority={i < 2}
                overlay
                openLabel={fmt(labels.open, { title: item.title })}
                onOpen={() => setOpenIndex(i)}
              />
            </li>
            {plan.breaksAfter[i].length > 0 && <li aria-hidden className={`br ${plan.breaksAfter[i].map((b) => `br-${b}`).join(" ")}`} />}
          </Fragment>
        ))}
        {Object.entries(plan.fillers).map(([bp, g]) => (
          <li key={bp} aria-hidden className={`fl fl-${bp}`} style={{ ["--g" as string]: g }} />
        ))}
      </ul>

      <Lightbox items={visible} index={openIndex} onClose={() => setOpenIndex(null)} labels={labels} dir={dir} />
    </>
  );
}
