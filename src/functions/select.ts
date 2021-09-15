import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { applySelect, applySelectMany } from './applicators/applySelect';

export function select<TSource, TResult>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => TResult
): IEnumerable<TResult> {
  return applySelect(new EnumerableFactory(), src, exp);
}

export function selectMany<TSource, TResult>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => Iterable<TResult>
): IEnumerable<TResult> {
  return applySelectMany(new EnumerableFactory(), src, exp);
}
