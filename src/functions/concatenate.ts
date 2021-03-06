import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyConcatenate } from './applicators/applyConcatenate';

/**
 * Concatenates two sequences.
 * @example
 * ```typescript
 * const numbers = [1, 2];
 * const moreNumbers = from(numbers).concatenate([3, 4, 5]); // [1, 2, 3, 4, 5]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param collection The sequence to concatenate to the first sequence.
 * @returns An IEnumerable<TSource> that contains the concatenated elements of the two input sequences.
 */
export function concatenate<TSource>(src: Iterable<TSource>, collection: Iterable<TSource>): IEnumerable<TSource>;

/**
 * Concatenates two sequences.
 * @example
 * ```typescript
 * const numbers = [1, 2];
 * const evenMoreNumbers = from(numbers).concatenate([3, 4], [5, 6]); // [1, 2, 3, 4, 5, 6]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param collections The sequences to concatenate to the first sequence.
 * @returns An IEnumerable<TSource> that contains the concatenated elements of the two or more input sequences.
 */
export function concatenate<TSource>(src: Iterable<TSource>, ...collections: Iterable<TSource>[]): IEnumerable<TSource>;

export function concatenate<TSource>(
  src: Iterable<TSource>,
  ...collections: Iterable<TSource>[]
): IEnumerable<TSource> {
  return applyConcatenate(new EnumerableFactory(), src, collections);
}
