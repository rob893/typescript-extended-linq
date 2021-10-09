import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyIntersect<TSource, TKey>(
  factory: IEnumerableFactory,
  overrideKeySelector: ((item: TSource) => TKey) | null,
  src: Iterable<TSource>,
  second: (Iterable<TKey> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
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

    const secondKeySets: Set<TKey>[] = second.map(s => (s instanceof Set ? s : new Set(s)));

    if (equalityComparer) {
      for (const item of src) {
        const key = keySelector(item);
        let returnItem = true;

        for (const secondKeySet of secondKeySets) {
          let toDeleteKey: TKey | null = null;
          let inSet = false;

          for (const secondItemKey of secondKeySet) {
            if (equalityComparer(key, secondItemKey)) {
              toDeleteKey = secondItemKey;
              inSet = true;
              break;
            }
          }

          if (toDeleteKey !== null) {
            secondKeySet.delete(toDeleteKey);
          }

          if (!inSet) {
            returnItem = false;
            break;
          }
        }

        if (returnItem) {
          yield item;
        }
      }
    } else {
      for (const item of src) {
        if (secondKeySets.every(s => s.delete(keySelector(item)))) {
          yield item;
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
