import { BasicEnumerable } from './BasicEnumerable';
import { IEnumerableFactory } from '../types';

export class ArrayEnumerable<TSource> extends BasicEnumerable<TSource> {
  protected readonly srcArr: TSource[];

  public constructor(factory: IEnumerableFactory, srcGenerator: () => Generator<TSource>, srcArr: TSource[]) {
    super(factory, srcGenerator);
    this.srcArr = srcArr;
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAllNumbersEven = from(numbers).all(x => x % 2 === 0); // false
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
   */
  public override all(predicate: (item: TSource, index: number) => boolean): boolean {
    return this.srcArr.every(predicate);
  }

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAnyNumbersEven = from(numbers).any(); // true
   * ```
   * @returns true if the source sequence contains any elements (or if at least one matches condition if condition is passed); otherwise, false.
   */
  public override any(): boolean;

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAnyNumbersEven = from(numbers).any(x => x % 2 === 0); // true
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns true if the source sequence contains any elements (or if at least one matches condition if condition is passed); otherwise, false.
   */
  public override any(predicate: (item: TSource, index: number) => boolean): boolean;

  public override any(predicate?: (item: TSource, index: number) => boolean): boolean {
    if (!predicate) {
      return this.srcArr.length > 0;
    }

    return this.srcArr.some(predicate);
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
   * A negative index can be used to get element starting from the end.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const indexZero = from(items).elementAtOrDefault(0); // Will be 1
   * const willBeNull = from(items).elementAtOrDefault(10); // Will be null.
   * const last = from(items).elementAtOrDefault(-1); // 3
   * ```
   * @param index The zero-based index of the element to retrieve.
   * @returns The element at the specified position in the source sequence.
   */
  public override elementAtOrDefault(index: number): TSource | null {
    if (index < 0) {
      const target = this.srcArr.length + index;

      if (target < 0) {
        return null;
      }

      return this.srcArr[target];
    }

    if (index >= this.srcArr.length) {
      return null;
    }

    return this.srcArr[index];
  }

  /**
   * Returns the last element of a sequence, or null if the sequence contains no elements.
   * @returns null if the source sequence is empty; otherwise, the last element in the IEnumerable<T>
   */
  public override lastOrDefault(): TSource | null;

  /**
   * Returns the last element of a sequence that satisfies a condition or null if no such element is found.
   * @param predicate A function to test each element for a condition.
   * @returns null if the sequence is empty or if no elements pass the test in the predicate function; otherwise, the last element that passes the test in the predicate function.
   */
  public override lastOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  public override lastOrDefault(predicate?: (item: TSource, index: number) => boolean): TSource | null {
    const arr = this.srcArr;

    if (predicate) {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i], i)) {
          return arr[i];
        }
      }
    } else {
      if (arr.length > 0) {
        return arr[arr.length - 1];
      }
    }

    return null;
  }
}
