import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';

export function union<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): Enumerable<TSource> {
  function* generator(): Generator<TSource> {
    if (equalityComparer) {
      const seen: TSource[] = [];

      for (const source of [src, second]) {
        for (const item of source) {
          let returnItem = true;

          for (let i = 0; i < seen.length; i++) {
            if (equalityComparer(item, seen[i])) {
              returnItem = false;
              break;
            }
          }

          if (returnItem) {
            seen.push(item);
            yield item;
          }
        }
      }
    } else {
      for (const item of new Set([...src, ...second])) {
        yield item;
      }
    }
  }

  return new Enumerable(generator);
}

export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TSource> {
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

  return new Enumerable(generator);
}
