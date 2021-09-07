import { aggregate } from './aggregate';
import { select } from './select';

export function min<TSource>(src: Iterable<TSource>): TSource;
export function min<TSource, TResult>(src: Iterable<TSource>, selector: (item: TSource) => TResult): TResult;
export function min<TSource, TResult>(src: Iterable<TSource>, selector?: (item: TSource) => TResult): TSource | TResult;
export function min<TSource, TResult>(
  src: Iterable<TSource>,
  selector?: (item: TSource) => TResult
): TSource | TResult {
  if (!selector) {
    return aggregate(src, (prev, curr) => (prev < curr ? prev : curr));
  }

  return select(src, selector).aggregate((prev, curr) => (prev < curr ? prev : curr));
}

export function minBy<TSource, TKey>(src: Iterable<TSource>, keySelector: (item: TSource) => TKey): TSource {
  return aggregate(src, (prev, curr) => (keySelector(prev) <= keySelector(curr) ? prev : curr));
}
