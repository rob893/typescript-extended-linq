import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';

export function distinct<TSource>(
  src: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    if (!equalityComparer) {
      const seenItems = new Set<TSource>();

      for (const item of src) {
        if (!seenItems.has(item)) {
          seenItems.add(item);
          yield item;
        }
      }
    } else {
      const seenitems: TSource[] = [];

      for (const item of src) {
        let returnItem = true;

        for (let i = 0; i < seenitems.length; i++) {
          if (equalityComparer(item, seenitems[i])) {
            returnItem = false;
            break;
          }
        }

        if (returnItem) {
          seenitems.push(item);
          yield item;
        }
      }
    }
  }

  return new Enumerable(generator);
}

export function distinctBy<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TSource> {
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

  return new Enumerable(generator);
}
