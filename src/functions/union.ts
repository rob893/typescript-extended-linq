import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyUnion } from './applicators/applyUnion';

/**
 * Produces the set union of two sequences.
 * @param src The source Iterable<T>
 * @param second One or more Iterable<T> whose distinct elements form the second set for the union.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function union<TSource>(src: Iterable<TSource>, ...second: Iterable<TSource>[]): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function union<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function union<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
 * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function union<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

export function union<TSource>(
  src: Iterable<TSource>,
  ...second: (Iterable<TSource> | EqualityComparer<TSource>)[]
): IEnumerable<TSource> {
  return applyUnion(new EnumerableFactory(), (x: TSource) => x, src, ...second);
}

export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  const items = equalityComparer ? [second, equalityComparer] : [second];
  return applyUnion<TSource, TKey>(new EnumerableFactory(), keySelector, src, ...items);
}
