import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyExcept<TSource, TKey>(
  factory: IEnumerableFactory,
  overrideKeySelector: ((item: TSource) => TKey) | null,
  src: Iterable<TSource>,
  ...second: (Iterable<TKey> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const passedKeySelector = typeof overrideKeySelector === 'function';
    const equalityComparer =
      typeof second[second.length - (passedKeySelector ? 1 : 2)] === 'function'
        ? (second.pop() as EqualityComparer<TKey>)
        : undefined;
    const keySelector = overrideKeySelector ?? (second.pop() as (item: TSource) => TKey);

    const isIterableArray = (
      arr: (Iterable<TKey> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
    ): arr is Iterable<TKey>[] => arr.every(x => Symbol.iterator in Object(x));

    if (
      typeof keySelector !== 'function' ||
      (equalityComparer !== undefined && typeof equalityComparer !== 'function') ||
      second.length === 0 ||
      !isIterableArray(second)
    ) {
      throw new Error('Invalid use of overloads.');
    }

    const secondKeySet: Set<TKey> = new Set(second.reduce((prev, curr) => [...prev, ...curr]));

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

  return factory.createBasicEnumerable(generator);
}
