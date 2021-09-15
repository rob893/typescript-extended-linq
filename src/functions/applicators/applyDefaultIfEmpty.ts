import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyDefaultIfEmpty<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  defaultItem: TSource
): IEnumerable<TSource> {
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

  return factory.createBasicEnumerable(generator);
}
