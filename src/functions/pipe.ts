import { Enumerable } from '../Enumerable';

export function pipe<TSource>(
  src: Iterable<TSource>,
  action: (item: TSource, index: number) => void
): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    let i = 0;

    for (const item of src) {
      action(item, i);
      yield item;

      i++;
    }
  }

  return new Enumerable(generator);
}
