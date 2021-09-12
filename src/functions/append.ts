import { IEnumerable } from '../types';
import { Enumerable } from '../enumerables';
import { applyAppend } from './applicators/applyAppend';

export function append<TSource>(src: Iterable<TSource>, item: TSource): IEnumerable<TSource> {
  return applyAppend(Enumerable, src, item);
}
