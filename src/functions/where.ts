import { Enumerable } from '../Enumerable';

export function where<TSource>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => boolean
): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    let i = 0;

    for (const item of src) {
      if (exp(item, i)) {
        yield item;
      }

      i++;
    }
  }

  return new Enumerable(generator);
}
