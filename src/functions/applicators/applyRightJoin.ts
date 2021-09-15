import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyRightJoinHeterogeneous<TFirst, TSecond, TKey, TResult>(
  factory: IEnumerableFactory,
  first: Iterable<TFirst>,
  second: Iterable<TSecond>,
  firstKeySelector: (item: TFirst) => TKey,
  secondKeySelector: (item: TSecond) => TKey,
  secondSelector: (item: TSecond) => TResult,
  bothSelector: (a: TFirst, b: TSecond) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      for (const secondItem of second) {
        const secondKey = secondKeySelector(secondItem);
        let matched = false;

        for (const firstItem of first) {
          if (equalityComparer(secondKey, firstKeySelector(firstItem))) {
            matched = true;
            yield bothSelector(firstItem, secondItem);
          }
        }

        if (!matched) {
          yield secondSelector(secondItem);
        }
      }
    } else {
      const firstKeyMap = new Map<TKey, TFirst[]>();

      for (const firstItem of first) {
        const firstKey = firstKeySelector(firstItem);
        const currentMatches = firstKeyMap.get(firstKey);

        if (currentMatches !== undefined) {
          currentMatches.push(firstItem);
        } else {
          firstKeyMap.set(firstKey, [firstItem]);
        }
      }

      for (const secondItem of second) {
        const secondKey = secondKeySelector(secondItem);
        const firstMatches = firstKeyMap.get(secondKey);

        if (firstMatches !== undefined) {
          for (let i = 0; i < firstMatches.length; i++) {
            yield bothSelector(firstMatches[i], secondItem);
          }
        } else {
          yield secondSelector(secondItem);
        }
      }
    }
  }

  return factory.createEnumerable(generator);
}

export function applyRightJoinHomogeneous<TFirst, TKey, TResult>(
  factory: IEnumerableFactory,
  first: Iterable<TFirst>,
  second: Iterable<TFirst>,
  keySelector: (item: TFirst) => TKey,
  secondSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TFirst) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      for (const secondItem of second) {
        const secondKey = keySelector(secondItem);
        let matched = false;

        for (const firstItem of first) {
          if (equalityComparer(secondKey, keySelector(firstItem))) {
            matched = true;
            yield bothSelector(firstItem, secondItem);
          }
        }

        if (!matched) {
          yield secondSelector(secondItem);
        }
      }
    } else {
      const firstKeyMap = new Map<TKey, TFirst[]>();

      for (const firstItem of first) {
        const firstKey = keySelector(firstItem);
        const currentMatches = firstKeyMap.get(firstKey);

        if (currentMatches !== undefined) {
          currentMatches.push(firstItem);
        } else {
          firstKeyMap.set(firstKey, [firstItem]);
        }
      }

      for (const secondItem of second) {
        const secondKey = keySelector(secondItem);
        const firstMatches = firstKeyMap.get(secondKey);

        if (firstMatches !== undefined) {
          for (let i = 0; i < firstMatches.length; i++) {
            yield bothSelector(firstMatches[i], secondItem);
          }
        } else {
          yield secondSelector(secondItem);
        }
      }
    }
  }

  return factory.createEnumerable(generator);
}
