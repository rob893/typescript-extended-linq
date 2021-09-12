import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyIntersect } from './applicators/applyIntersect';

export function intersect<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): IEnumerable<TSource> {
  return applyIntersect(Enumerable, src, second, x => x, equalityComparer);
}

export function intersectBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  return applyIntersect(Enumerable, src, second, keySelector, equalityComparer);
}
