import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyFullJoinHeterogeneous, applyFullJoinHomogeneous } from './applicators/applyFullJoin';

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
): IEnumerable<TResult> {
  return applyFullJoinHeterogeneous(
    new EnumerableFactory(),
    first,
    second,
    firstKeySelector,
    secondKeySelector,
    firstSelector,
    secondSelector,
    bothSelector,
    equalityComparer
  );
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
): IEnumerable<TResult> {
  return applyFullJoinHomogeneous(
    new EnumerableFactory(),
    first,
    second,
    keySelector,
    firstSelector,
    secondSelector,
    bothSelector,
    equalityComparer
  );
}
