import { IEnumerable } from '../types';
import { applyEmpty } from '../functions/applicators/applyEmpty';
import { applyFrom } from '../functions/applicators/applyFrom';
import { applyRange } from '../functions/applicators/applyRange';
import { applyRepeat } from '../functions/applicators/applyRepeat';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { isEnumerable } from '../functions/isEnumerable';

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

  /**
   * Generates a sequence of integral numbers within a specified range.
   * @param start The value of the first integer in the sequence.
   * @param count The number of sequential integers to generate.
   * @returns An IEnumerable<number> that contains a range of sequential integral numbers.
   */
  public static range(start: number, count: number): IEnumerable<number> {
    return applyRange(new EnumerableFactory(), start, count);
  }

  /**
   * Generates a sequence that contains one repeated value.
   * @typeparam TResult The type of the value to be repeated in the result sequence.
   * @param element The value to be repeated.
   * @param count The number of times to repeat the value in the generated sequence.
   * @returns An IEnumerable<T> that contains a repeated value.
   */
  public static repeat<TResult>(element: TResult, count: number): IEnumerable<TResult> {
    return applyRepeat(new EnumerableFactory(), element, count);
  }

  /**
   * Determines if the passed in object is an Enumerable.
   * @param obj The item to test if it is an Enumerable or not.
   * @returns True if the obj is an Enumerable. False if not.
   */
  public static isEnumerable(obj: unknown): obj is IEnumerable<unknown> {
    return isEnumerable(obj);
  }
}
