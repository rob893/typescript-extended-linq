import { Enumerable } from './Enumerable';
import { IEnumerableFactory, IGrouping } from './types';

export class Grouping<TKey, TSource> extends Enumerable<TSource> implements IGrouping<TKey, TSource> {
  public readonly key: TKey;

  public constructor(factory: IEnumerableFactory, key: TKey, src: () => Generator<TSource>) {
    super(factory, src);
    this.key = key;
  }
}
