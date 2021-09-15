import { IEnumerable } from '../types';
import { applyEmpty } from '../functions/applicators/applyEmpty';
import { applyFrom } from '../functions/applicators/applyFrom';
import { applyRange } from '../functions/applicators/applyRange';
import { applyRepeat } from '../functions/applicators/applyRepeat';
import { EnumerableFactory } from '../utilities/EnumerableFactory';

/**
 * Provides a set of static methods for IEnumerable.
 */
export class Enumerable {
  /**
   * Creates a new Enumerable from the input Iterable.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const enumerable = Enumerable.from(numbers);
   * ```
   * @param src The Iterable to create an Enumerable from.
   * @returns A new Enumerable.
   */
  public static from<TResult>(src: Iterable<TResult>): IEnumerable<TResult> {
    return applyFrom(new EnumerableFactory(), src);
  }

  /**
   * Creates a new Enumerable from the input object.
   * @example
   * ```typescript
   * const obj = {
   *   foo: 1,
   *   bar: 'b'
   * };
   * const enumerable = Enumerable.from(obj);
   * ```
   * @param src The object to create an Enumerable from.
   * @returns A new Enumerable.
   */
  public static fromObject<TSource>(src: TSource): IEnumerable<[keyof TSource, TSource[keyof TSource]]> {
    return applyFrom(new EnumerableFactory(), src);
  }

  /**
   * Creates an empty Enumerable.
   * @example
   * ```typescript
   * const empty = Enumerable.empty();
   * ```
   * @returns A new empty Enumerable.
   */
  public static empty<TResult>(): IEnumerable<TResult> {
    return applyEmpty(new EnumerableFactory());
  }

  public static range(start: number, count: number): IEnumerable<number> {
    return applyRange(new EnumerableFactory(), start, count);
  }

  public static repeat<TResult>(element: TResult, count: number): IEnumerable<TResult> {
    return applyRepeat(new EnumerableFactory(), element, count);
  }
}
