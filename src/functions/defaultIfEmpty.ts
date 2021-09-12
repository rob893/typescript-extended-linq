import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyDefaultIfEmpty } from './applicators/applyDefaultIfEmpty';

export function defaultIfEmpty<TSource>(src: Iterable<TSource>, defaultItem: TSource): IEnumerable<TSource> {
  return applyDefaultIfEmpty(Enumerable, src, defaultItem);
}
