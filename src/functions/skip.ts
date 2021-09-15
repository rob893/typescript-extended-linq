import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applySkip, applySkipLast, applySkipWhile } from './applicators/applySkip';

export function skip<TSource>(src: Iterable<TSource>, count: number): IEnumerable<TSource> {
  return applySkip(new EnumerableFactory(), src, count);
}

export function skipLast<TSource>(src: Iterable<TSource>, count: number): IEnumerable<TSource> {
  return applySkipLast(new EnumerableFactory(), src, count);
}

export function skipWhile<TSource>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): IEnumerable<TSource> {
  return applySkipWhile(new EnumerableFactory(), src, predicate);
}
