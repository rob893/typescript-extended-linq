import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { applyConcat } from './applicators/applyConcat';

export function concat<TSource>(src: Iterable<TSource>, second: Iterable<TSource>): IEnumerable<TSource> {
  return applyConcat(new EnumerableFactory(), src, second);
}
