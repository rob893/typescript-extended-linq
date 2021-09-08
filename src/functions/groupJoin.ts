import { where } from './where';
import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';
import { from } from './from';

/**
 * Correlates the elements of two sequences based on key equality, and groups the results.
 * @param outer The sequence to join.
 * @param inner The sequence to join to the first sequence.
 * @param outerKeySelector A function to extract the join key from each element of the first sequence.
 * @param innerKeySelector A function to extract the join key from each element of the second sequence.
 * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
 * @param equalityComparer An Enumerable<TResult> that contains elements of type TResult that are obtained by performing a grouped join on two sequences.
 */
export function groupJoin<TOuter, TInner, TKey, TResult>(
  outer: Iterable<TOuter>,
  inner: Iterable<TInner>,
  outerKeySelector: (item: TOuter) => TKey,
  innerKeySelector: (item: TInner) => TKey,
  resultSelector: (item: TOuter, inner: Enumerable<TInner>) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      for (const outerItem of outer) {
        const outerKey = outerKeySelector(outerItem);

        const inners = where(inner, innerItem => equalityComparer(outerKey, innerKeySelector(innerItem)));
        yield resultSelector(outerItem, inners);
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

        yield resultSelector(outerItem, from(innersToJoin ?? []));
      }
    }
  }

  return new Enumerable(generator);
}
