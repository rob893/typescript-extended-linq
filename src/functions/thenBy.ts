import { OrderedEnumerable } from '../enumerables';
import { IOrderedEnumerable } from '../types';
import { Comparer } from '../types';
import { applyThenBy } from './applicators/applyThenBy';

export function thenBy<TSource, TKey>(
  src: () => Generator<TSource[]>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): IOrderedEnumerable<TSource> {
  return applyThenBy(OrderedEnumerable, src, ascending, selector, comparer);
}
