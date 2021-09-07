import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';

export function except<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    const secondSet: Set<TSource> = second instanceof Set ? second : new Set(second);

    if (equalityComparer) {
      for (const item of src) {
        let returnItem = true;

        for (const secondItem of secondSet) {
          if (equalityComparer(item, secondItem)) {
            returnItem = false;
            break;
          }
        }

        if (returnItem) {
          secondSet.add(item);
          yield item;
        }
      }
    } else {
      for (const item of src) {
        if (!secondSet.has(item)) {
          secondSet.add(item);
          yield item;
        }
      }
    }
  }

  return new Enumerable(generator);
}

export function exceptBy<TSource, TKey>(
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
        let returnItem = true;

        for (const secondItemKey of secondKeySet) {
          if (equalityComparer(key, secondItemKey)) {
            returnItem = false;
            break;
          }
        }

        if (returnItem) {
          secondKeySet.add(key);
          yield item;
        }
      }
    } else {
      for (const item of src) {
        const key = keySelector(item);

        if (!secondKeySet.has(key)) {
          secondKeySet.add(key);
          yield item;
        }
      }
    }
  }

  return new Enumerable(generator);
}
