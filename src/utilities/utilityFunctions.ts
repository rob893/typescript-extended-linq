import { Comparer, EqualityComparer } from '../types';

export function getIterableGenerator<TSource>(src: Iterable<TSource>): () => Generator<TSource> {
  return Array.isArray(src) || typeof src === 'string'
    ? function* (): Generator<TSource> {
        for (let i = 0; i < src.length; i++) {
          yield src[i];
        }
      }
    : function* (): Generator<TSource> {
        for (const item of src) {
          yield item;
        }
      };
}

export function getKeySelectorAndComparer<TSource, TSecond, TKey>(
  overrideKeySelector: ((item: TSource) => TKey) | null,
  others: (Iterable<TSecond> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): [others: Iterable<TSecond>[], keySelector: (item: TSource) => TKey, equalityComparer?: EqualityComparer<TKey>] {
  const passedKeySelector = typeof overrideKeySelector === 'function';
  const equalityComparer =
    typeof others[others.length - (passedKeySelector ? 1 : 2)] === 'function'
      ? (others.pop() as EqualityComparer<TKey>)
      : undefined;
  const keySelector = overrideKeySelector ?? (others.pop() as (item: TSource) => TKey);

  const isIterableArray = (
    arr: (Iterable<TSecond> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
  ): arr is Iterable<TSecond>[] => arr.every(x => Symbol.iterator in Object(x));

  if (
    typeof keySelector !== 'function' ||
    (equalityComparer !== undefined && typeof equalityComparer !== 'function') ||
    others.length === 0 ||
    !isIterableArray(others)
  ) {
    throw new Error('Invalid use of overloads.');
  }

  return [others, keySelector, equalityComparer];
}

export function toKeyMap<TKey, T>(src: Iterable<T>, keySelector: (item: T) => TKey): Map<TKey, T[]> {
  const map = new Map<TKey, T[]>();

  for (const item of src) {
    const key = keySelector(item);
    const curr = map.get(key);

    if (curr !== undefined) {
      curr.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return map;
}

export function* orderByGenerator<TSource, TKey>(
  src: Iterable<TSource>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): Generator<TSource[]> {
  const map = toKeyMap(src, selector);
  const sortedKeys = [...map.keys()].sort((a, b) => {
    if (comparer) {
      return comparer(a, b);
    }

    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });

  if (ascending) {
    for (let i = 0; i < sortedKeys.length; i++) {
      const items = map.get(sortedKeys[i]);
      yield items ?? [];
    }
  } else {
    for (let i = sortedKeys.length - 1; i >= 0; i--) {
      const items = map.get(sortedKeys[i]);
      yield items ?? [];
    }
  }
}
