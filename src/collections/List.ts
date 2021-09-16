import { IEnumerable, IEnumerableFactory, IGrouping, IList, IOrderedEnumerable } from '../types';
import { ArrayEnumerable } from '../enumerables/ArrayEnumerable';
import { getIterableGenerator } from '../functions/shared/getIterableGenerator';
import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { Grouping } from '../enumerables/Grouping';
import { OrderedEnumerable } from '../enumerables/OrderedEnumerable';

export class List<TSource> extends ArrayEnumerable<TSource> implements IList<TSource> {
  public constructor();

  public constructor(collection: Iterable<TSource>);

  public constructor(collection?: Iterable<TSource>) {
    const src = collection ? [...collection] : [];

    // Needed to avoid circular dependency
    const factory: IEnumerableFactory = {
      createBasicEnumerable<TSource>(generator: () => Generator<TSource>): IEnumerable<TSource> {
        return new BasicEnumerable(this, generator);
      },

      createOrderedEnumerable<TSource>(generator: () => Generator<TSource[]>): IOrderedEnumerable<TSource> {
        return new OrderedEnumerable(this, generator);
      },

      createGroupedEnumerable<TKey, TSource>(key: TKey, generator: () => Generator<TSource>): IGrouping<TKey, TSource> {
        return new Grouping(this, key, generator);
      },

      createArrayEnumerable<TSource>(generator: () => Generator<TSource>, srcArr: TSource[]): IEnumerable<TSource> {
        return new ArrayEnumerable(this, generator, srcArr);
      },

      createList<TSource>(generator: () => Generator<TSource>): IList<TSource> {
        return new List(generator());
      }
    };

    super(factory, getIterableGenerator(src), src);
  }

  public get length(): number {
    return this.srcArr.length;
  }

  public add(item: TSource): void {
    this.srcArr.push(item);
  }

  public addRange(collection: Iterable<TSource>): void {
    for (const item of collection) {
      this.add(item);
    }
  }

  public clear(): void {
    this.srcArr.length = 0;
  }

  public remove(item: TSource): boolean {
    const index = this.srcArr.indexOf(item);

    if (index === -1) {
      return false;
    }

    this.srcArr.splice(index, 1);

    return true;
  }
}
