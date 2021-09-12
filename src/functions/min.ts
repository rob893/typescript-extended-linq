import { Enumerable } from '../enumerables';
import { applyMin } from './applicators/applyMin';

export function min<TSource>(src: Iterable<TSource>): TSource;

export function min<TSource, TResult>(src: Iterable<TSource>, selector: (item: TSource) => TResult): TResult;

export function min<TSource, TResult>(
  src: Iterable<TSource>,
  selector?: (item: TSource) => TResult
): TSource | TResult {
  return applyMin(Enumerable, src, x => x, selector);
}

export function minBy<TSource, TKey>(src: Iterable<TSource>, keySelector: (item: TSource) => TKey): TSource {
  return applyMin(Enumerable, src, keySelector);
}
