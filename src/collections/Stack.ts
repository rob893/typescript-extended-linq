import { ICollection } from '../types';
import { ArrayEnumerable } from '../enumerables/ArrayEnumerable';
import { getIterableGenerator } from '../functions/shared/getIterableGenerator';
import { EnumerableFactory } from '../utilities/EnumerableFactory';

export class Stack<TSource> extends ArrayEnumerable<TSource> implements ICollection<TSource> {
  public constructor();

  public constructor(collection: Iterable<TSource>);

  public constructor(collection?: Iterable<TSource>) {
    const src = collection ? [...collection] : [];
    super(new EnumerableFactory(), getIterableGenerator(src), src);
  }

  public get length(): number {
    return this.srcArr.length;
  }

  public clear(): void {
    this.srcArr.length = 0;
  }

  public copyTo(array: TSource[]): void;

  public copyTo(array: TSource[], arrayIndex: number): void;

  public copyTo(array: TSource[], arrayIndex?: number): void {
    const startArrayIndex = arrayIndex ?? 0;

    for (let i = 0, j = startArrayIndex; i < this.srcArr.length; i++, j++) {
      array[j] = this.srcArr[i];
    }
  }

  public peek(): TSource {
    const item = this.tryPeek();

    if (item === undefined) {
      throw new Error('Stack is empty.');
    }

    return item;
  }

  public pop(): TSource {
    const item = this.tryPop();

    if (item === undefined) {
      throw new Error('Stack is empty.');
    }

    return item;
  }

  public push(item: TSource): void {
    this.srcArr.push(item);
  }

  public tryPeek(): TSource | undefined {
    if (this.srcArr.length === 0) {
      return undefined;
    }

    return this.srcArr[this.srcArr.length - 1];
  }

  public tryPop(): TSource | undefined {
    return this.srcArr.pop();
  }
}
