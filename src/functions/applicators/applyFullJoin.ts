import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyFullJoinHeterogeneous<TFirst, TSecond, TKey, TResult>(
  factory: IEnumerableFactory,
  first: Iterable<TFirst>,
  second: Iterable<TSecond>,
  firstKeySelector: (item: TFirst) => TKey,
  secondKeySelector: (item: TSecond) => TKey,
  firstSelector: (item: TFirst) => TResult,
  secondSelector: (item: TSecond) => TResult,
  bothSelector: (a: TFirst, b: TSecond) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      const firstKeys: TKey[] = [];

      for (const firstItem of first) {
        const firstKey = firstKeySelector(firstItem);
        firstKeys.push(firstKey);
        let matched = false;

        for (const secondItem of second) {
          if (equalityComparer(firstKey, secondKeySelector(secondItem))) {
            matched = true;
            yield bothSelector(firstItem, secondItem);
          }
        }

        if (!matched) {
          yield firstSelector(firstItem);
        }
      }

      for (const secondItem of second) {
        const secondKey = secondKeySelector(secondItem);
        let seenKey = false;

        for (let i = 0; i < firstKeys.length; i++) {
          if (equalityComparer(secondKey, firstKeys[i])) {
            seenKey = true;
            break;
          }
        }

        if (!seenKey) {
          yield secondSelector(secondItem);
        }
      }
    } else {
      const secondKeyMap = new Map<TKey, TSecond[]>();
      const firstKeys = new Set<TKey>();

      for (const secondItem of second) {
        const secondKey = secondKeySelector(secondItem);
        const currentMatches = secondKeyMap.get(secondKey);

        if (currentMatches !== undefined) {
          currentMatches.push(secondItem);
        } else {
          secondKeyMap.set(secondKey, [secondItem]);
        }
      }

      for (const firstItem of first) {
        const firstKey = firstKeySelector(firstItem);
        firstKeys.add(firstKey);

        const secondMatches = secondKeyMap.get(firstKey);

        if (secondMatches !== undefined) {
          for (let i = 0; i < secondMatches.length; i++) {
            yield bothSelector(firstItem, secondMatches[i]);
          }
        } else {
          yield firstSelector(firstItem);
        }
      }

      for (const secondItem of second) {
        if (!firstKeys.has(secondKeySelector(secondItem))) {
          yield secondSelector(secondItem);
        }
      }
    }
  }

  return factory.createEnumerable(generator);
}

export function applyFullJoinHomogeneous<TFirst, TKey, TResult>(
  factory: IEnumerableFactory,
  first: Iterable<TFirst>,
  second: Iterable<TFirst>,
  keySelector: (item: TFirst) => TKey,
  firstSelector: (item: TFirst) => TResult,
  secondSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TFirst) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      const firstKeys: TKey[] = [];

      for (const firstItem of first) {
        const firstKey = keySelector(firstItem);
        firstKeys.push(firstKey);
        let matched = false;

        for (const secondItem of second) {
          if (equalityComparer(firstKey, keySelector(secondItem))) {
            matched = true;
            yield bothSelector(firstItem, secondItem);
          }
        }

        if (!matched) {
          yield firstSelector(firstItem);
        }
      }

      for (const secondItem of second) {
        const secondKey = keySelector(secondItem);
        let seenKey = false;

        for (let i = 0; i < firstKeys.length; i++) {
          if (equalityComparer(secondKey, firstKeys[i])) {
            seenKey = true;
            break;
          }
        }

        if (!seenKey) {
          yield secondSelector(secondItem);
        }
      }
    } else {
      const secondKeyMap = new Map<TKey, TFirst[]>();
      const firstKeys = new Set<TKey>();

      for (const secondItem of second) {
        const secondKey = keySelector(secondItem);
        const currentMatches = secondKeyMap.get(secondKey);

        if (currentMatches !== undefined) {
          currentMatches.push(secondItem);
        } else {
          secondKeyMap.set(secondKey, [secondItem]);
        }
      }

      for (const firstItem of first) {
        const firstKey = keySelector(firstItem);
        firstKeys.add(firstKey);

        const secondMatches = secondKeyMap.get(firstKey);

        if (secondMatches !== undefined) {
          for (let i = 0; i < secondMatches.length; i++) {
            yield bothSelector(firstItem, secondMatches[i]);
          }
        } else {
          yield firstSelector(firstItem);
        }
      }

      for (const secondItem of second) {
        if (!firstKeys.has(keySelector(secondItem))) {
          yield secondSelector(secondItem);
        }
      }
    }
  }

  return factory.createEnumerable(generator);
}
