import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyIntersect } from './applicators/applyIntersect';

/**
 * Produces the set intersection of two sequences.
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersect<TSource>(src: Iterable<TSource>, second: Iterable<TSource>): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences.
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersect<TSource>(src: Iterable<TSource>, ...second: Iterable<TSource>[]): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences.
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersect<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences.
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersect<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences.
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param fourth An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersect<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

export function intersect<TSource>(
  src: Iterable<TSource>,
  ...second: (Iterable<TSource> | EqualityComparer<TSource>)[]
): IEnumerable<TSource> {
  return applyIntersect(new EnumerableFactory(), x => x, src, second);
}

/**
 * Produces the set intersection of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param keySelector A function to extract the key for each element.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param keySelector A function to extract the key for each element.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  third: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param fourth An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param keySelector A function to extract the key for each element.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  third: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

/**
 * Produces the set intersection of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param fourth An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence that contains the elements that form the set intersection of two sequences.
 */
export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  ...second: (Iterable<TKey> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  return applyIntersect(new EnumerableFactory(), null, src, second);
}
