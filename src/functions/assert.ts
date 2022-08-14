import { IEnumerable } from '../types';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { applyAssert } from './applicators/applyAssert';

/**
 * Tests a sequence with a given predicate. An error will be thrown if any element fails the sequence.
 * @example
 * ```typescript
 * const items = [1, 2, '3'];
 * const sum = from(items).assert(x => typeof x === 'number').sum(); // throws due to '3'
 * ```
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param predicate A function to test each element for a condition. If false, an error will be thrown.
 * @returns A sequence with source elements in their original order.
 */
export function assert<TSource>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): IEnumerable<TSource>;

/**
 * Tests a sequence with a given predicate. An error will be thrown if any element fails the sequence.
 * @example
 * ```typescript
 * const items = [1, 2, '3'];
 * const sum = from(items).assert(x => typeof x === 'number', 'Should be number').sum(); // throws due to '3'
 * ```
 * @typeparam TSource The type of source elements.
 * @param src The source iterable.
 * @param predicate A function to test each element for a condition. If false, an error will be thrown.
 * @param message The message to use for thrown errors.
 * @returns A sequence with source elements in their original order.
 */
export function assert<TSource>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean,
  message: string
): IEnumerable<TSource>;

/**
 * Tests a sequence with a given predicate. An error will be thrown if any element fails the sequence.
 * @example
 * ```typescript
 * class MyError extends Error {}
 * const items = [1, 2, '3'];
 * const sum = from(items).assert(x => typeof x === 'number', MyError).sum(); // throws instance of MyError due to '3'
 * ```
 * @typeparam TSource The type of source elements.
 * @typeparam TError The type of error to be thrown.
 * @param src The source iterable.
 * @param predicate A function to test each element for a condition. If false, an error will be thrown.
 * @param errorType Type of error to throw.
 * @returns A sequence with source elements in their original order.
 */
export function assert<TSource, TError extends Error>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean,
  errorType: new (message?: string) => TError
): IEnumerable<TSource>;

/**
 * Tests a sequence with a given predicate. An error will be thrown if any element fails the sequence.
 * @example
 * ```typescript
 * class MyError extends Error {}
 * const items = [1, 2, '3'];
 * const sum = from(items).assert(x => typeof x === 'number', 'Must be number', MyError).sum(); // throws instance of MyError with message due to '3'
 * ```
 * @typeparam TSource The type of source elements.
 * @typeparam TError The type of error to be thrown.
 * @param src The source iterable.
 * @param predicate A function to test each element for a condition. If false, an error will be thrown.
 * @param message The message to use for thrown errors.
 * @param errorType Type of error to throw.
 * @returns A sequence with source elements in their original order.
 */
export function assert<TSource, TError extends Error>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean,
  message: string,
  errorType: new (message?: string) => TError
): IEnumerable<TSource>;

export function assert<TSource, TError extends Error>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean,
  messageOrErrorType?: string | (new (message?: string) => TError),
  errorType?: new (message?: string) => TError
): IEnumerable<TSource> {
  return applyAssert(new EnumerableFactory(), src, predicate, messageOrErrorType, errorType);
}
