import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyIntersect<TSource, TKey>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const secondKeySet: Set<TKey> = second instanceof Set ? second : new Set(second);

    if (equalityComparer) {
      for (const item of src) {
        const key = keySelector(item);
        let returnItem = false;
        let toDeleteKey: TKey | null = null;

        for (const secondItemKey of secondKeySet) {
          if (equalityComparer(key, secondItemKey)) {
            toDeleteKey = secondItemKey;
            returnItem = true;
            break;
          }
        }

        if (toDeleteKey !== null) {
          secondKeySet.delete(toDeleteKey);
        }

        if (returnItem) {
          yield item;
        }
      }
    } else {
      for (const item of src) {
        if (secondKeySet.delete(keySelector(item))) {
          yield item;
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
