import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { applyReverse } from './applicators/applyReverse';

export function reverse<TSource>(src: Iterable<TSource>): IEnumerable<TSource> {
  return applyReverse(new EnumerableFactory(), src);
}
