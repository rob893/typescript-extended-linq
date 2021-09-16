import { List } from '../collections/List';
import { ArrayEnumerable } from '../enumerables/ArrayEnumerable';
import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { Grouping } from '../enumerables/Grouping';
import { OrderedEnumerable } from '../enumerables/OrderedEnumerable';
import { IEnumerable, IOrderedEnumerable, IGrouping, IEnumerableFactory, IList } from '../types';

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

  public createList<TSource>(generator: () => Generator<TSource>): IList<TSource> {
    return new List(generator());
  }
}
