import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';

/**
 * Performs a full outer join on two heterogeneous sequences.
 * Additional arguments specify key selection functions, result projection functions and a key comparer.
 * @typeparam TFirst The type of elements in the first sequence.
 * @typeparam TSecond The type of elements in the second sequence.
 * @typeparam TKey The type of the key returned by the key selector functions.
 * @typeparam TResult The type of the result elements.
 * @param first The first sequence of the join operation.
 * @param second The second sequence of the join operation.
 * @param firstKeySelector Function that projects the key given an element from first.
 * @param secondKeySelector Function that projects the key given an element from second.
 * @param firstSelector: Function that projects the result given just an element from first where there is no corresponding element in second.
 * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
 * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence containing results projected from a right outer join of the two input sequences.
 */
export function fullJoinHeterogeneous<TFirst, TSecond, TKey, TResult>(
  first: Iterable<TFirst>,
  second: Iterable<TSecond>,
  firstKeySelector: (item: TFirst) => TKey,
  secondKeySelector: (item: TSecond) => TKey,
  firstSelector: (item: TFirst) => TResult,
  secondSelector: (item: TSecond) => TResult,
  bothSelector: (a: TFirst, b: TSecond) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
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

  return new Enumerable(generator);
}

/**
 * Performs a full outer join on two homogeneous sequences.
 * Additional arguments specify key selection functions and result projection functions.
 * @typeparam TFirst The type of elements in the first sequence.
 * @typeparam TKey The type of the key returned by the key selector functions.
 * @typeparam TResult The type of the result elements.
 * @param first The first sequence of the join operation.
 * @param second The second sequence of the join operation.
 * @param keySelector Function that projects the key given an element of one of the sequences to join.
 * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
 * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
 * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence containing results projected from a full outer join of the two input sequences.
 */
export function fullJoinHomogeneous<TFirst, TKey, TResult>(
  first: Iterable<TFirst>,
  second: Iterable<TFirst>,
  keySelector: (item: TFirst) => TKey,
  firstSelector: (item: TFirst) => TResult,
  secondSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TFirst) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
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

  return new Enumerable(generator);
}
