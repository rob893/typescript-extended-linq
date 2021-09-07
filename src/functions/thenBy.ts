import { OrderedEnumerable } from '../Enumerable';
import { Comparer } from '../types';
import { orderByGenerator } from './shared/orderByGenerator';

export function thenBy<TSource, TKey>(
  src: () => Generator<TSource[]>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): OrderedEnumerable<TSource> {
  function* generator(): Generator<TSource[]> {
    for (const pair of src()) {
      yield* orderByGenerator(pair, ascending, selector, comparer);
    }
  }

  return new OrderedEnumerable(generator);
}
