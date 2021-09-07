import { Enumerable } from './Enumerable';

export function from<TSource>(src: Iterable<TSource>): Enumerable<TSource> {
  return Enumerable.from(src);
}
