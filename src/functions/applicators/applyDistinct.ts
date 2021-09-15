import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyDistinct<TSource, TKey>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    if (!equalityComparer) {
      const seenKeys = new Set<TKey>();

      for (const item of src) {
        const key = keySelector(item);

        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          yield item;
        }
      }
    } else {
      const seenKeys: TKey[] = [];

      for (const item of src) {
        const key = keySelector(item);
        let returnItem = true;

        for (let i = 0; i < seenKeys.length; i++) {
          if (equalityComparer(key, seenKeys[i])) {
            returnItem = false;
            break;
          }
        }

        if (returnItem) {
          seenKeys.push(key);
          yield item;
        }
      }
    }
  }

  return factory.createEnumerable(generator);
}
