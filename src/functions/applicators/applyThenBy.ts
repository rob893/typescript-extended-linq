import { Comparer, IEnumerableConstructor, IOrderedEnumerable } from '../../types';
import { orderByGenerator } from '../shared/orderByGenerator';

export function applyThenBy<TSource, TKey>(
  enumerableType: IEnumerableConstructor<TSource[], TSource, IOrderedEnumerable<TSource>>,
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

  return new enumerableType(generator);
}
