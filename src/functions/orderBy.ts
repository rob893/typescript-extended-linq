import { OrderedEnumerable } from '../Enumerable';
import { Comparer } from '../types';
import { orderByGenerator } from './shared/orderByGenerator';

export function orderBy<TSource, TKey>(
  src: Iterable<TSource>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): OrderedEnumerable<TSource> {
  return new OrderedEnumerable(() => orderByGenerator(src, ascending, selector, comparer));
}
