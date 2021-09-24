import { BasicEnumerable } from './BasicEnumerable';
import { IEnumerableFactory, IGrouping } from '../types';

/**
 * Represents a collection of objects that have a common key.
 * @typeparam TKey The type of the key.
 * @typeparam TSource The type of the values.
 */
export class Grouping<TKey, TSource> extends BasicEnumerable<TSource> implements IGrouping<TKey, TSource> {
  /**
   * Gets the key of the IGrouping<TKey, TSource>.
   */
  public readonly key: TKey;

  public constructor(factory: IEnumerableFactory, key: TKey, src: () => Generator<TSource>) {
    super(factory, src);
    this.key = key;
  }
}
