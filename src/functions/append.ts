import { Enumerable } from '../Enumerable';

export function append<TSource>(src: Iterable<TSource>, item: TSource): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    for (const currentItem of src) {
      yield currentItem;
    }

    yield item;
  }

  return new Enumerable(generator);
}
