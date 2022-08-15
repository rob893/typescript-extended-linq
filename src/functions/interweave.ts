import { IEnumerable } from '../types';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { applyInterweave } from './applicators/applyInterweave';

/**
 * Interweaves two sequences.
 * @example
 * ```typescript
 * const numbers = [1, 2];
 * const moreNumbers = interweave(numbers, [3, 4, 5]); // [1, 3, 2, 4, 5]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param collection The sequence to interweave to the first sequence.
 * @returns An IEnumerable<TSource> that contains the interweaved elements of the two input sequences.
 */
export function interweave<TSource>(src: Iterable<TSource>, collection: Iterable<TSource>): IEnumerable<TSource>;

/**
 * Interweaves multiple sequences.
 * @example
 * ```typescript
 * const numbers = [1, 2];
 * const evenMoreNumbers = interweave(numbers, [3, 4], [5, 6]); // [1, 3, 5, 2, 4, 6]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param collections The sequences to interweave to the first sequence.
 * @returns An IEnumerable<TSource> that contains the interweaved elements of the two or more input sequences.
 */
export function interweave<TSource>(src: Iterable<TSource>, ...collections: Iterable<TSource>[]): IEnumerable<TSource>;

export function interweave<TSource>(src: Iterable<TSource>, ...collections: Iterable<TSource>[]): IEnumerable<TSource> {
  return applyInterweave(new EnumerableFactory(), src, collections);
}
