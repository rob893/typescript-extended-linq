import { BasicEnumerable } from './BasicEnumerable';
import { IEnumerableFactory } from '../types';

export class ArrayEnumerable<TSource> extends BasicEnumerable<TSource> {
  protected readonly srcArr: TSource[];

  public constructor(factory: IEnumerableFactory, srcGenerator: () => Generator<TSource>, srcArr: TSource[]) {
    super(factory, srcGenerator);
    this.srcArr = srcArr;
  }

  public override count(predicate?: (item: TSource, index: number) => boolean): number {
    if (predicate) {
      return super.count(predicate);
    }

    return this.srcArr.length;
  }

  public override elementAtOrDefault(index: number): TSource | null {
    if (index < 0) {
      throw new Error('Index must be greater than or equal to 0');
    }

    if (index >= this.srcArr.length) {
      return null;
    }

    return this.srcArr[index];
  }
}
