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
    this.srcArr.push(...collection);
  }

  public clear(): void {
    this.srcArr.length = 0;
  }

  public copyTo(array: TSource[]): void;

  public copyTo(array: TSource[], arrayIndex: number): void;

  public copyTo(index: number, array: TSource[], arrayIndex: number, count: number): void;

  public copyTo(
    indexOrArray: number | TSource[],
    arrayOrArrayIndex?: number | TSource[],
    arrayIndex?: number,
    count?: number
  ): void {
    let arr: TSource[];
    let startArrayIndex = 0;
    let startSrcIndex = 0;
    let endSrcIndex = this.srcArr.length;

    if (Array.isArray(indexOrArray)) {
      arr = indexOrArray;

      if (arrayOrArrayIndex !== undefined) {
        if (typeof arrayOrArrayIndex === 'number') {
          startArrayIndex = arrayOrArrayIndex;
        } else {
          throw new Error('Invalid use of overloads.');
        }
      }
    } else if (Array.isArray(arrayOrArrayIndex)) {
      arr = arrayOrArrayIndex;
      startSrcIndex = indexOrArray;

      if (arrayIndex === undefined || count === undefined) {
        throw new Error('Invalid use of overloads.');
      }

      startArrayIndex = arrayIndex;
      endSrcIndex = Math.min(startSrcIndex + count, this.srcArr.length);
    } else {
      throw new Error('Invalid use of overloads.');
    }

    for (let i = startSrcIndex, j = startArrayIndex; i < endSrcIndex; i++, j++) {
      arr[j] = this.srcArr[i];
    }
  }

  public findIndex(predicate: (item: TSource, index: number) => boolean): number;

  public findIndex(startIndex: number, predicate: (item: TSource, index: number) => boolean): number;

  public findIndex(startIndex: number, count: number, predicate: (item: TSource, index: number) => boolean): number;

  public findIndex(
    startIndexOrPredicate: number | ((item: TSource, index: number) => boolean),
    countOrPredicate?: number | ((item: TSource, index: number) => boolean),
    predicate?: (item: TSource, index: number) => boolean
  ): number {
    let predicateFn;
    let start = 0;
    let end = this.srcArr.length;

    if (typeof startIndexOrPredicate === 'function') {
      predicateFn = startIndexOrPredicate;
    } else if (typeof countOrPredicate === 'function') {
      predicateFn = countOrPredicate;
      start = startIndexOrPredicate;
    } else {
      if (typeof countOrPredicate !== 'number') {
        throw new Error('Invalid use of overloads.');
      }

      predicateFn = predicate;
      start = startIndexOrPredicate;
      end = Math.min(start + countOrPredicate, this.srcArr.length);
    }

    if (predicateFn === undefined) {
      throw new Error('Invalid use of overloads.');
    }

    for (let i = start; i < end; i++) {
      if (predicateFn(this.srcArr[i], i)) {
        return i;
      }
    }

    return -1;
  }

  public indexOf(item: TSource): number;

  public indexOf(item: TSource, index: number): number;

  public indexOf(item: TSource, index: number, count: number): number;

  public indexOf(item: TSource, index?: number, count?: number): number {
    const start = index ?? 0;
    const end = count !== undefined ? Math.min(start + count, this.srcArr.length) : this.srcArr.length;

    for (let i = start; i < end; i++) {
      if (this.srcArr[i] === item) {
        return i;
      }
    }

    return -1;
  }

  public insert(index: number, item: TSource): void {
    if (index < 0 || index >= this.srcArr.length) {
      throw new Error('Index out of bounds.');
    }

    this.srcArr.splice(index, 0, item);
  }

  public insertRange(index: number, collection: Iterable<TSource>): void {
    if (index < 0 || index >= this.srcArr.length) {
      throw new Error('Index out of bounds.');
    }

    let i = index;

    for (const item of collection) {
      this.insert(i, item);
      i++;
    }
  }

  public remove(item: TSource): boolean {
    const index = this.srcArr.indexOf(item);

    if (index === -1) {
      return false;
    }

    this.srcArr.splice(index, 1);

    return true;
  }

  public removeAll(predicate: (item: TSource, index: number) => boolean): number {
    let removed = 0;
    const itemIndexesToRemove = [];

    for (let i = 0; i < this.srcArr.length; i++) {
      if (predicate(this.srcArr[i], i)) {
        itemIndexesToRemove.push(i);
      }
    }

    for (let i = itemIndexesToRemove.length - 1; i >= 0; i--) {
      this.removeAt(itemIndexesToRemove[i]);
      removed++;
    }

    return removed;
  }

  public removeAt(index: number): void {
    if (index < 0 || index >= this.srcArr.length) {
      throw new Error('Index out of bounds.');
    }

    this.srcArr.splice(index, 1);
  }

  public removeRange(index: number, count: number): void {
    if (index < 0 || index >= this.srcArr.length) {
      throw new Error('Index out of bounds.');
    }

    this.srcArr.splice(index, count);
  }

  public reverseInPlace(): void;

  public reverseInPlace(index: number, count: number): void;

  public reverseInPlace(index?: number, count?: number): void {
    const start = index ?? 0;
    const end = count !== undefined ? Math.min(start + count, this.srcArr.length - 1) : this.srcArr.length - 1;

    if (start > this.srcArr.length || start < 0) {
      throw new Error('Index out of bounds.');
    }

    for (let i = start, j = end; i < j; i++, j--) {
      const temp = this.srcArr[i];
      this.srcArr[i] = this.srcArr[j];
      this.srcArr[j] = temp;
    }
  }

  public sort(): void {
    this.srcArr.sort();
  }
}
