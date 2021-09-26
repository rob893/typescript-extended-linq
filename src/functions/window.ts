import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyWindow } from './applicators/applyWindow';

export function window<TSource>(src: Iterable<TSource>, size: number): IEnumerable<IEnumerable<TSource>> {
  return applyWindow(new EnumerableFactory(), src, size);
}
