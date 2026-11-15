/** Justified rows (Flickr-style): every row fills the width exactly and keeps each item's aspect ratio. */
export type Row<T> = { items: T[]; height: number };

export function targetRowHeight(width: number) {
  if (width < 640) return 118;
  if (width < 1024) return 190;
  if (width < 1500) return 250;
  return 300;
}

export function justify<T>(items: T[], ratioOf: (item: T) => number, width: number, gap: number): Row<T>[] {
  const target = targetRowHeight(width);
  const rows: Row<T>[] = [];
  let row: T[] = [];
  let sum = 0;
  const heightFor = (s: number, n: number) => (width - gap * (n - 1)) / s;

  for (const item of items) {
    const r = ratioOf(item);
    const withItem = heightFor(sum + r, row.length + 1);
    if (withItem > target) {
      row.push(item);
      sum += r;
      continue;
    }
    // Adding this item would make the row shorter than the target: close the row either with or
    // without it, whichever height lands closer to the target.
    const without = row.length ? heightFor(sum, row.length) : Infinity;
    if (row.length && Math.abs(without - target) < Math.abs(withItem - target)) {
      rows.push({ items: row, height: without });
      row = [item];
      sum = r;
    } else {
      rows.push({ items: [...row, item], height: withItem });
      row = [];
      sum = 0;
    }
  }
  // Last row keeps the target height instead of being stretched
  if (row.length) rows.push({ items: row, height: Math.min(target, heightFor(sum, row.length)) });
  return rows;
}
