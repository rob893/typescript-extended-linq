import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyLeftJoinHeterogeneous<TFirst, TSecond, TKey, TResult>(
  factory: IEnumerableFactory,
  first: Iterable<TFirst>,
  second: Iterable<TSecond>,
  firstKeySelector: (item: TFirst) => TKey,
  secondKeySelector: (item: TSecond) => TKey,
  firstSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TSecond) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      for (const firstItem of first) {
        const firstKey = firstKeySelector(firstItem);
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
    } else {
      const secondKeyMap = new Map<TKey, TSecond[]>();

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
        const secondMatches = secondKeyMap.get(firstKey);

        if (secondMatches !== undefined) {
          for (let i = 0; i < secondMatches.length; i++) {
            yield bothSelector(firstItem, secondMatches[i]);
          }
        } else {
          yield firstSelector(firstItem);
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}

export function applyLeftJoinHomogeneous<TFirst, TKey, TResult>(
  factory: IEnumerableFactory,
  first: Iterable<TFirst>,
  second: Iterable<TFirst>,
  keySelector: (item: TFirst) => TKey,
  firstSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TFirst) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  function* genrator(): Generator<TResult> {
    if (equalityComparer) {
      for (const firstItem of first) {
        const firstKey = keySelector(firstItem);
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
    } else {
      const secondKeyMap = new Map<TKey, TFirst[]>();

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
        const secondMatches = secondKeyMap.get(firstKey);

        if (secondMatches !== undefined) {
          for (let i = 0; i < secondMatches.length; i++) {
            yield bothSelector(firstItem, secondMatches[i]);
          }
        } else {
          yield firstSelector(firstItem);
        }
      }
    }
  }

  return factory.createBasicEnumerable(genrator);
}
