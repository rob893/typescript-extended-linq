import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IOrderedEnumerable } from '../types';
import { Comparer } from '../types';
import { applyOrderBy } from './applicators/applyOrderBy';

/**
 * Sorts the elements of a sequence in ascending order.
 * @example
 * ```typescript
 * const items = [1, 3, 2];
 * const ordered = order(items).toArray(); // Will be [1, 2, 3]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @returns An IOrderedEnumerable<TSource> whose elements are sorted.
 */
export function order<TSource>(src: Iterable<TSource>): IOrderedEnumerable<TSource>;

/**
 * Sorts the elements of a sequence in ascending order.
 * @example
 * ```typescript
 * const items = [1, 3, 2];
 * const ordered = order(items).toArray(); // Will be [1, 2, 3]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param comparer An Comparer<T> to compare keys.
 * @returns An IOrderedEnumerable<TSource> whose elements are sorted.
 */
export function order<TSource>(src: Iterable<TSource>, comparer: Comparer<TSource>): IOrderedEnumerable<TSource>;

export function order<TSource>(src: Iterable<TSource>, comparer?: Comparer<TSource>): IOrderedEnumerable<TSource> {
  return applyOrderBy(new EnumerableFactory(), src, true, x => x, comparer);
}

/**
 * Sorts the elements of a sequence in descending order.
 * @example
 * ```typescript
 * const items = [1, 3, 2];
 * const ordered = orderDescending(items).toArray(); // Will be [3, 2, 1]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @returns An IOrderedEnumerable<TSource> whose elements are sorted.
 */
export function orderDescending<TSource>(src: Iterable<TSource>): IOrderedEnumerable<TSource>;

/**
 * Sorts the elements of a sequence in descending order.
 * @example
 * ```typescript
 * const items = [1, 3, 2];
 * const ordered = orderDescending(items).toArray(); // Will be [3, 2, 1]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param comparer An Comparer<T> to compare keys.
 * @returns An IOrderedEnumerable<TSource> whose elements are sorted.
 */
export function orderDescending<TSource>(
  src: Iterable<TSource>,
  comparer: Comparer<TSource>
): IOrderedEnumerable<TSource>;

export function orderDescending<TSource>(
  src: Iterable<TSource>,
  comparer?: Comparer<TSource>
): IOrderedEnumerable<TSource> {
  return applyOrderBy(new EnumerableFactory(), src, false, x => x, comparer);
}

/**
 * Sorts the elements of a sequence in ascending order.
 * @example
 * ```typescript
 * const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
 * const ordered = orderBy(items, x => x.id).toArray(); // Will be [{ id: 1 }, { id: 2 }, { id: 3 }]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @typeparam TKey The type of the key returned by keySelector.
 * @param src The source iterable.
 * @param keySelector A function to extract the key for each element.
 * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
 */
export function orderBy<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IOrderedEnumerable<TSource>;

/**
 * Sorts the elements of a sequence in ascending order.
 * @example
 * ```typescript
 * const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
 * const ordered = orderBy(items, x => x.id).toArray(); // Will be [{ id: 1 }, { id: 2 }, { id: 3 }]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @typeparam TKey The type of the key returned by keySelector.
 * @param src The source iterable.
 * @param keySelector A function to extract the key for each element.
 * @param comparer An Comparer<T> to compare keys.
 * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
 */
export function orderBy<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  comparer: Comparer<TKey>
): IOrderedEnumerable<TSource>;

export function orderBy<TSource, TKey>(
  src: Iterable<TSource>,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): IOrderedEnumerable<TSource> {
  return applyOrderBy(new EnumerableFactory(), src, true, selector, comparer);
}

/**
 * Sorts the elements of a sequence in descending order.
 * @example
 * ```typescript
 * const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
 * const ordered = orderByDescending(items, x => x.id).toArray(); // Will be [{ id: 3 }, { id: 2 }, { id: 1 }]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @typeparam TKey The type of the key returned by keySelector.
 * @param src The source iterable.
 * @param keySelector A function to extract the key for each element.
 * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
 */
export function orderByDescending<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey
): IOrderedEnumerable<TSource>;

/**
 * Sorts the elements of a sequence in descending order.
 * @example
 * ```typescript
 * const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
 * const ordered = orderByDescending(items, x => x.id).toArray(); // Will be [{ id: 3 }, { id: 2 }, { id: 1 }]
 * ```
 * @typeparam TSource The type of the source iterable.
 * @typeparam TKey The type of the key returned by keySelector.
 * @param src The source iterable.
 * @param keySelector A function to extract the key for each element.
 * @param comparer An Comparer<T> to compare keys.
 * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
 */
export function orderByDescending<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  comparer: Comparer<TKey>
): IOrderedEnumerable<TSource>;

export function orderByDescending<TSource, TKey>(
  src: Iterable<TSource>,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): IOrderedEnumerable<TSource> {
  return applyOrderBy(new EnumerableFactory(), src, false, selector, comparer);
}
