import { Comparer, IEnumerableConstructor, IOrderedEnumerable } from '../../types';
import { orderByGenerator } from '../shared/orderByGenerator';

export function applyOrderBy<TSource, TKey>(
  enumerableType: IEnumerableConstructor<TSource[], TSource, IOrderedEnumerable<TSource>>,
  src: Iterable<TSource>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): IOrderedEnumerable<TSource> {
  return new enumerableType(() => orderByGenerator(src, ascending, selector, comparer));
}
