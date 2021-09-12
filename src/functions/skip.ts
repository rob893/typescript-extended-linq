import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applySkip, applySkipLast, applySkipWhile } from './applicators/applySkip';

export function skip<TSource>(src: Iterable<TSource>, count: number): IEnumerable<TSource> {
  return applySkip(Enumerable, src, count);
}

export function skipLast<TSource>(src: Iterable<TSource>, count: number): IEnumerable<TSource> {
  return applySkipLast(Enumerable, src, count);
}

export function skipWhile<TSource>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): IEnumerable<TSource> {
  return applySkipWhile(Enumerable, src, predicate);
}
