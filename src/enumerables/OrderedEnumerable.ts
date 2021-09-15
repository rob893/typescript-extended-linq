import { BasicEnumerable } from './BasicEnumerable';
import { applyThenBy } from '../functions/applicators/applyThenBy';
import { Comparer, IEnumerableFactory, IOrderedEnumerable } from '../types';

export class OrderedEnumerable<TSource> extends BasicEnumerable<TSource> implements IOrderedEnumerable<TSource> {
  private readonly orderedPairs: () => Generator<TSource[]>;

  public constructor(factory: IEnumerableFactory, orderedPairs: () => Generator<TSource[]>) {
    super(factory, function* (): Generator<TSource, void, undefined> {
      for (const pair of orderedPairs()) {
        yield* pair;
      }
    });

    this.orderedPairs = orderedPairs;
  }

  public thenBy<TKey>(selector: (item: TSource) => TKey, comparer?: Comparer<TKey>): IOrderedEnumerable<TSource> {
    return applyThenBy(this.factory, this.orderedPairs, true, selector, comparer);
  }

  public thenByDescending<TKey>(
    selector: (item: TSource) => TKey,
    comparer?: Comparer<TKey>
  ): IOrderedEnumerable<TSource> {
    return applyThenBy(this.factory, this.orderedPairs, false, selector, comparer);
  }
}
