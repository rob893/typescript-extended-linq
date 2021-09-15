import { ArrayEnumerable } from '../enumerables/ArrayEnumerable';
import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { Grouping } from '../enumerables/Grouping';
import { OrderedEnumerable } from '../enumerables/OrderedEnumerable';
import { IEnumerable, IOrderedEnumerable, IGrouping, IEnumerableFactory } from '../types';

export class EnumerableFactory implements IEnumerableFactory {
  public createBasicEnumerable<TSource>(generator: () => Generator<TSource>): IEnumerable<TSource> {
    return new BasicEnumerable(this, generator);
  }

  public createOrderedEnumerable<TSource>(generator: () => Generator<TSource[]>): IOrderedEnumerable<TSource> {
    return new OrderedEnumerable(this, generator);
  }

  public createGroupedEnumerable<TKey, TSource>(
    key: TKey,
    generator: () => Generator<TSource>
  ): IGrouping<TKey, TSource> {
    return new Grouping(this, key, generator);
  }

  public createArrayEnumerable<TSource>(generator: () => Generator<TSource>, srcArr: TSource[]): IEnumerable<TSource> {
    return new ArrayEnumerable(this, generator, srcArr);
  }

  public isEnumerable(obj: unknown): obj is IEnumerable<unknown> {
    return obj instanceof BasicEnumerable;
  }
}
