import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { applyZip } from './applicators/applyZip';

export function zip<TSource, TSecond>(
  src: Iterable<TSource>,
  second: Iterable<TSecond>
): IEnumerable<[TSource, TSecond]>;

export function zip<TSource, TSecond, TResult>(
  src: Iterable<TSource>,
  second: Iterable<TSecond>,
  resultSelector: (first: TSource, second: TSecond) => TResult
): IEnumerable<TResult>;

export function zip<TSource, TSecond, TResult>(
  src: Iterable<TSource>,
  second: Iterable<TSecond>,
  resultSelector?: (first: TSource, second: TSecond) => TResult
): IEnumerable<[TSource, TSecond] | TResult>;

export function zip<TSource, TSecond, TResult>(
  src: Iterable<TSource>,
  second: Iterable<TSecond>,
  resultSelector?: (first: TSource, second: TSecond) => TResult
): IEnumerable<[TSource, TSecond] | TResult> {
  return applyZip(new EnumerableFactory(), src, second, resultSelector);
}
