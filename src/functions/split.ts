import { IEnumerable } from '../types';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { applySplit } from './applicators/applySplit';

/**
 * Splits the source sequence by a separator.
 * @typeparam TSource The type of the source.
 * @param src The source iterable.
 * @param separator Separator element.
 * @returns A sequence of splits of elements.
 */
export function split<TSource>(src: Iterable<TSource>, separator: TSource): IEnumerable<IEnumerable<TSource>>;

/**
 * Splits the source sequence by a predicate.
 * @typeparam TSource The type of the source.
 * @param src The source iterable.
 * @param predicate A function to test an element for a condition.
 * @returns A sequence of splits of elements.
 */
export function split<TSource>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): IEnumerable<IEnumerable<TSource>>;

export function split<TSource>(
  src: Iterable<TSource>,
  separatorOrPredicate: TSource | ((item: TSource, index: number) => boolean)
): IEnumerable<IEnumerable<TSource>> {
  return applySplit(new EnumerableFactory(), src, separatorOrPredicate);
}
