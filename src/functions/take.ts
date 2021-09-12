import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyTake, applyTakeEvery, applyTakeLast, applyTakeWhile } from './applicators/applyTake';

export function take<TSource>(src: Iterable<TSource>, count: number): IEnumerable<TSource> {
  return applyTake(Enumerable, src, count);
}

export function takeEvery<TSource>(src: Iterable<TSource>, step: number): IEnumerable<TSource> {
  return applyTakeEvery(Enumerable, src, step);
}

export function takeLast<TSource>(src: Iterable<TSource>, count: number): IEnumerable<TSource> {
  return applyTakeLast(Enumerable, src, count);
}

export function takeWhile<TSource>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): IEnumerable<TSource> {
  return applyTakeWhile(Enumerable, src, predicate);
}
