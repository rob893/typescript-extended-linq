import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyUnion<TSource, TKey>(
  factory: IEnumerableFactory,
  overrideKeySelector: ((item: TSource) => TKey) | null,
  src: Iterable<TSource>,
  second: (Iterable<TSource> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const passedKeySelector = typeof overrideKeySelector === 'function';
    const equalityComparer =
      typeof second[second.length - (passedKeySelector ? 1 : 2)] === 'function'
        ? (second.pop() as EqualityComparer<TKey>)
        : undefined;
    const keySelector = overrideKeySelector ?? (second.pop() as (item: TSource) => TKey);

    const isIterableArray = (
      arr: (Iterable<TSource> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
    ): arr is Iterable<TSource>[] => arr.every(x => Symbol.iterator in Object(x));

    if (
      typeof keySelector !== 'function' ||
      (equalityComparer !== undefined && typeof equalityComparer !== 'function') ||
      second.length === 0 ||
      !isIterableArray(second)
    ) {
      throw new Error('Invalid use of overloads.');
    }

    if (equalityComparer) {
      const seenKeys: TKey[] = [];

      for (const source of [src, ...second]) {
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

      for (const source of [src, ...second]) {
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

  return factory.createBasicEnumerable(generator);
}
