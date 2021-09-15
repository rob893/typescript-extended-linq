import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyUnion<TSource, TKey>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    if (equalityComparer) {
      const seenKeys: TKey[] = [];

      for (const source of [src, second]) {
        for (const item of source) {
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
    } else {
      const seenKeys = new Set<TKey>();

      for (const source of [src, second]) {
        for (const item of source) {
          const key = keySelector(item);

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            yield item;
          }
        }
      }
    }
  }

  return factory.createEnumerable(generator);
}
