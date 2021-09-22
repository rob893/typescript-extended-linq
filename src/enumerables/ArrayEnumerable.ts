import { BasicEnumerable } from './BasicEnumerable';
import { IEnumerableFactory } from '../types';

export class ArrayEnumerable<TSource> extends BasicEnumerable<TSource> {
  protected readonly srcArr: TSource[];

  public constructor(factory: IEnumerableFactory, srcGenerator: () => Generator<TSource>, srcArr: TSource[]) {
    super(factory, srcGenerator);
    this.srcArr = srcArr;
  }

  /**
   * Returns the number of elements in a sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const numCount = from(numbers).count(); // 3
   * ```
   * @returns The number of elements in the input sequence.
   */
  public override count(): number;

  /**
   * Returns the number of elements in a sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const evenNumCount = from(numbers).count(x => x % 2 === 0); // 1
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns The number of elements in the input sequence.
   */
  public override count(predicate: (item: TSource, index: number) => boolean): number;

  public override count(predicate?: (item: TSource, index: number) => boolean): number {
    if (predicate) {
      return super.count(predicate);
    }

    return this.srcArr.length;
  }

  /**
   * Returns the element at a specified index in a sequence or null if the index is out of range.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const indexZero = from(items).elementAt(0); // Will be 1
   * const willBeNull = from(items).elementAt(10); // Will be null.
   * ```
   * @param index The zero-based index of the element to retrieve.
   * @returns The element at the specified position in the source sequence.
   */
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
