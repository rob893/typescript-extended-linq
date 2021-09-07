import { count } from './count';
import { sum } from './sum';

export function average<TSource>(src: Iterable<TSource>, selector?: (item: TSource) => number): number {
  return sum(src, selector) / count(src);
}
