import { IEnumerable } from '../types';
import { applyAppend } from './applicators/applyAppend';
import { EnumerableFactory } from '../utilities/EnumerableFactory';

export function append<TSource>(src: Iterable<TSource>, item: TSource): IEnumerable<TSource> {
  return applyAppend(new EnumerableFactory(), src, item);
}
