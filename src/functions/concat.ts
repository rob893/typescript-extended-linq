import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyConcat } from './applicators/applyConcat';

export function concat<TSource>(src: Iterable<TSource>, ...collections: Iterable<TSource>[]): IEnumerable<TSource> {
  return applyConcat(new EnumerableFactory(), src, collections);
}
