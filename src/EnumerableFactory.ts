import { ArrayEnumerable } from './ArrayEnumerable';
import { Enumerable } from './Enumerable';
import { Grouping } from './Grouping';
import { OrderedEnumerable } from './OrderedEnumerable';
import { IEnumerable, IOrderedEnumerable, IGrouping, IEnumerableFactory } from './types';

export class EnumerableFactory implements IEnumerableFactory {
  public createEnumerable<TSource>(generator: () => Generator<TSource>): IEnumerable<TSource> {
    return new Enumerable(this, generator);
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
    return obj instanceof Enumerable;
  }
}
