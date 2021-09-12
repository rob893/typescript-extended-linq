import { Enumerable } from '../enumerables';
import { applyMax } from './applicators/applyMax';

export function max<TSource, TResult>(
  src: Iterable<TSource>,
  selector?: (item: TSource) => TResult
): TSource | TResult {
  return applyMax(Enumerable, src, x => x, selector);
}

export function maxBy<TSource, TKey>(src: Iterable<TSource>, keySelector: (item: TSource) => TKey): TSource {
  return applyMax(Enumerable, src, keySelector);
}
