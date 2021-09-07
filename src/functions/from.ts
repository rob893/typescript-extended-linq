import { Enumerable } from '../Enumerable';

export function from<TSource>(src: Iterable<TSource>): Enumerable<TSource> {
  if (src instanceof Enumerable) {
    return src;
  }

  return new Enumerable(src);
}
