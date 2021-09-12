import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyAsEnumerable } from './applicators/applyAsEnumerable';

export function asEnumerable<TSource>(src: Iterable<TSource>): IEnumerable<TSource> {
  return applyAsEnumerable(Enumerable, src);
}
