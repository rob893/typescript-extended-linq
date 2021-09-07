import { Enumerable } from '../Enumerable';

export function defaultIfEmpty<TSource>(src: Iterable<TSource>, defaultItem: TSource): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    let returnDefault = true;

    for (const item of src) {
      returnDefault = false;
      yield item;
    }

    if (returnDefault) {
      yield defaultItem;
    }
  }

  return new Enumerable(generator);
}
