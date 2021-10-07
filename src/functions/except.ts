import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyExcept } from './applicators/applyExcept';

/**
 * Produces the set difference of two sequences.
 * @example
 * ```typescript
 * const items = [1, 2, 3, 4];
 * const exceptItems = from(items).except([2, 4]); // [1, 3]
 * ```
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function except<TSource>(src: Iterable<TSource>, ...second: Iterable<TSource>[]): IEnumerable<TSource>;

/**
 * Produces the set difference of two sequences.
 * @example
 * ```typescript
 * const items = [1, 2, 3, 4];
 * const exceptItems = from(items).except([2, 4], (a, b) => a === b); // [1, 3]
 * ```
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param equalityComparer An EqualityComparer<T> to compare values.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function except<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

/**
 * Produces the set difference of two sequences.
 * @example
 * ```typescript
 * const items = [1, 2, 3, 4];
 * const exceptItems = from(items).except([2, 4], [3], (a, b) => a === b); // [1]
 * ```
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param third An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param equalityComparer An EqualityComparer<T> to compare values.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function except<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

/**
 * Produces the set difference of two sequences.
 * @example
 * ```typescript
 * const items = [1, 2, 3, 4, 5, 6, 7];
 * const exceptItems = from(items).except([2, 4], [3, 5], [7], (a, b) => a === b); // [1, 6]
 * ```
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param third An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param fourth An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param equalityComparer An EqualityComparer<T> to compare values.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function except<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  third: Iterable<TSource>,
  fourth: Iterable<TSource>,
  equalityComparer: EqualityComparer<TSource>
): IEnumerable<TSource>;

export function except<TSource>(
  src: Iterable<TSource>,
  ...second: (Iterable<TSource> | EqualityComparer<TSource>)[]
): IEnumerable<TSource> {
  return applyExcept(new EnumerableFactory(), x => x, src, ...second);
}

/**
 * Produces the set difference of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param keySelector A function to extract the key for each element.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set difference of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param keySelector A function to extract the key for each element.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  third: Iterable<TKey>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set difference of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param fourth An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param keySelector A function to extract the key for each element.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  third: Iterable<TKey>,
  fourth: Iterable<TKey>,
  keySelector: (item: TSource) => TKey
): IEnumerable<TSource>;

/**
 * Produces the set difference of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer An EqualityComparer<T> to compare values.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

/**
 * Produces the set difference of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer An EqualityComparer<T> to compare values.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  thrid: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

/**
 * Produces the set difference of two sequences according to a specified key selector function.
 * @typeparam TSource The type of source elements.
 * @typeparam TKey The type of key to identify elements by.
 * @param src The source iterable.
 * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param fourth An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
 * @param keySelector A function to extract the key for each element.
 * @param equalityComparer An EqualityComparer<T> to compare values.
 * @returns A sequence that contains the set difference of the elements of two sequences.
 */
export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  thrid: Iterable<TKey>,
  fourth: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer: EqualityComparer<TKey>
): IEnumerable<TSource>;

export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  ...second: (Iterable<TKey> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  return applyExcept(new EnumerableFactory(), null, src, ...second);
}
