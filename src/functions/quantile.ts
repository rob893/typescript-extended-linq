import { Enumerable } from '..';

export function quantile<TSource>(src: Iterable<TSource>, selector: (item: TSource) => number, q: number): number {
  const sorted = Enumerable.from(src)
    .select(selector)
    .orderBy(x => x)
    .toArray();
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}
