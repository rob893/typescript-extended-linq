import { Enumerable } from '../Enumerable';

export function asEnumerable<TSource>(src: Iterable<TSource>): Enumerable<TSource> {
  return new Enumerable(src);
}
