import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyAppend<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  item: TSource
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    for (const currentItem of src) {
      yield currentItem;
    }

    yield item;
  }

  return factory.createBasicEnumerable(generator);
}
