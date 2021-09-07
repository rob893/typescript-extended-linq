import { Enumerable } from '../Enumerable';

export function reverse<TSource>(src: Iterable<TSource>): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    const items = [...src];

    for (let i = items.length - 1; i >= 0; i--) {
      yield items[i];
    }
  }

  return new Enumerable(generator);
}
