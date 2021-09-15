import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyFrom } from './applicators/applyFrom';

export function from<TSource>(src: Iterable<TSource>): IEnumerable<TSource> {
  return applyFrom(new EnumerableFactory(), src);
}

export function fromObject<TSource>(src: TSource): IEnumerable<[keyof TSource, TSource[keyof TSource]]> {
  return applyFrom(new EnumerableFactory(), src);
}
