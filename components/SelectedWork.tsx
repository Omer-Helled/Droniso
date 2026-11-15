"use client";

import { useState } from "react";
import type { ClientItem } from "@/lib/portfolio";
import { MediaTile } from "@/components/MediaTile";
import { Lightbox, type LightboxLabels } from "@/components/Lightbox";
import { fmt } from "@/lib/i18n";

type Props = {
  items: ClientItem[];
  /** How many items go in each row, in order — e.g. [1, 2, 1, 3, 2, 1] */
  rows: number[];
  labels: { open: string } & LightboxLabels;
  dir: "rtl" | "ltr";
};

export function SelectedWork({ items, rows, labels, dir }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const grouped = rows.map((n, r) => {
    const start = rows.slice(0, r).reduce((a, b) => a + b, 0);
    return items.slice(start, start + n).map((item, j) => ({ item, index: start + j }));
  });

  return (
    <>
      <div className="flex flex-col gap-[clamp(28px,5vw,72px)]">
        {grouped.map((row, r) => (
          <div key={r} className="ed-row" data-reveal>
            {row.map(({ item, index }) => {
              const ratio = item.width / item.height;
              const share = ratio / row.reduce((s, x) => s + x.item.width / x.item.height, 0);
              return (
                <figure key={item.id} style={{ ["--r" as string]: ratio.toFixed(4) }}>
                  <MediaTile
                    item={item}
                    style={{ aspectRatio: `${item.width} / ${item.height}` }}
                    sizes={`(min-width: 1440px) ${Math.round(1344 * share)}px, ${Math.round(share * 100)}vw`}
                    autoplayVideo
                    priority={r === 0}
                    openLabel={fmt(labels.open, { title: item.title })}
                    onOpen={() => setOpenIndex(index)}
                  />
                  <figcaption className="mt-3 flex flex-col gap-1">
                    <span className={`leading-snug text-text/90 ${row.length > 1 ? "text-[0.8125rem] sm:text-[0.875rem]" : "text-[0.875rem]"}`}>{item.title}</span>
                    {item.telemetry && <span className={`telemetry ${row.length > 1 ? "hidden sm:block" : ""}`}>{item.telemetry}</span>}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        ))}
      </div>
      <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} labels={labels} dir={dir} />
    </>
  );
}
