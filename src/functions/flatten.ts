import { IEnumerable } from '../types';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { applyFlatten } from './applicators/applyFlatten';

/**
 * Returns a new IEnumerable with all sub-iterable elements concatenated into it recursively up.
 * @example
 * ```typescript
 * const items = [1, 2, [3, 4, [5, []]]];
 * const res = from(items).flatten(); // [1, 2, 3, 4, 5]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @returns A new IEnumerable with all sub-iterable elements concatenated into it recursively up.
 */
export function flatten<TSource>(src: Iterable<TSource>): IEnumerable<TSource>;

/**
 * Returns a new IEnumerable with all sub-iterable elements concatenated into it recursively up to the specified depth.
 * @example
 * ```typescript
 * const items = [1, 2, [3, 4, [5, []]]];
 * const res = from(items).flatten(1); // [1, 2, 3, 4, [5, []]]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param depth The depth to flatten to.
 * @returns A new IEnumerable with all sub-iterable elements concatenated into it recursively up.
 */
export function flatten<TSource>(
  src: Iterable<TSource>,
  depth: number
): IEnumerable<TSource | Iterable<TSource | Iterable<TSource>>>;

export function flatten<TSource>(
  src: Iterable<TSource>,
  depth?: number
): IEnumerable<TSource | Iterable<TSource | Iterable<TSource>>> {
  return applyFlatten(new EnumerableFactory(), src, depth);
}
