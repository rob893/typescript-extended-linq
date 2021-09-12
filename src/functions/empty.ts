import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyEmpty } from './applicators/applyEmpty';

export function empty<TSource>(): IEnumerable<TSource> {
  return applyEmpty(Enumerable);
}
