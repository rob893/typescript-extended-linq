import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyConcat } from './applicators/applyConcat';

export function concat<TSource>(src: Iterable<TSource>, second: Iterable<TSource>): IEnumerable<TSource> {
  return applyConcat(Enumerable, src, second);
}
