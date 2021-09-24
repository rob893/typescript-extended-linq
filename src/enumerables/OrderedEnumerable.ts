import { BasicEnumerable } from './BasicEnumerable';
import { applyThenBy } from '../functions/applicators/applyThenBy';
import { Comparer, IEnumerableFactory, IOrderedEnumerable } from '../types';

/**
 * Represents a sorted sequence.
 * @typeparam TSource The type of the elements of the sequence.
 */
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

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  public thenBy<TKey>(keySelector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  public thenBy<TKey>(keySelector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;

  public thenBy<TKey>(keySelector: (item: TSource) => TKey, comparer?: Comparer<TKey>): IOrderedEnumerable<TSource> {
    return applyThenBy(this.factory, this.orderedPairs, true, keySelector, comparer);
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  public thenByDescending<TKey>(keySelector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  public thenByDescending<TKey>(
    keySelector: (item: TSource) => TKey,
    comparer: Comparer<TKey>
  ): IOrderedEnumerable<TSource>;

  public thenByDescending<TKey>(
    keySelector: (item: TSource) => TKey,
    comparer?: Comparer<TKey>
  ): IOrderedEnumerable<TSource> {
    return applyThenBy(this.factory, this.orderedPairs, false, keySelector, comparer);
  }
}
