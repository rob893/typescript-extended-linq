import { Enumerable } from './Enumerable';
import { IEnumerableFactory } from './types';

export class ArrayEnumerable<TSource> extends Enumerable<TSource> {
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
}
