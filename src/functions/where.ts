import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyWhere } from './applicators/applyWhere';

export function where<TSource>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => boolean
): IEnumerable<TSource> {
  return applyWhere(new EnumerableFactory(), src, exp);
}
