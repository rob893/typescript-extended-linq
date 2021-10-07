import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyUnion } from './applicators/applyUnion';

/**
 * Produces the set union of two sequences.
 * @typeparam TSource The type of source elements.
 * @param src The source Iterable<T>
 * @param second One or more Iterable<T> whose distinct elements form the second set for the union.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function union<TSource>(src: Iterable<TSource>, ...second: Iterable<TSource>[]): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences.
 * @typeparam TSource The type of source elements.
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
 * @typeparam TSource The type of source elements.
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
 * @typeparam TSource The type of source elements.
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

/**
 * Produces the set union of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param keySelector A function to extract the key for each element.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
 * @param keySelector A function to extract the key for each element.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
 * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
 * @param keySelector A function to extract the key for each element.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

/**
 * Produces the set union of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
 * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
 * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
 */
export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  ...second: (Iterable<TSource> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  return applyUnion<TSource, TKey>(new EnumerableFactory(), null, src, ...second);
}
