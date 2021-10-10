import { FlatIterable, IEnumerable } from '../types';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { applyFlatten } from './applicators/applyFlatten';

/**
 * Returns a new IEnumerable with all sub-iterable elements concatenated into it one level deep.
 * @example
 * ```typescript
 * const items = [1, 2, [3, 4, [5, []]]];
 * const res = from(items).flatten(); // [1, 2, 3, 4, [5, []]]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @returns A new IEnumerable with all sub-iterable elements concatenated into it recursively up.
 */
export function flatten<TSource>(src: Iterable<TSource>): IEnumerable<FlatIterable<Iterable<TSource>, 1>>;

/**
 * Returns a new IEnumerable with all sub-iterable elements concatenated into it recursively up to the specified depth.
 * @example
 * ```typescript
 * const items = [1, 2, [3, 4, [5, []]]];
 * const res = from(items).flatten(2); // [1, 2, 3, 4, 5, []]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param depth The depth to flatten to.
 * @returns A new IEnumerable with all sub-iterable elements concatenated into it recursively up.
 */
export function flatten<TSource, Depth extends number>(
  src: Iterable<TSource>,
  depth: Depth
): IEnumerable<FlatIterable<Iterable<TSource>, Depth>>;

export function flatten<TSource, Depth extends number = 1>(
  src: Iterable<TSource>,
  depth?: Depth
): IEnumerable<FlatIterable<Iterable<TSource>, Depth>> {
  return applyFlatten(new EnumerableFactory(), src, depth);
}
