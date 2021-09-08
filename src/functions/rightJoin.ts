import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';

/**
 * Performs a right outer join on two heterogeneous sequences.
 * @param first The first sequence of the join operation.
 * @param second The second sequence of the join operation.
 * @param firstKeySelector Function that projects the key given an element from first.
 * @param secondKeySelector Function that projects the key given an element from second.
 * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
 * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence containing results projected from a right outer join of the two input sequences.
 */
export function rightJoinHeterogeneous<TFirst, TSecond, TKey, TResult>(
  first: Iterable<TFirst>,
  second: Iterable<TSecond>,
  firstKeySelector: (item: TFirst) => TKey,
  secondKeySelector: (item: TSecond) => TKey,
  secondSelector: (item: TSecond) => TResult,
  bothSelector: (a: TFirst, b: TSecond) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
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

  return new Enumerable(generator);
}

/**
 * Performs a right outer join on two homogeneous sequences.
 * @param first The first sequence of the join operation.
 * @param second The second sequence of the join operation.
 * @param keySelector Function that projects the key given an element of one of the sequences to join.
 * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
 * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence containing results projected from a right outer join of the two input sequences.
 */
export function rightJoinHomogeneous<TFirst, TKey, TResult>(
  first: Iterable<TFirst>,
  second: Iterable<TFirst>,
  keySelector: (item: TFirst) => TKey,
  secondSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TFirst) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
  // function* generator(): Generator<TResult> {
  //   if (equalityComparer) {
  //     for (const firstItem of first) {
  //       const firstKey = keySelector(firstItem);
  //       let matched = false;

  //       for (const secondItem of second) {
  //         if (equalityComparer(firstKey, keySelector(secondItem))) {
  //           matched = true;
  //           yield bothSelector(firstItem, secondItem);
  //         }
  //       }

  //       if (!matched) {
  //         yield firstSelector(firstItem);
  //       }
  //     }
  //   } else {
  //     const secondKeyMap = new Map<TKey, TFirst[]>();

  //     for (const secondItem of second) {
  //       const secondKey = keySelector(secondItem);
  //       const currentMatches = secondKeyMap.get(secondKey);

  //       if (currentMatches !== undefined) {
  //         currentMatches.push(secondItem);
  //       } else {
  //         secondKeyMap.set(secondKey, [secondItem]);
  //       }
  //     }

  //     for (const firstItem of first) {
  //       const firstKey = keySelector(firstItem);
  //       const secondMatches = secondKeyMap.get(firstKey);

  //       if (secondMatches !== undefined) {
  //         for (let i = 0; i < secondMatches.length; i++) {
  //           yield bothSelector(firstItem, secondMatches[i]);
  //         }
  //       } else {
  //         yield firstSelector(firstItem);
  //       }
  //     }
  //   }
  // }

  // return new Enumerable(generator);
  throw new Error('NYI');
}
