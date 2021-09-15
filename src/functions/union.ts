import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyUnion } from './applicators/applyUnion';

export function union<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): IEnumerable<TSource> {
  return applyUnion(new EnumerableFactory(), src, second, x => x, equalityComparer);
}

export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  return applyUnion(new EnumerableFactory(), src, second, keySelector, equalityComparer);
}
