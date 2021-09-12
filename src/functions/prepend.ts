import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyPrepend } from './applicators/applyPrepend';

export function prepend<TSource>(src: Iterable<TSource>, item: TSource): IEnumerable<TSource> {
  return applyPrepend(Enumerable, src, item);
}
