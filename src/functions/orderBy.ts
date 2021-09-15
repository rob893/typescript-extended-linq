import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IOrderedEnumerable } from '../types';
import { Comparer } from '../types';
import { applyOrderBy } from './applicators/applyOrderBy';

export function orderBy<TSource, TKey>(
  src: Iterable<TSource>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): IOrderedEnumerable<TSource> {
  return applyOrderBy(new EnumerableFactory(), src, ascending, selector, comparer);
}
