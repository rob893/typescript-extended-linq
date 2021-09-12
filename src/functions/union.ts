import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyUnion } from './applicators/applyUnion';

export function union<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): IEnumerable<TSource> {
  return applyUnion(Enumerable, src, second, x => x, equalityComparer);
}

export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  return applyUnion(Enumerable, src, second, keySelector, equalityComparer);
}
