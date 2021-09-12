import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applyPrepend<TSource>(
  enumerableType: IEnumerableConstructor<TSource>,
  src: Iterable<TSource>,
  item: TSource
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    yield item;

    for (const currentItem of src) {
      yield currentItem;
    }
  }

  return new enumerableType(generator);
}
