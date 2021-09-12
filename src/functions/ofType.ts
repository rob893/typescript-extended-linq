import { TypeOfMember } from '../types';
import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyOfType } from './applicators/applyOfType';

export function ofType<TSource, TResult>(
  src: Iterable<TSource>,
  type: new (...params: unknown[]) => TResult
): IEnumerable<TResult>;

export function ofType<TSource, TResult>(src: Iterable<TSource>, type: TypeOfMember): IEnumerable<TResult>;

export function ofType<TSource, TResult>(
  src: Iterable<TSource>,
  type: (new (...params: unknown[]) => TResult) | TypeOfMember
): IEnumerable<TResult | TSource> {
  return applyOfType(Enumerable, src, type);
}
