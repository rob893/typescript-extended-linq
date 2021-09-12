import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyFrom } from './applicators/applyFrom';

export function from<TSource>(src: Iterable<TSource>): IEnumerable<TSource>;

export function from<TSource>(src: TSource): IEnumerable<[keyof TSource, TSource[keyof TSource]]>;

export function from<TSource>(
  src: Iterable<TSource> | TSource
): IEnumerable<TSource | [keyof TSource, TSource[keyof TSource]]> {
  return applyFrom(Enumerable, src);
}
