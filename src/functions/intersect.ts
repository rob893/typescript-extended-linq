import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';

export function intersect<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    const secondSet: Set<TSource> = second instanceof Set ? second : new Set(second);

    if (equalityComparer) {
      for (const item of src) {
        let returnItem = false;
        let toDelete: TSource | null = null;

        for (const secondItem of secondSet) {
          if (equalityComparer(item, secondItem)) {
            toDelete = secondItem;
            returnItem = true;
            break;
          }
        }

        if (toDelete !== null) {
          secondSet.delete(toDelete);
        }

        if (returnItem) {
          yield item;
        }
      }
    } else {
      for (const item of src) {
        if (secondSet.delete(item)) {
          yield item;
        }
      }
    }
  }

  return new Enumerable(generator);
}

export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TSource> {
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

  return new Enumerable(generator);
}
