import { Enumerable } from '../Enumerable';
import { select } from './select';

export function chunk<TSource>(src: Iterable<TSource>, chunkSize: number): Enumerable<Enumerable<TSource>> {
  return select(src, (x, i) => ({ index: i, value: x }))
    .groupBy(x => Math.floor(x.index / chunkSize))
    .select(x => x.select(v => v.value));
}
