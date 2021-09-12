import { Enumerable } from '../enumerables';
import { applyQuantile } from './applicators/applyQuantile';

export function quantile<TSource>(src: Iterable<TSource>, selector: (item: TSource) => number, q: number): number {
  return applyQuantile(Enumerable, src, selector, q);
}
