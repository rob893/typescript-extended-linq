import { Enumerable } from '../Enumerable';

export function prepend<TSource>(src: Iterable<TSource>, item: TSource): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    yield item;

    for (const currentItem of src) {
      yield currentItem;
    }
  }

  return new Enumerable(generator);
}
