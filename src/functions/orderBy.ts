import { OrderedEnumerable } from '../enumerables';
import { IOrderedEnumerable } from '../types';
import { Comparer } from '../types';
import { applyOrderBy } from './applicators/applyOrderBy';

export function orderBy<TSource, TKey>(
  src: Iterable<TSource>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): IOrderedEnumerable<TSource> {
  return applyOrderBy(OrderedEnumerable, src, ascending, selector, comparer);
}
