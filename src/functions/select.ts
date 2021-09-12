import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applySelect, applySelectMany } from './applicators/applySelect';

export function select<TSource, TResult>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => TResult
): IEnumerable<TResult> {
  return applySelect(Enumerable, src, exp);
}

export function selectMany<TSource, TResult>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => Iterable<TResult>
): IEnumerable<TResult> {
  return applySelectMany(Enumerable, src, exp);
}
