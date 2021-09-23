import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyConcat<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  collections: Iterable<TSource>[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    for (const item of src) {
      yield item;
    }

    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i];

      if (Array.isArray(collection) || typeof collection === 'string') {
        for (let j = 0; j < collection.length; j++) {
          yield collection[j];
        }
      } else {
        for (const secondItem of collection) {
          yield secondItem;
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
