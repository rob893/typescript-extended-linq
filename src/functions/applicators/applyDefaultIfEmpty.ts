import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applyDefaultIfEmpty<TSource>(
  enumerableType: IEnumerableConstructor<TSource>,
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

  return new enumerableType(generator);
}
