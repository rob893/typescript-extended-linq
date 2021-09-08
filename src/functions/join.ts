import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';

/**
 * Correlates the elements of two sequences based on matching keys.
 * @param outer The first sequence to join.
 * @param inner The second sequence to join to the first.
 * @param outerKeySelector A function to extract the join key from each element of the first sequence.
 * @param innerKeySelector A function to extract the join key from each element of the second sequence.
 * @param resultSelector A function to create a result element from two matching elements.
 * @param equalityComparer A function to compare keys.
 * @returns An Enumerable<TResult> that has elements of type TResult that are obtained by performing an inner join on two sequences.
 */
export function join<TOuter, TInner, TKey, TResult>(
  outer: Iterable<TOuter>,
  inner: Iterable<TInner>,
  outerKeySelector: (item: TOuter) => TKey,
  innerKeySelector: (item: TInner) => TKey,
  resultSelector: (item: TOuter, inner: TInner) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      for (const outerItem of outer) {
        const outerKey = outerKeySelector(outerItem);

        for (const innerItem of inner) {
          if (equalityComparer(outerKey, innerKeySelector(innerItem))) {
            yield resultSelector(outerItem, innerItem);
          }
        }
      }
    } else {
      const innerMap = new Map<TKey, TInner[]>();

      for (const innerItem of inner) {
        const key = innerKeySelector(innerItem);
        const curr = innerMap.get(key);

        if (curr !== undefined) {
          curr.push(innerItem);
        } else {
          innerMap.set(key, [innerItem]);
        }
      }

      for (const outerItem of outer) {
        const key = outerKeySelector(outerItem);
        const innersToJoin = innerMap.get(key);

        if (innersToJoin !== undefined) {
          for (let i = 0; i < innersToJoin.length; i++) {
            yield resultSelector(outerItem, innersToJoin[i]);
          }
        }
      }
    }
  }

  return new Enumerable(generator);
}
