import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyAsEnumerable } from './applicators/applyAsEnumerable';

export function asEnumerable<TSource>(src: Iterable<TSource>): IEnumerable<TSource> {
  return applyAsEnumerable(new EnumerableFactory(), src);
}
