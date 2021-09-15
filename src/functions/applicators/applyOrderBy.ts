import { Comparer, IEnumerableFactory, IOrderedEnumerable } from '../../types';
import { orderByGenerator } from '../shared/orderByGenerator';

export function applyOrderBy<TSource, TKey>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): IOrderedEnumerable<TSource> {
  return factory.createOrderedEnumerable(() => orderByGenerator(src, ascending, selector, comparer));
}
