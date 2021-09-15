import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyPrepend<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  item: TSource
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    yield item;

    for (const currentItem of src) {
      yield currentItem;
    }
  }

  return factory.createEnumerable(generator);
}
