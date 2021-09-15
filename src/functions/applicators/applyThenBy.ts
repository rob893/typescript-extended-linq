import { Comparer, IEnumerableFactory, IOrderedEnumerable } from '../../types';
import { orderByGenerator } from '../shared/orderByGenerator';

export function applyThenBy<TSource, TKey>(
  factory: IEnumerableFactory,
  src: () => Generator<TSource[]>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): IOrderedEnumerable<TSource> {
  function* generator(): Generator<TSource[]> {
    for (const pair of src()) {
      yield* orderByGenerator(pair, ascending, selector, comparer);
    }
  }

  return factory.createOrderedEnumerable(generator);
}
