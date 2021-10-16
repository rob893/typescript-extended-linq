import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyXor } from './applicators/applyXor';

/**
 * Produces the set union of two sequences.
 * @typeparam TSource The type of source elements.
 * @param src The source Iterable<T>
 * @param second One or more Iterable<T> whose distinct elements form the second set for the union.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xor<TSource>(src: Iterable<TSource>, second: Iterable<TSource>): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of two or more sequences.
 * @typeparam TSource The type of source elements.
 * @param src The source Iterable<T>
 * @param second One or more Iterable<T> whose distinct elements form the second or more set for the symmetric difference.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xor<TSource>(src: Iterable<TSource>, ...second: Iterable<TSource>[]): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of two sequences using a provided equality comparer.
 * @typeparam TSource The type of source elements.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xor<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of three sequences using a provided equality comparer.
 * @typeparam TSource The type of source elements.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xor<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of four sequences using a provided equality comparer.
 * @typeparam TSource The type of source elements.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
 * @param fourth An Iterable<T> whose distinct elements form the fourth set for the symmetric difference.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xor<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

export function xor<TSource>(
  src: Iterable<TSource>,
  ...second: (Iterable<TSource> | EqualityComparer<TSource>)[]
): IEnumerable<TSource> {
  return applyXor(new EnumerableFactory(), (x: TSource) => x, src, second);
}

/**
 * Produces the symmetric difference of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param keySelector A function to extract the key for each element.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xorBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of three sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
 * @param keySelector A function to extract the key for each element.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xorBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of four sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
 * @param fourth An Iterable<T> whose distinct elements form the fourth set for the symmetric difference.
 * @param keySelector A function to extract the key for each element.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xorBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of two sequences according to a specified key selector function using a provided equality comparer.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xorBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of three sequences according to a specified key selector function using a provided equality comparer.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xorBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

/**
 * Produces the symmetric difference of four sequences according to a specified key selector function using a provided equality comparer.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source Iterable<T>
 * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
 * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
 * @param fourth An Iterable<T> whose distinct elements form the fourth set for the symmetric difference.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer The EqualityComparer<T> to compare values.
 * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
 */
export function xorBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

export function xorBy<TSource, TKey>(
  src: Iterable<TSource>,
  ...second: (Iterable<TSource> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  return applyXor<TSource, TKey>(new EnumerableFactory(), null, src, second);
}
