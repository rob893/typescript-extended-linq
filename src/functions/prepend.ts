import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { applyPrepend } from './applicators/applyPrepend';

export function prepend<TSource>(src: Iterable<TSource>, item: TSource): IEnumerable<TSource> {
  return applyPrepend(new EnumerableFactory(), src, item);
}
