import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyDistinct } from './applicators/applyDistinct';

export function distinct<TSource>(
  src: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): IEnumerable<TSource> {
  return applyDistinct(new EnumerableFactory(), src, x => x, equalityComparer);
}

export function distinctBy<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  return applyDistinct(new EnumerableFactory(), src, keySelector, equalityComparer);
}
