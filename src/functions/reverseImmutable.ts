import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyReverseImmutable } from './applicators/applyReverseImmutable';

export function reverseImmutable<TSource>(src: Iterable<TSource>): IEnumerable<TSource> {
  return applyReverseImmutable(new EnumerableFactory(), src);
}
