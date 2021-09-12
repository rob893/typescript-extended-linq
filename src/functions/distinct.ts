import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyDistinct } from './applicators/applyDistinct';

export function distinct<TSource>(
  src: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): IEnumerable<TSource> {
  return applyDistinct(Enumerable, src, x => x, equalityComparer);
}

export function distinctBy<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  return applyDistinct(Enumerable, src, keySelector, equalityComparer);
}
