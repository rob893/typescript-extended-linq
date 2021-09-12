import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applyAppend<TSource>(
  enumerableType: IEnumerableConstructor<TSource>,
  src: Iterable<TSource>,
  item: TSource
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    for (const currentItem of src) {
      yield currentItem;
    }

    yield item;
  }

  return new enumerableType(generator);
}
