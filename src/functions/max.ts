import { EnumerableFactory } from '../EnumerableFactory';
import { applyMax } from './applicators/applyMax';

export function max<TSource, TResult>(
  src: Iterable<TSource>,
  selector?: (item: TSource) => TResult
): TSource | TResult {
  return applyMax(new EnumerableFactory(), src, x => x, selector);
}

export function maxBy<TSource, TKey>(src: Iterable<TSource>, keySelector: (item: TSource) => TKey): TSource {
  return applyMax(new EnumerableFactory(), src, keySelector);
}
