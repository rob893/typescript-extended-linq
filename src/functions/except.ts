import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyExcept } from './applicators/applyExcept';

export function except<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): IEnumerable<TSource> {
  return applyExcept(Enumerable, src, second, x => x, equalityComparer);
}

export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  return applyExcept(Enumerable, src, second, keySelector, equalityComparer);
}
