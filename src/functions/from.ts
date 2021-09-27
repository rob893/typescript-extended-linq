import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyFrom } from './applicators/applyFrom';

/**
 * Creates a new Enumerable from the input Iterable.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4];
 * const enumerable = from(numbers);
 * ```
 * @typeparam TSource The type of the Iterable.
 * @param src The Iterable to create an Enumerable from.
 * @returns A new Enumerable.
 */
export function from<TSource>(src: Iterable<TSource>): IEnumerable<TSource> {
  return applyFrom(new EnumerableFactory(), src);
}

/**
 * Creates a new Enumerable from the input Iterable.
 * @example
 * ```typescript
 * const obj = { foo: 'bar' };
 * const enumerable = from(obj);
 * ```
 * @typeparam TSource The type of the object.
 * @param src The object to create an Enumerable from.
 * @returns A new Enumerable.
 */
export function fromObject<TSource>(src: TSource): IEnumerable<[keyof TSource, TSource[keyof TSource]]> {
  return applyFrom(new EnumerableFactory(), src);
}
