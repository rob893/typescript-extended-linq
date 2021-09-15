import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { applyQuantile } from './applicators/applyQuantile';

export function quantile<TSource>(src: Iterable<TSource>, selector: (item: TSource) => number, q: number): number {
  return applyQuantile(new EnumerableFactory(), src, selector, q);
}
